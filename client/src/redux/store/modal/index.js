import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    visibilityMap: {},
    propsMap: {}
  },
  reducers: {
    show: (state, action) => {
      const { payload } = action
      if (typeof payload === 'object') {
        const { name, ...props } = payload
        state.visibilityMap[name] = true
        state.propsMap[name] = props
      } else {
        state.visibilityMap[action.payload] = true
      }
    },
    hide: (state, action) => {
      state.visibilityMap[action.payload] = false
    }
  },
})

export const {
  show,
  hide
} = modalSlice.actions

export * from './selectors'

export * from './thunk'

export default modalSlice.reducer