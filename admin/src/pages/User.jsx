import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Table, List, Row, Col, message, Typography } from 'antd'
import dayjs from 'dayjs'
import BanForm from '../components/BanForm'
import ForumRestrictions from '../components/ForumRestrictions'
import ForumViolations from '../components/ForumViolations'
import { useUsers } from '../utils/hooks'
import axios from '../utils/axios'

const visitColumns = [
  {
    title: 'Дата и время',
    dataIndex: 'date',
    render: date => dayjs(date).format('DD.MM.YYYY hh:mm:ss')
  },
  {
    title: 'IP-адрес',
    dataIndex: 'ip'
  }
]

export default function User() {
  const [ messageApi, contextHolder ] = message.useMessage()
  const { id } = useParams()
  const user = useUsers(id)

  const listData = useMemo(() => [
    {
      title: 'Ник',
      desc: user.data?.user?.nickname
    },
    {
      title: 'Клан',
      desc: user.data?.clan?.name
    },
    {
      title: 'Роль',
      desc: user.data?.user?.role
    },
    {
      title: 'Сообщений на форуме',
      desc: user.data?.user?.repliesCount || 0
    }
  ].filter(item => Boolean(item.desc)), [user.data])

  if (user.isLoading) return null

  if (Array.isArray(user.data) && !user.data.length) {
    return (
      <div>
        User not found
      </div>
    )
  }

  return (
    <Row gutter={20}>
      <Col span={6}>
        <Card title='Данные пользователя'>
          <List
            itemLayout='horizontal'
            dataSource={listData}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={item.desc}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card title='Бан'>
          <BanForm
            initialValues={user.data?.ban}
            onSubmit={async (values) => {
              let params = {}
              if (!values.banned && user.data?.ban?.banned) {
                params.id = user.data?.ban?._id
              } else {
                params = values
                params.userId = user.data?.user?.accountId
              }
              try {
                await axios.post('/api/admin/users/ban', params)
                messageApi.success('Успешно сохранено')
              } catch (e) {
                messageApi.error('Ошибка сохранения')
              }
            }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card title='Ограничения на форуме'>
          <ForumRestrictions
            initialValues={user.data?.restrictions}
            onSubmit={async (values) => {
              values.userId = user.data?.user?.accountId
              try {
                await axios.post('/api/admin/users/restrictions', values)
                messageApi.success('Успешно сохранено')
              } catch (e) {
                messageApi.error('Ошибка сохранения')
              }
            }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card title='Предупреждения на форуме'>
          <ForumViolations
            initialValues={user.data?.user}
            onSubmit={async (values) => {
              values.userId = user.data?.user?.accountId
              try {
                await axios.post('/api/admin/users/violations', values)
                messageApi.success('Успешно сохранено')
              } catch (e) {
                messageApi.error('Ошибка сохранения')
              }
            }}
          />
        </Card>
      </Col>
      <Col span={24}>
        <Typography.Title level={3}>Посещения</Typography.Title>
        <Table
          columns={visitColumns}
          dataSource={user.data?.visits || []}
          pagination={{
            pageSize: 20
          }}
        />
      </Col>
      {contextHolder}
    </Row>
  )
}