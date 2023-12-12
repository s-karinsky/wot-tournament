export const dateToNumber = str => parseInt(str.substr(0, 10).replaceAll('-', ''))

export const numberToDate = num => {
  const str = `${num}`
  const date = str.substr(6, 2)
  const month = str.substr(4, 2)
  const year = str.substr(0, 4)
  return `${year}-${month}-${date}`
}