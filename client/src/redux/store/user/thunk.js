import Cookies from 'universal-cookie'
import axios from '../../../utils/axios'
import { show } from '../modal'
import iconError from '../../../components/Icon/error.svg'
import { setLoaded, setLoading, setProfile, setTournaments } from '.'

const cookies = new Cookies(null, { path: '/' })

export const getProfile = async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const res = await axios.get('/api/user/profile')
    const { data: { success, user } = {} } = res
    if (!success) return
    dispatch(setProfile({ ...user, authorized: true }))
  } catch(e) {
    const error = e.response?.data?.error
    if (error === 'empty_account') {
      dispatch(show({ name: 'alert', icon: iconError, text: 'К вашему аккаунту не привязан профиль «Мира Танков»' }))
      cookies.remove('token')
    }
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