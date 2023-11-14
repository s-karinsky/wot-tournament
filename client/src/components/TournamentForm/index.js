import { useState, useCallback, useEffect } from 'react'
import cn from 'classnames'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios'
import { useLazyEffect } from '../../utils/hooks'
import { createTournament } from '../../redux/store/tournaments'
import { show, hide } from '../../redux/store/modal'
import { Button, Checkbox, Input, Select, Radio, Range } from '../Form'
import Loader from '../Loader'
import Modal from '../Modal'
import styles from './styles.module.scss'
import { VALIDATION_MESSAGES, TANKS_TYPES, BATTLE_TYPES, CONDITION_TYPES } from '../../consts'

export default function TournamentForm() {
  const [ values, setValues ] = useState({
    startDate: '',
    endDate: '',
    battleType: 'random',
    minBattles: 5,
    type: 'lightTank',
    conditions: [],
    tier: 6,
    tanks: [],
    resetLimit: 1,
    places: [''],
  })
  const [ tanks, setTanks ] = useState([])
  const [ isTanksLoading, setIsTanksLoading ] = useState(true)
  const [ validationErros, setValidationErrors ] = useState({})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isCreating = useSelector(state => state.tournaments.isCreating)

  useEffect(() => {
    return () => {
      dispatch(hide('createTournament'))
    }
  }, [])

  useLazyEffect(() => {
    setIsTanksLoading(true)
    axios.get(`/api/tanks?type=${values.type}&tier=${values.tier}`)
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
  }, [values.type, values.tier], 1000)

  const handleSubmit = useCallback(e => {
    e.preventDefault()
    const { startDate, endDate, tanks = [], places = [], conditions = [] } = values
    let erros = {}
    if (!startDate) erros.startDate = VALIDATION_MESSAGES.startDate
    if (!endDate) erros.endDate = VALIDATION_MESSAGES.endDate
    if (startDate && endDate && new Date(startDate).getTime() > new Date(endDate).getTime()) {
      erros.invalidDateRange = VALIDATION_MESSAGES.invalidDateRange
    }
    if (!tanks.length) erros.tanks = VALIDATION_MESSAGES.tanks
    if (!conditions.length) erros.conditions = VALIDATION_MESSAGES.conditions
    if (!places.reduce((res, place) => res && !!place, true)) {
      erros.places = VALIDATION_MESSAGES.places
    }
    setValidationErrors(erros)
    if (!Object.values(erros).length) {
      dispatch(show('createTournament'))
    }
  }, [values])

  const handleChange = useCallback(e => {
    const { name, value, checked } = e.target
    if (Object.values(validationErros).length > 0) {
      setValidationErrors({})
    }

    if (name === 'conditions') {
      let newConditions = values.conditions
      if (newConditions.includes(value) && !checked) {
        newConditions = newConditions.filter(item => item !== value)
      } else if (!newConditions.includes(value) && checked) {
        newConditions.push(value)
      }
      setValues({
        ...values,
        conditions: newConditions
      })
      return
    }
    if (name === 'tanks') {
      const tankId = parseInt(value)
      const newTanks = values.tanks.includes(tankId) ? values.tanks.filter(id => id !== tankId) : [...values.tanks, tankId]
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
  }, [values, validationErros])

  const handleCreateTournament = useCallback(() => {
    dispatch(createTournament({ ...values }, result => {
      navigate(`/tournaments/${result._id}`)
    }))
  }, [values])

  return (
    <div>
      <Modal
        name='createTournament'
        title={isCreating ? '' : 'Подтвердите данные турнира'}
      >
        {isCreating ? 
          <Loader /> :
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <b>Начало турнира</b> {dayjs(values.startDate).format('DD.MM.YYYY')}
            </div>
            <div className={styles.summaryItem}>
              <b>Окончание турнира</b> {dayjs(values.endDate).format('DD.MM.YYYY')}
            </div>
            <div className={styles.summaryItem}>
              <b>Тип танка </b> {TANKS_TYPES[values.type]}
            </div>
            <div className={styles.summaryItem}>
              <b>Уровень техники </b> {values.tier}
            </div>
            <div className={styles.summaryItem}>
              <b>Техника</b>
              <div className={styles.summaryTanks}>
                {tanks
                  .filter(({ id }) => values.tanks.includes(id))
                  .map(tank => (
                    <div className={styles.summaryTanksItem} key={tank.id}>
                      <span className={styles.flag} style={{ backgroundImage: `url(/img/flag-${tank.nation}.png)` }}></span>
                      {tank.short_name}
                    </div>
                  ))
                }
              </div>
            </div>
            <div className={styles.summaryItem}>
              <b>Режим боя </b> {BATTLE_TYPES[values.battleType]}
            </div>
            <div className={styles.summaryItem}>
              <b>Условие турнира </b> {values.conditions.map(cond => CONDITION_TYPES[cond]).join(', ')}
            </div>
            <div className={styles.summaryItem}>
              <b>Мин. кол-во боев </b> {values.minBattles}
            </div>
            <div className={styles.summaryItem}>
              <b>Кол-во обнулений </b> {values.resetLimit}
            </div>
            <div className={styles.summaryItem}>
              <b>Призовые места</b>
              <ol>
                {values.places.map((place, i) => (
                  <li key={i}>{place}</li>
                ))}
              </ol>
            </div>
            <div className={styles.summaryItem}>
              <Button type='button' onClick={handleCreateTournament}>Создать турнир</Button>
            </div>
          </div>
        }
      </Modal>
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
                  {Object.keys(TANKS_TYPES).map(type => (
                    <option key={type} value={type}>
                      {TANKS_TYPES[type]}
                    </option>
                  ))}
                </Select>
              </div>
              <div className={styles.tanksFilterItem}>
                <Range
                  label='Уровень техники'
                  name='tier'
                  min={6}
                  max={10}
                  value={values.tier}
                  onChange={handleChange}
                  width="320px"
                />
              </div>
            </div>
            {/* <div className={cn(styles.formBlock, styles.formBlock_bordered)}>
              <Select
                label='Режим боя'
                name='battleType'
                value={values.battleType}
                onChange={handleChange}
                width="320px"
              >
                {Object.keys(BATTLE_TYPES).map(type => (
                  <option key={type} value={type}>
                    {BATTLE_TYPES[type]}
                  </option>
                ))}
              </Select>
            </div> */}
            <div className={cn(styles.formBlock, styles.formBlock_bordered)}>
              <div>
                <label>Условия турнира</label>
                {Object.keys(CONDITION_TYPES)
                  // .filter(key => values.type === 'ATSPG' || key !== 'stun')
                  .map(type => (
                    <div key={type}>
                      <Checkbox
                        name='conditions'
                        value={type}
                        onChange={handleChange}
                        checked={values.conditions.includes(type)}
                      >
                        {CONDITION_TYPES[type]}
                      </Checkbox>
                    </div>
                ))}
              </div>
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
                    <Radio
                      key={tank.id}
                      name='tanks'
                      value={tank.id}
                      onChange={handleChange}
                      checked={values.tanks.includes(tank.id)}
                      className={styles.tanksItem}
                    >
                      <span className={styles.flag} style={{ backgroundImage: `url(/img/flag-${tank.nation}.png)` }}></span>
                      {tank.short_name}
                    </Radio>
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
              name='minBattles'
              min={5}
              max={100}
              value={values.minBattles}
              onChange={handleChange}
              width="450px"
            />
          </div>
          <div className={styles.formBlock}>
            <Range
              label='Количество обнулений данных'
              name='resetLimit'
              min={1}
              max={100}
              value={values.resetLimit}
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
              <div key={key} className={styles.errorMessage}>
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
    </div>
  )
}