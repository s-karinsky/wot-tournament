import { useMemo } from 'react'
import Table from '../Table'
import styles from './styles.module.scss'

export default function TournamentUsers({
  isFinished,
  users = []
}) {
  let columns = isFinished ? [] : [{
    Header: '№',
    className: styles.cell__name,
    width: 70,
    Cell: ({ value, row }) => row.index + 1
  }]

  columns = columns.concat([
    {
      Header: 'Место',
      accessor: 'pos',
      width: 150
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
  ])

  if (isFinished) columns = columns.concat([
    {
      Header: 'Приз',
      accessor: 'prize'
    }
  ])

  return (
    <Table columns={columns} data={users} />
  )
}