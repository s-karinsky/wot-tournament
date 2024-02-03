import Settings from '../models/settings.js'

export default async function getSettings(name) {
  const settings = await Settings.find()
  if (!settings) return null
  return settings[name]
}