import dbConnect from './server/utils/dbConnect.js'
import Reserves from './server/models/reserves.js'
import axios from './server/utils/axios.js'

const { API_KEY } = process.env

function convertTimezone(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

function leadZero(num) {
  return num < 10 ? `0${num}` : num
}

dbConnect().then(async () => {
  console.log('Db connected success')
  
  const date = convertTimezone(new Date(), 'Europe/Moscow')
  const weekday = date.getDay() === 0 ? 7 : date.getDay()
  const time = `${leadZero(date.getHours())}:${leadZero(date.getMinutes())}`
  const tasks = await Reserves.find({ weekday, time }).exec()
  const postPromises = []
  console.log(tasks)
  await Promise.all(tasks.map(async (task) => {
    const response = await axios.get(`/stronghold/clanreserves/?application_id=${API_KEY}&access_token=${task.token}`)
    return { task, data: response.data?.data }
  })).then(items => {
    items.forEach(item => {
      const { task: { token, type, startFrom }, data } = item
      const reserve = data.find(res => res.type === type)
      if (!reserve || !['min', 'max'].includes(startFrom)) return
      let level
      const inStock = reserve.in_stock
      inStock.forEach(stock => {
        if (level === undefined) level = stock.level
        else {
          level = Math[startFrom](level, stock.level)
        }
      })
      const formData = new FormData()
      formData.append('access_token', token)
      formData.append('application_id', API_KEY)
      formData.append('reserve_level', level)
      formData.append('reserve_type', type)
      postPromises.push(axios.post(`/stronghold/activateclanreserve/`, formData))
    })
  })
  await Promise.all(postPromises)
    .then(res => console.log(res[0]?.request, res[0]?.data))
    .catch(err => console.log('err', err))

  process.exit(0)
})