import axios from 'axios'
import { setLoaded, setLoading, setNews, setClan } from '.'

export const getNews = async (dispatch) => {
  try {
    const result = await axios.get('/api/news')
    const news = result.data?.news || []
    dispatch(setNews(news))
  } catch (e) {
    console.error(e)
  }
}

export const getClan = async (dispatch) => {
  try {
    const result = await axios.get('/api/clan')
    const { data } = result
    const clanMap = data.clan
    const clanId = Object.keys(clanMap)[0]
    const clanData = clanMap[clanId]
    dispatch(setClan(clanData))
  } catch(e) {
    console.error(e)
  }
}

export const getData = async (dispatch) => {
  dispatch(setLoading(true))
  Promise.all([
    getClan(dispatch),
    getNews(dispatch)
  ]).finally(() => {
    dispatch(setLoading(false))
    dispatch(setLoaded(true))
  })
}