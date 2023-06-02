import { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import TournamentForm from '../../components/TournamentForm'
import TournamentList from '../../components/TournamentList'
import TournamentDetails from '../../components/TournamentDetails'
import { getTournaments, getList, getUsersByTournament } from '../../redux/store/tournaments'
import { getUserTournaments } from '../../redux/store/user'

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

  const joinTournament = useCallback(() => {
    axios.post('/api/tournament/join', { id: page }).then(() => {
      dispatch(getUserTournaments(page))
    })
  }, [])

  const resetStats = useCallback(() => {
    if (!window.confirm('Сбросить вашу статистику в турнире?')) return
    axios.post('/api/tournament/reset', { id: page }).then(() => {
      dispatch(getUserTournaments(page))
    })
  })

  return (
    <div className="container content-block">
      {!page && <TournamentList data={list} />}
      {page === 'create' && <TournamentForm />}
      {!!page && page !== 'create' &&
        <TournamentDetails
          id={page}
          onJoin={joinTournament}
          onReset={resetStats}
        />
      }
    </div>
  )
}