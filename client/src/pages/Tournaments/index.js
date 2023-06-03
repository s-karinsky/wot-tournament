import { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import TournamentForm from '../../components/TournamentForm'
import TournamentList from '../../components/TournamentList'
import TournamentDetails from '../../components/TournamentDetails'
import { getUserTournaments } from '../../redux/store/user'
import {
  getTournaments,
  getList,
  getUsersByTournament,
  joinTournament,
  resetTournament
} from '../../redux/store/tournaments'

export default function Tournaments() {
  const { page } = useParams()
  const dispatch = useDispatch()
  const list = useSelector(state => getList(state, 'common'))

  useEffect(() => {
    if (!page) {
      dispatch(getTournaments('common'))
      dispatch(getUserTournaments())
    }
    if (page && page !== 'create') {
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
    <div className="container content-block">
      {!page && <TournamentList data={list} />}
      {page === 'create' && <TournamentForm />}
      {!!page && page !== 'create' &&
        <TournamentDetails
          id={page}
          onJoin={join}
          onReset={resetStats}
        />
      }
    </div>
  )
}