import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import Table from '../Table'
import { TANKS_TYPES, CONDITION_TYPES } from '../../consts'
import styles from './styles.module.scss'

export default function TournamentList({ data }) {
  const columns = useMemo(
    () => [
      {
        Header: '№',
        className: styles.cell__name,
        Cell: ({ value, row }) => row.index + 1
      },
      {
        Header: 'Название',
        accessor: 'name',
        width: '40%',
        className: styles.cell__name,
        Cell: ({ value, row }) => (<Link to={`/tournaments/${row.original._id}`}>{value}</Link>)
      },
      {
        Header: 'Организатор турнира',
        accessor: 'creator',
        className: styles.cell__name,
        Cell: ({ value }) => value?.nickname
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

  return (
    <div className={styles.tournamentList}>
      <Table columns={columns} data={data} />
    </div>
  )
}