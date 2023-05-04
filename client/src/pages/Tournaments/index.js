import { useParams } from 'react-router-dom'
import TournamentForm from '../../components/TournamentForm'
import styles from './styles.module.scss'

export default function Tournaments(props) {
  const { page } = useParams()
  return (
    <div className="container content-block">
      {page === 'create' && <TournamentForm />}
    </div>
  )
}