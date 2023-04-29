import axios from 'axios'
import { setLoaded, setLoading, setProfile } from "."

export const getProfile = async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const res = await axios.get('/api/user/profile')
    dispatch(setLoading(false))
    dispatch(setLoaded(true))
    const { data = {} } = res
    if (data.status !== 'ok') return
    const userMap = data.data
    const userId = Object.keys(userMap)[0]
    const userData = userMap[userId]
    dispatch(setProfile({ ...userData, authorized: true }))
  } catch(e) {
    dispatch(setLoading(false))
    dispatch(setLoaded(true))
  }
}