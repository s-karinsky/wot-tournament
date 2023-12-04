import { useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import cn from 'classnames'
import TournamentForm from '../../components/TournamentForm'
import TournamentList from '../../components/TournamentList'
import TournamentDetails from '../../components/TournamentDetails'
import { Button } from '../../components/Form'
import { getUserTournaments } from '../../redux/store/user'
import { getClanRole } from '../../redux/store/data'
import {
  getTournaments,
  getList,
  getUsersByTournament,
  joinTournament,
  resetTournament
} from '../../redux/store/tournaments'
import styles from './styles.module.scss'

export default function Tournaments() {
  const { page } = useParams()
  const dispatch = useDispatch()
  const list = useSelector(state => getList(state, 'common'))
  const userId = useSelector(state => state.user.profile?.account_id)
  const clanRole = useSelector(state => getClanRole(state, userId))
  const isAdmin = ['commander', 'executive_officer'].includes(clanRole)

  const active = list.filter(item => Date.now() <= new Date(item.endDate).getTime())
  const ended = list.filter(item => Date.now() > new Date(item.endDate).getTime())

  useEffect(() => {
    if (!page || page === 'archive') {
      dispatch(getTournaments('common'))
      dispatch(getUserTournaments())
    }
    if (page && page !== 'create' && page !== 'archive') {
      dispatch(getUsersByTournament(page))
      dispatch(getUserTournaments(page))
    }
  }, [page])

  const join = useCallback(() => {
    dispatch(joinTournament(page))
  }, [page])

  const resetStats = useCallback(() => {
    if (!window.confirm('Сбросить вашу статистику в турнире?')) return
    dispatch(resetTournament(page))
  }, [page])

  return (
    <>
      <Helmet>
        <title>The tank brothers. Tournaments</title>
      </Helmet>
      {isAdmin && (!page || page === 'archive') &&
        <div
          className="container"
          style={{ marginBottom: 20 }}
        >
          <Button to='/tournaments/create'>Создать турнир</Button>
        </div>
      }
      {(!page || page === 'archive') && 
        <div className="container">
          <ul className={styles.tabs}>
            <li className={cn(styles.tab, { [styles.active]: !page })}>
              <Link to='/tournaments'>Активные турниры</Link>
            </li>
            <li className={cn(styles.tab, { [styles.active]: page === 'archive' })}>
              <Link to='/tournaments/archive'>История турниров</Link>
            </li>
          </ul>
        </div>
      }
      <div className="container content-block">
        {(!page || page === 'archive') && <TournamentList
          data={!page ? active : ended}
          isArchive={page === 'archive'}
        />}
        {page === 'create' && <TournamentForm />}
        {!!page && page !== 'create' && page !== 'archive' &&
          <TournamentDetails
            id={page}
            onJoin={join}
            onReset={resetStats}
          />
        }
      </div>
    </>
  )
}