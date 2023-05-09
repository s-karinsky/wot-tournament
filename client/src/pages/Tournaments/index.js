import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import TournamentForm from '../../components/TournamentForm'
import TournamentList from '../../components/TournamentList'
import { getTournaments, getList } from '../../redux/store/tournaments'
import styles from './styles.module.scss'

export default function Tournaments(props) {
  const { page } = useParams()
  const dispatch = useDispatch()
  const list = useSelector(state => getList(state, 'common'))
  useEffect(() => {
    dispatch(getTournaments('common'))
  }, [])

  return (
    <div className="container content-block">
      {!page && <TournamentList data={list} />}
      {page === 'create' && <TournamentForm />}
    </div>
  )
}