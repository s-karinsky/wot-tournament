import Ban from '../models/ban.js'

export const getTournamentsBan = (account_id, clan_id) =>
  Ban.findOne({ $or: [{ id: account_id }, { id: clan_id }], endDate: { $gte: Date.now() } })