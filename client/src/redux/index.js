import { configureStore } from '@reduxjs/toolkit'
import dataReducer from './store/data'
import tournamentsReducer from './store/tournaments'
import userReducer from './store/user'

export default configureStore({
  reducer: {
    data: dataReducer,
    tournaments: tournamentsReducer,
    user: userReducer
  },
})