import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    isLoaded: false,
    authorized: false,
    profile: {},
    tournaments: {}
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setLoaded: (state, action) => {
      state.isLoaded = action.payload
    },
    setProfile: (state, action) => {
      const { authorized = false, ...profile } = action.payload
      state.authorized = authorized
      state.profile = profile
    },
    setTournaments: (state, action) => {
      const { payload } = action
      if (payload.id && payload.tournament) {
        state.tournaments[payload.id] = payload.tournament
      } else {
        state.tournaments = payload
      }
    }
  },
})

export const {
  setLoading,
  setLoaded,
  setProfile,
  setTournaments
} = userSlice.actions

export * from './selectors'

export * from './thunk'

export default userSlice.reducer