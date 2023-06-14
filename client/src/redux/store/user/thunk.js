import axios from 'axios'
import { setLoaded, setLoading, setProfile, setTournaments } from '.'

export const getProfile = async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const res = await axios.get('/api/user/profile')
    const { data: { success, user } = {} } = res
    if (!success) return
    dispatch(setProfile({ ...user, authorized: true }))
  } catch(e) {
    console.error(e)
  }
  dispatch(setLoading(false))
  dispatch(setLoaded(true))
}

export const getUserTournaments = (id) => async (dispatch) => {
  try {
    const res = await axios.get('/api/tournament/my', { params: { id } })
    const { data: { success, result } = {} } = res
    if (!success) return
    const params = id ? { id, tournament: result } : result.reduce((res, item) => ({
      ...res,
      [item.tournament?.id]: item
    }), {})
    dispatch(setTournaments(params))
  } catch(e) {
    console.error(e)
  }
}