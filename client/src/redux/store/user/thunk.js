import axios from 'axios'
import { setLoaded, setLoading, setProfile } from "."

export const getProfile = async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const res = await axios.get('/api/user/profile')
    dispatch(setLoading(false))
    dispatch(setLoaded(true))
    const { data: { success, user } = {} } = res
    if (!success) return
    dispatch(setProfile({ ...user, authorized: true }))
  } catch(e) {
    dispatch(setLoading(false))
    dispatch(setLoaded(true))
  }
}