import { createSlice } from '@reduxjs/toolkit'

export const newsSlice = createSlice({
  name: 'data',
  initialState: {
    isLoading: false,
    isLoaded: false,
    news: [],
    clan: {}
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setLoaded: (state, action) => {
      state.isLoaded = action.payload
    },
    setNews: (state, action) => {
      state.news = action.payload
    },
    setClan: (state, action) => {
      state.clan = action.payload
    }
  },
})

export const { setLoading, setLoaded, setNews, setClan } = newsSlice.actions

export * from './thunk'

export default newsSlice.reducer