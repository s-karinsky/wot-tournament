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
    const { data: { success, clan } = {} } = result
    if (!success) return
    dispatch(setClan(clan))
  } catch(e) {
    console.error(e)
  }
}

export const getData = async (dispatch) => {
  dispatch(setLoading(true))
  await Promise.all([
    getClan(dispatch),
    getNews(dispatch)
  ])
  dispatch(setLoading(false))
  dispatch(setLoaded(true))
}