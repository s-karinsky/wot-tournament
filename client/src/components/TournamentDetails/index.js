import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import dayjs from 'dayjs'
import { Button } from '../Form'
import { getTournament } from '../../redux/store/tournaments'
import styles from './styles.module.scss'
import { TANKS_TYPES, BATTLE_TYPES, CONDITION_TYPES } from '../../consts'
import Loader from '../Loader'

export default function TournamentDetails({ id }) {
  const dispatch = useDispatch()
  const data = useSelector(state => state.tournaments.map[id])

  useEffect(() => {
    if (data) return
    dispatch(getTournament(id))
  }, [data])

  return !data ?
    <Loader /> :
    <div>
      <div className={styles.header}>
        {data.name}
      </div>
      <div className={styles.dates}>
        Проводится с {dayjs(data.startDate).format('DD.MM.YYYY')} по {dayjs(data.endDate).format('DD.MM.YYYY')}
      </div>
      <ul className={styles.list}>
        {!!data.clan && <li>
          <span>Клан</span> {data.clan}
        </li>}
        <li>
          <span>Режим боя</span> {BATTLE_TYPES[data.battleType]}
        </li>
        <li>
          <span>Тип танка</span> {TANKS_TYPES[data.type]}
        </li>
        <li>
          <span>Уровень техники</span> {data.tier}
        </li>
        <li>
          <span>Условия турнира</span> {CONDITION_TYPES[data.condition]}
        </li>
        <li>
          <span>Мин. кол-во боев</span> {data.minFights}
        </li>
        <li>
          <span>Кол-во обнулений</span> {data.resetLimit}
        </li>
      </ul>

      {dayjs().isBefore(data.endDate) &&
        <Button
          onClick={() => {
            axios.post('/api/tournament/join', { id })
          }}
        >
          Принять участие
        </Button>
      }
    </div>
}