import { createSelector } from 'reselect'

export const getList = createSelector(
  (state, listName) => listName,
  state => state.tournaments.map,
  state => state.tournaments.list,
  (listName, map, list) => {
    return (list[listName] || []).map(item => map[item])
  }
)