import Settings from '../models/settings.js'

export default async function getSettings(name) {
  const settings = await Settings.find({ key: name }).lean()
  if (!settings || !settings[0]) return null
  return settings[0][name]
}