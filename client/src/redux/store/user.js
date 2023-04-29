import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    isLoaded: false,
    authorized: false,
    profile: {}
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
    }
  },
})

export const { setLoading, setLoaded, setProfile } = userSlice.actions

export default userSlice.reducer