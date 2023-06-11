import axios from 'axios'
import iconError from '../../../components/Icon/error.svg'
import { getUserTournaments } from '../user'
import { show } from '../modal'
import {
  setIsCreating,
  setTournament,
  setTournaments,
  setList,
  setUsersByTournament,
  setPendingJoin,
  setPendingReset
} from '.'

export const createTournament = (data, onSuccess = () => {}) => async (dispatch) => {
  dispatch(setIsCreating(true))
  try {
    const result = await axios.post('/api/tournament/create', data)
    dispatch(setTournament(result.data?.result))
    dispatch(setIsCreating(false))
    onSuccess(result.data?.result)
  } catch (e) {
    console.error(e)
  }
}

export const getTournament = id => async (dispatch) => {
  try {
    const result = await axios.get('/api/tournament/get', { params: { id } })
    dispatch(setTournament(result.data?.tournament))
  } catch (e) {
    console.error(e)
  }
}

export const getTournaments = (list, params) => async (dispatch) => {
  try {
    const result = await axios.get('/api/tournament/get', { params })
    const items = result.data?.tournaments || []
    dispatch(setTournaments(items))
    dispatch(setList({
      list,
      items: items.sort((a, b) => new Date(a.startDate) > new Date(b.startDate) ? -1 : 1).map(item => item._id)
    }))
  } catch (e) {
    console.error(e)
  }
}

export const getUsersByTournament = id => async (dispatch) => {
  try {
    const result = await axios.get('/api/tournament/users', { params: { id } })
    dispatch(setUsersByTournament({ id, users: result.data.users || [] }))
  } catch (e) {
    console.error(e)
  }
}

export const joinTournament = id => async (dispatch) => {
  try {
    dispatch(setPendingJoin({ [id]: true }))
    const response = await axios.post('/api/tournament/join', { id })
    const { data } = response
    if (!data.success) {
      dispatch(show({ name: 'alert', icon: iconError, text: data.error }))
    } else {
      await Promise.all([
        dispatch(getUserTournaments(id)),
        dispatch(getUsersByTournament(id))
      ])
    }
    dispatch(setPendingJoin({ [id]: false }))
  } catch (e) {
    console.error(e)
  }
}

export const resetTournament = id => async (dispatch) => {
  try {
    dispatch(setPendingReset({ [id]: true }))
    await axios.post('/api/tournament/reset', { id })
    await dispatch(getUserTournaments(id))
    dispatch(setPendingReset({ [id]: false }))
  } catch (e) {
    console.error(e)
  }
}