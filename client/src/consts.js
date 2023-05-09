export const VALIDATION_MESSAGES = {
  startDate: 'Не выбрана дата начала турнира',
  endDate: 'Не выбрана дата окончания турнира',
  invalidDateRange: 'Дата начала турнира должны быть меньше даты окончания',
  tanks: 'Не выбрана техника',
  places: 'Не все призовые места описаны'
}

export const TANKS_TYPES = {
  any: 'Любой тип',
  light: 'Лёгкие',
  medium: 'Средние',
  heavy: 'Тяжелые',
  SPG: 'САУ',
  ATSPG: 'ПТ-САУ'
}

export const BATTLE_TYPES = {
  random: 'Случайный',
  assault: 'Штурм',
  meeting: 'Встречный'
}

export const CONDITION_TYPES = {
  damage: 'Урон',
  damageHighlight: 'Урон + насвет',
  highlight: 'Насвет',
  blocking: 'Заблокированно броней',
  stun: 'Оглушение'
}
