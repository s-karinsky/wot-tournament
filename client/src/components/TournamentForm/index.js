import { useState, useCallback } from 'react'
import axios from 'axios'
import cn from 'classnames'
import { useLazyEffect } from '../../utils/hooks'
import { Button, Checkbox, Input, Select, Range } from '../Form'
import Loader from '../Loader'
import styles from './styles.module.scss'

const VALIDATION_MESSAGES = {
  startDate: 'Не выбрана дата начала турнира',
  endDate: 'Не выбрана дата окончания турнира',
  invalidDateRange: 'Дата начала турнира должны быть меньше даты окончания',
  tanks: 'Не выбрана техника',
  places: 'Не все призовые места описаны'
}

export default function TournamentForm() {
  const [ values, setValues ] = useState({
    startDate: '',
    endDate: '',
    battleType: '1',
    minFights: 5,
    type: 'any',
    level: 6,
    tanks: [],
    resetCount: 1,
    places: [''],
  })
  const [ tanks, setTanks ] = useState([])
  const [ isTanksLoading, setIsTanksLoading ] = useState(true)
  const [ validationErros, setValidationErrors ] = useState({})

  useLazyEffect(() => {
    setIsTanksLoading(true)
    axios.get(`/api/tanks?type=${values.type}&level=${values.level}`)
      .then(({ data = {} }) => {
        if (!data.success) return
        setTanks(data.tanks)
        setValues(values => ({
          ...values,
          tanks: data.tanks.map(item => item.id)
        }))
        setIsTanksLoading(false)
      })
      .catch(error => {
        console.error(error)
      })
  }, [values.type, values.level], 1000)

  const handleSubmit = useCallback(e => {
    e.preventDefault()
    const { startDate, endDate, tanks = [], places = [] } = values
    let validationErros = {}
    if (!startDate) validationErros.startDate = VALIDATION_MESSAGES.startDate
    if (!endDate) validationErros.endDate = VALIDATION_MESSAGES.endDate
    if (startDate && endDate && new Date(startDate).getTime() > new Date(endDate).getTime()) {
      validationErros.invalidDateRange = VALIDATION_MESSAGES.invalidDateRange
    }
    if (!tanks.length) validationErros.tanks = VALIDATION_MESSAGES.tanks
    if (!places.reduce((res, place) => res && !!place, true)) {
      validationErros.places = VALIDATION_MESSAGES.places
    }
    setValidationErrors(validationErros)
    if (!Object.values(validationErros).length) {
      // submit
    }
  }, [values])

  const handleChange = useCallback(e => {
    const { name, value } = e.target
    if (Object.values(validationErros).length > 0) {
      setValidationErrors({})
    }

    if (name === 'tanks') {
      const newTanks = values.tanks.includes(value) ? values.tanks.filter(id => id !== value) : [...values.tanks, value]
      setValues({
        ...values,
        tanks: newTanks
      })
      return
    }
    if (name.indexOf('place') === 0) {
      const places = values.places
      const index = parseInt(name.split('_')[1])
      places[index] = value
      setValues({
        ...values,
        places
      })
      return
    }

    setValues({
      ...values,
      [name]: value
    })
  }, [values])

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formColumns}>
        <div className={styles.formLeft}>
          <div className={cn(styles.formBlock, styles.formBlock_bordered)}>
            <Input
              label='Начало турнира'
              type='date'
              name='startDate'
              value={values.startDate}
              onChange={handleChange}
              width="150px"
            />
            <Input
              label='Окончание турнира'
              type='date'
              name='endDate'
              value={values.endDate}
              onChange={handleChange}
              width="150px"
            />
          </div>
          <div className={styles.tanksFilter}>
            <div className={styles.tanksFilterItem}>
              <Select
                label='Тип танка для турнира'
                name='type'
                value={values.type}
                onChange={handleChange}
                width="320px"
              >
                <option value='any'>Любой тип</option>
                <option value='light'>Лёгкие</option>
                <option value='medium'>Средние</option>
                <option value='heavy'>Тяжелые</option>
                <option value='SPG'>САУ</option>
                <option value='AT-SPG'>ПТ-САУ</option>
              </Select>
            </div>
            <div className={styles.tanksFilterItem}>
              <Range
                label='Уровень техники'
                name='level'
                min={6}
                max={10}
                value={values.level}
                onChange={handleChange}
                width="320px"
              />
            </div>
          </div>
          <div className={cn(styles.formBlock, styles.formBlock_bordered)}>
            <Select
              label='Режим боя'
              name='battleType'
              value={values.battleType}
              onChange={handleChange}
              width="320px"
            >
              <option value='1'>Случайный</option>
              <option value='2'>Штурм</option>
              <option value='3'>Встречный</option>
            </Select>
          </div>
          <div className={cn(styles.formBlock, styles.formBlock_bordered)}>
            <Select
              label='Условие турнира'
              name='condition'
              value={values.condition}
              onChange={handleChange}
              width="320px"
            >
              <option value='1'>Урон</option>
              <option value='2'>Урон + насвет</option>
              <option value='3'>Насвет</option>
              <option value='4'>Заблокированно броней</option>
              {values.type === 'AT-SPG' && <option value='5'>Оглушение</option>}
            </Select>
          </div>
        </div>
        <div className={styles.formRight}>
          <div className={styles.tanksBlock}>
            <div>Техника</div>
            {isTanksLoading && <Loader />}
            {!isTanksLoading && <>
              <Checkbox
                onChange={e => {
                  const newTanks = values.tanks.length === tanks.length ? [] : tanks.map(tank => tank.id)
                  setValues({ ...values, tanks: newTanks })
                }}
                checked={values.tanks.length === tanks.length}
              >
                Выделить все
              </Checkbox>
              <div className={styles.tanksList}>
                {tanks.map(tank => (
                  <Checkbox
                    key={tank.id}
                    name='tanks'
                    value={tank.id}
                    onChange={handleChange}
                    checked={values.tanks.includes(tank.id)}
                    className={styles.tanksItem}
                  >
                    <span className={styles.flag} style={{ backgroundImage: `url(/img/flag-${tank.country}.png)` }}></span>
                    {tank.name}
                  </Checkbox>
                ))}
              </div>
            </>}
          </div>
        </div>
      </div>
      <div className={styles.formColumns}>
        <div className={styles.formBlock}>
          <Range
            label='Мин. кол-во боев для попадания на призовое место'
            name='minFights'
            min={5}
            max={100}
            value={values.minFights}
            onChange={handleChange}
            width="450px"
          />
        </div>
        <div className={styles.formBlock}>
          <Range
            label='Количество обнулений данных'
            name='resetCount'
            min={1}
            max={100}
            value={values.resetCount}
            onChange={handleChange}
            width="450px"
          />
        </div>
      </div>
      <div className={styles.placesBlock}>
        <div>Призовые места</div>
        <ol className={styles.placesList}>
          {values.places.map((place, i) => (
            <li className={styles.placesItem} key={i}>
              <span className={styles.placesInner}>
                <Input
                  name={`place_${i}`}
                  value={place}
                  onChange={handleChange}
                  width="860px"
                />  
              </span>
              <span
                className={styles.placeButton}
                onClick={() => {
                  let places = values.places
                  if (i === places.length - 1) {
                    places.push('')
                  } else {
                    places = places.filter((item, num) => num !== i)
                  }
                  setValues({ ...values, places })
                }}
              >
                {i === values.places.length - 1 ? '+' : '−'}
              </span>
            </li>
          ))}
        </ol>
      </div>
      {Object.keys(validationErros).length > 0 && <div className={styles.errors}>
        {Object.keys(validationErros).map(key => {
          if (!validationErros[key]) return null
          return (
            <div className={styles.errorMessage}>
              {validationErros[key]}
            </div>
          )
        })}
      </div>}
      <Button
        type='submit'
      >
        Создать турнир
      </Button>
    </form>
  )
}