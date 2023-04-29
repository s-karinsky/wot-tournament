import { configureStore } from '@reduxjs/toolkit'
import dataReducer from './store/data'
import userReducer from './store/user'

export default configureStore({
  reducer: {
    data: dataReducer,
    user: userReducer
  },
})