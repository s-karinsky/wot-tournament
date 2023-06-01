import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { Button } from '../Form'
import Loader from '../Loader'
import TournamentUsers from '../TournamentUsers'
import { getTournament } from '../../redux/store/tournaments'
import { selectUserTournament } from '../../redux/store/user'
import { TANKS_TYPES, BATTLE_TYPES, CONDITION_TYPES } from '../../consts'
import styles from './styles.module.scss'

export default function TournamentDetails({ id, onJoin }) {
  const dispatch = useDispatch()
  const data = useSelector(state => state.tournaments.map[id])
  const users = useSelector(state => state.tournaments.mapUsersByTournament[id])
  const userTournament = useSelector(state => selectUserTournament(state, id))

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
          <span>Мин. кол-во боев</span> {data.minBattles}
        </li>
        <li>
          <span>Кол-во обнулений</span> {data.resetLimit}
        </li>
      </ul>

      {!userTournament && dayjs().isBefore(data.endDate) &&
        <Button
          onClick={onJoin}
        >
          Принять участие
        </Button>
      }

      <div className={styles.table}>
        <div className={styles.header}>
          Участники
        </div>
        <TournamentUsers users={users} />
      </div>
    </div>
}