import { configureStore } from '@reduxjs/toolkit'
import dataReducer from './store/data'
import modalReducer from './store/modal'
import tournamentsReducer from './store/tournaments'
import userReducer from './store/user'

export default configureStore({
  reducer: {
    data: dataReducer,
    modal: modalReducer,
    tournaments: tournamentsReducer,
    user: userReducer
  },
})