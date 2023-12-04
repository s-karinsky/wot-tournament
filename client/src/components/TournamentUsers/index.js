import { useMemo } from 'react'
import Table from '../Table'
import styles from './styles.module.scss'

export default function TournamentUsers({
  users = []
}) {
  const columns = useMemo(
    () => [
      {
        Header: '№',
        className: styles.cell__name,
        Cell: ({ value, row }) => row.index + 1
      },
      {
        Header: 'Место',
        accessor: 'pos'
      },
      {
        Header: 'Пользователь',
        accessor: 'nickname',
        width: '40%',
        className: styles.nickname
      },
      {
        Header: 'Кол-во боев',
        accessor: 'battles'
      },
      {
        Header: 'Набранные очки',
        accessor: 'value'
      }
    ],
    []
  )

  return (
    <Table columns={columns} data={users} />
  )
}