import { createSelector } from 'reselect'

export const getClanRole = createSelector(
  state => state.data?.clan?.members || [],
  (state, userId) => userId,
  (members, userId) => {
    const member = members.find(item => item.account_id === userId)
    return member && member.role
  }
)