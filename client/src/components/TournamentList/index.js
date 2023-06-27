import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { Button } from '../Form'
import Table from '../Table'
import { getClanRole } from '../../redux/store/data'
import { TANKS_TYPES, CONDITION_TYPES } from '../../consts'
import styles from './styles.module.scss'

export default function TournamentList({ data }) {
  const userId = useSelector(state => state.user.profile?.account_id)
  const clanRole = useSelector(state => getClanRole(state, userId))
  const isAdmin = ['commander', 'executive_officer'].includes(clanRole)
  const columns = useMemo(
    () => [
      {
        Header: 'Название',
        accessor: 'name',
        width: '40%',
        className: styles.cell__name,
        Cell: ({ value, row }) => (<Link to={`/tournaments/${row.original._id}`}>{value}</Link>)
      },
      {
        Header: 'Клан',
        accessor: 'clanName'
      },
      {
        Header: 'Дата начала',
        accessor: 'startDate',
        Cell: ({ value }) => dayjs(value).format('DD.MM.YYYY')
      },
      {
        Header: 'Дата окончания',
        accessor: 'endDate',
        Cell: ({ value }) => dayjs(value).format('DD.MM.YYYY')
      },
      {
        Header: 'Условие',
        accessor: 'conditions',
        Cell: ({ value }) => value.map(cond => CONDITION_TYPES[cond]).join(', ')
      },
      {
        Header: 'Тип танка',
        accessor: 'type',
        Cell: ({ value }) => TANKS_TYPES[value]
      },
      {
        Header: 'Уровень техники',
        accessor: 'tier'
      }
    ],
    []
  )

  const active = data.filter(item => Date.now() <= new Date(item.endDate).getTime())
  const ended = data.filter(item => Date.now() > new Date(item.endDate).getTime())

  return (
    <div className={styles.tournamentList}>
      {isAdmin && <Button to='/tournaments/create'>Создать турнир</Button>}

      <h1 className={styles.header}>Активные турниры</h1>
      <Table columns={columns} data={active} />

      <h1 className={styles.header}>История турниров</h1>
      <Table columns={columns} data={ended} />
    </div>
  )
}