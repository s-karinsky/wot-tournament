import dayjs from 'dayjs'

export const getStartTimeTZ = date => {
  const moscowOffset = -180
  const timezoneOffset = new Date().getTimezoneOffset()
  const moscowMins = 12 * 60
  const timezoneMins = moscowMins - (timezoneOffset - moscowOffset)
  return dayjs(date).minute(timezoneMins)
}

export const getEndTimeTZ = date => {
  const moscowOffset = -180
  const timezoneOffset = new Date().getTimezoneOffset()
  const moscowMins = 24 * 60 - 1
  const timezoneMins = moscowMins - (timezoneOffset - moscowOffset)
  return dayjs(date).minute(timezoneMins).second(59)
}