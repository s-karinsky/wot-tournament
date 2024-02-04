import { useMemo } from 'react'
import { Table } from 'antd'
import { Link } from 'react-router-dom'
import { useClans } from '../utils/hooks'
import { localeCompare, getColumnSearch } from '../utils/utils'

export default function Clans() {
  const clans = useClans()

  const columns = useMemo(() => [
    {
      title: 'Название',
      dataIndex: 'name',
      render: (name, clan) => (<Link to={`/clans/${clan.clanId}`}>{name}</Link>),
      sorter: (a, b) => localeCompare(a.name, b.name),
      ...getColumnSearch('name')
    },
    {
      title: 'Лидер',
      dataIndex: 'leaderName',
      render: (name, clan) => (<Link to={`/users/${clan.leaderId}`}>{name}</Link>),
      sorter: (a, b) => localeCompare(a.leaderName, b.leaderName),
      ...getColumnSearch('leaderName')
    }
  ], [])

  return (
    <div>
      <Table
        columns={columns}
        dataSource={clans.data}
        loading={clans.isLoading}
        pagination={{
          pageSize: 20
        }}
      />
    </div>
  )
}