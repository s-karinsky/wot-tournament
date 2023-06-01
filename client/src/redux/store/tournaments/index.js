import { createSlice } from '@reduxjs/toolkit'

export const tournamentsSlice = createSlice({
  name: 'tournaments',
  initialState: {
    isCreating: false,
    map: {},
    list: {},
    listStatus: {},
    mapUsersByTournament: {},
  },
  reducers: {
    setIsCreating: (state, action) => {
      state.isCreating = action.payload
    },
    setTournament: (state, action) => {
      const { _id, ...data } = action.payload
      state.map[_id] = { _id, ...data }
    },
    setTournaments: (state, action) => {
      const map = action.payload.reduce((acc, item) => ({
        ...acc,
        [item.id]: item
      }), {})
      state.map = {
        ...state.map,
        ...map
      }
    },
    setList: (state, action) => {
      const { list, items, status } = action.payload
      if (items) {
        state.list[list] = items
      }
      if (status) {
        state.listStatus[list] = status
      }
    },
    setUsersByTournament: (state, action) => {
      const { id, users } = action.payload
      state.mapUsersByTournament[id] = users
    }
  },
})

export const {
  setIsCreating,
  setTournament,
  setTournaments,
  setList,
  setUsersByTournament
} = tournamentsSlice.actions

export * from './thunk'

export * from './selectors'

export default tournamentsSlice.reducer