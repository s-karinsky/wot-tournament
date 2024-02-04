import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Table, List, Row, Col, message, Typography } from 'antd'
import dayjs from 'dayjs'
import BanForm from '../components/BanForm'
import ForumRestrictions from '../components/ForumRestrictions'
import ForumViolations from '../components/ForumViolations'
import { useClans } from '../utils/hooks'
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

export default function Clan() {
  const [ messageApi, contextHolder ] = message.useMessage()
  const { id } = useParams()
  const clan = useClans(id)

  const listData = useMemo(() => [
    {
      title: 'Название',
      desc: clan.data?.clan?.name
    },
    {
      title: 'Лидер',
      desc: clan.data?.clan?.leaderName
    }
  ].filter(item => Boolean(item.desc)), [clan.data])

  const listUsers = useMemo(() => (clan.data?.users || []).map(item => ({
    id: item.accountId,
    desc: item.nickname
  })), [clan.data?.users])

  if (clan.isLoading) return null

  if (Array.isArray(clan.data) && !clan.data.length) {
    return (
      <div>
        Clan not found
      </div>
    )
  }

  return (
    <Row gutter={20}>
      <Col span={6}>
        <Card title='Данные клана'>
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
        <Card title='Игроки'>
          <List
            itemLayout='horizontal'
            dataSource={listUsers}
            renderItem={item => (
              <List.Item>
                <Link to={`/users/${item.id}`}>{item.desc}</Link>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card title='Бан'>
          <BanForm
            initialValues={clan.data?.ban}
            checkboxText='Забанить клан на сайте'
            onSubmit={async (values) => {
              let params = {}
              if (!values.banned && clan.data?.ban?.banned) {
                params.id = clan.data?.ban?._id
              } else {
                params = values
                params.clanId = clan.data?.clan?.clanId
              }
              try {
                await axios.post('/api/admin/clans/ban', params)
                messageApi.success('Успешно сохранено')
              } catch (e) {
                messageApi.error('Ошибка сохранения')
              }
            }}
          />
        </Card>
      </Col>
      {contextHolder}
    </Row>
  )
}