import { useMemo } from 'react'
import { Table } from 'antd'
import dayjs from 'dayjs'
import { useClans, useUsers } from '../utils/hooks'
import { localeCompare, getColumnSearch } from '../utils/utils'

export default function Home() {
  const clans = useClans()
  const users = useUsers()

  const clanById = useMemo(() => {
    if (!clans.data || !clans.data.length) return {}
    return clans.data.reduce((acc, clan) => ({
      ...acc,
      [clan.clanId]: clan
    }), {})
  }, [clans.data])

  const clanOptions = useMemo(() => clans.data?.map(clan => ({ value: clan.clanId, label: clan.name })), [clans.data])

  const columns = useMemo(() => [
    {
      title: 'Ник',
      dataIndex: ['user', 'nickname'],
      sorter: (a, b) => localeCompare(a.user?.nickname, b.user?.nickname),
      ...getColumnSearch('nickname', { getData: item => item.user?.nickname })
    },
    {
      title: 'Клан',
      dataIndex: ['user', 'clanId'],
      render: clan => clanById[clan]?.name,
      sorter: (a, b) => localeCompare(clanById[a.user?.clanId]?.name, clanById[b.user?.clanId]?.name),
      ...getColumnSearch('clan', { getData: item => item.user?.clanId, options: clanOptions })
    },
    {
      title: 'Роль',
      dataIndex: ['user', 'role'],
      sorter: (a, b) => localeCompare(a.user?.role, b.user?.role),
      ...getColumnSearch('role', { getData: item => item.user?.role, options: [ { value: 'admin' }, { value: 'moderator' }, { value: 'user' } ] })
    },
    {
      title: 'Последнее посещение',
      dataIndex: 'date',
      render: date => dayjs(date).format('DD.MM.YYYY'),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: 'descend',
      ...getColumnSearch('date', { type: 'date' })
    }
  ], [clanById, clanOptions])

  return (
    <div>
      <Table
        columns={columns}
        dataSource={users.data}
        loading={users.isLoading}
        
        pagination={{
          pageSize: 20
        }}
      />
    </div>
  )
}