import { createSelector } from 'reselect'

export const getModalState = createSelector(
  state => state.modal,
  (state, name) => name,
  (modal, name) => {
    const visibility = modal.visibilityMap[name] || false
    const props = modal.propsMap[name] || null
    return { visibility, props }
  }
)