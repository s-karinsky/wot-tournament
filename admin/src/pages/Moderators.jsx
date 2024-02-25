import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, List, Row, Col, Title, Table, message } from 'antd'
import BanForm from '../components/BanForm'
import { localeCompare, getColumnSearch } from '../utils/utils'
import { useModerators } from '../utils/hooks'
import axios from '../utils/axios'
import { MODERATOR_ACCESS } from '../consts'

export default function Moderators() {
  const [ messageApi, contextHolder ] = message.useMessage()
  const { id } = useParams()
  const moderator = useModerators(id)

  const columns = useMemo(() => [
    {
      title: 'Пользователь',
      dataIndex: 'nickname',
      render: (name, user) => (<Link to={`/moderators/${user._id}`}>{name}</Link>),
      sorter: (a, b) => localeCompare(a.nickname, b.nickname),
      ...getColumnSearch('nickname')
    },
    {
      title: 'Права',
      dataIndex: 'moderatorAccess',
      render: access => (access || []).map(key => MODERATOR_ACCESS[key] || '').filter(Boolean).join(', ')
    }
  ], [])
  
  return (
    <div>
      <Table
        columns={columns}
        dataSource={moderator.data}
        loading={moderator.isLoading}
        pagination={{
          pageSize: 20
        }}
      />
    </div>
  )
}