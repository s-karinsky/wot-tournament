import { useState, useCallback } from 'react'
import axios from 'axios'
import { useLazyEffect } from '../../utils/hooks'
import { Checkbox, Input, Select, Range } from '../Form'
import Loader from '../Loader'
import styles from './styles.module.scss'

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
  const [ isTanksLoading, setIsTanksLoading ] = useState(false)

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

  const handleChange = useCallback(e => {
    const { name, value } = e.target
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
    <div>
      <div className={styles.formBlock}>
        <Input
          label='Начало турнира'
          type='date'
          name='startDate'
          value={values.startDate}
          onChange={handleChange}
        />
        <Input
          label='Окончание турнира'
          type='date'
          name='endDate'
          value={values.endDate}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formBlock}>
        <Select
          label='Режим боя'
          name='battleType'
          value={values.battleType}
          onChange={handleChange}
        >
          <option value='1'>Случайный</option>
          <option value='2'>Штурм</option>
          <option value='3'>Встречный</option>
        </Select>
      </div>
      <Range
        label='Мин. кол-во боев для попадания на призовое место'
        name='minFights'
        min={5}
        max={100}
        value={values.minFights}
        onChange={handleChange}
      />
      <Select
        label='Тип танка для турнира'
        name='type'
        value={values.type}
        onChange={handleChange}
      >
        <option value='any'>Любой тип</option>
        <option value='light'>Лёгкие</option>
        <option value='medium'>Средние</option>
        <option value='heavy'>Тяжелые</option>
        <option value='SPG'>САУ</option>
        <option value='AT-SPG'>ПТ-САУ</option>
      </Select>
      <Range
        label='Уровень техники'
        name='level'
        min={6}
        max={10}
        value={values.level}
        onChange={handleChange}
      />

      <div className={styles.tanksBlock}>
        <div>Техника</div>
        {isTanksLoading && <Loader isStatic />}
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

      <Range
        label='Количество обнулений данных'
        name='resetCount'
        min={1}
        max={100}
        value={values.resetCount}
        onChange={handleChange}
      />

      <Select
        label='Условие турнира'
        name='condition'
        value={values.condition}
        onChange={handleChange}
      >
        <option value='1'>Урон</option>
        <option value='2'>Урон + насвет</option>
        <option value='3'>Насвет</option>
        <option value='4'>Заблокированно броней</option>
        {values.type === 'AT-SPG' && <option value='5'>Оглушение</option>}
      </Select>

      <div className={styles.placesBlock}>
        <div>Призовые места</div>
        <ol className={styles.placesList}>
          {values.places.map((place, i) => (
            <li className={styles.placesItem} key={i}>
              <Input
                name={`place_${i}`}
                value={place}
                onChange={handleChange}
              />
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
    </div>
  )
}