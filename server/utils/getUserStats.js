import axios from './axios.js'

const { API_KEY } = process.env

export default async (accountId, tanks) => {
  const tanksId = tanks.map(tank => tank.id).join(',')
  const response = await axios.get(`/tanks/stats/?application_id=${API_KEY}&account_id=${accountId}&tank_id=${tanksId}`)
  const data = (response.data?.data || {})[accountId]

  if (!data || !Array.isArray(data)) {
    throw new Error('Вы не можете принять участие в турнире, у вас нет подходящей техники')
  }

  const initialStats = data.reduce((acc, item) => {
    const { all } = item
    if (all) {
      acc.battles += all.battles
      acc.damage += all.damage_dealt
      acc.spotted += all.spotted
      acc.damageSpotted += (all.damage_dealt + all.spotted)
      acc.blocked += all.avg_damage_blocked * all.battles
      acc.stun += all.stun_number
    }
    return acc
  }, {
    battles: 0,
    damage: 0,
    spotted: 0,
    damageSpotted: 0,
    blocked: 0,
    stun: 0
  })

  return {
    random: initialStats,
    assault: initialStats,
    meeting: initialStats
  }
}