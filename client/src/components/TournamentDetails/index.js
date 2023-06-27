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

export default function TournamentDetails({ id, onJoin, onReset }) {
  const dispatch = useDispatch()
  const data = useSelector(state => state.tournaments.map[id])
  const users = useSelector(state => state.tournaments.mapUsersByTournament[id])
  const isJoining = useSelector(state => state.tournaments.pendingJoin[id])
  const isReseting = useSelector(state => state.tournaments.pendingReset[id])
  const userTournament = useSelector(state => selectUserTournament(state, id))
  const { currentStats, initialStats } = userTournament || {}

  useEffect(() => {
    if (data) return
    dispatch(getTournament(id))
  }, [data])

  return !data ?
    <Loader /> :
    <div>
      <div className={styles.columns}>
        <div className={styles.about}>
          <div className={styles.header}>
            {data.name}
          </div>
          <div className={styles.dates}>
            Проводится с 12:00:00 {dayjs(data.startDate).format('DD.MM.YYYY')}<br />
            по 23:59:59 {dayjs(data.endDate).format('DD.MM.YYYY')} (время Мск)
          </div>
          <div className={styles.header}>
            Правила турнира
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
              <span>Условия турнира</span> {data.conditions.map(cond => CONDITION_TYPES[cond]).join(', ')}
            </li>
            <li>
              <span>Мин. кол-во боев</span> {data.minBattles}
            </li>
            <li>
              <span>Кол-во обнулений</span> {data.resetLimit}
            </li>
            <li>
              <span>Призовые места</span> 
              <ol className={styles.places}>
                {(data.places || []).map(place => (
                  <li key={place}>{place}</li>
                ))}
              </ol>
            </li>
          </ul>
        </div>
        {!!userTournament &&
          <div className={styles.stats}>
            <div className={styles.header}>
              Ваша статистика
            </div>
            <div className={styles.dates}>
              В турнире с {dayjs(userTournament.date).format('DD.MM.YYYY')}
            </div>
            <ul className={styles.list}>
              <li>
                <span>Кол-во боев</span> {currentStats?.battles - initialStats?.battles}
              </li>
              <li>
                <span>Нанесено урона</span> {currentStats?.damage - initialStats?.damage}
              </li>
              <li>
                <span>Обнаружено противников</span> {currentStats?.spotted - initialStats?.spotted}
              </li>
              <li>
                <span>Заблокировано урона</span> {Math.max(0, Math.floor(currentStats?.blocked - initialStats?.blocked))}
              </li>
              <li>
                <span>Оглушения</span> {currentStats?.stun - initialStats?.stun}
              </li>
              <li>
                <span>Доступные обнуления</span> {data.resetLimit - userTournament.resetCount}
              </li>
            </ul>
            {data.resetLimit - userTournament.resetCount > 0 && <div>
              <Button
                onClick={onReset}
                disabled={isReseting}
              >
                {isReseting ?
                  <Loader
                    margin='0 auto'
                    color='white'
                    isStatic
                  /> :
                  'Сбросить статистику'
                }
              </Button>
            </div>}
          </div>
        }
      </div>

      {!userTournament && dayjs().isBefore(data.endDate) &&
        <Button
          onClick={onJoin}
          disabled={isJoining}
        >
          {isJoining ?
            <Loader
              margin='0 auto'
              color='white'
              isStatic
            /> :
            'Принять участие'
          }
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