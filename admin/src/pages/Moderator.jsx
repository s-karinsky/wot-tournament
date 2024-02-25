import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Form, List, Row, Col, message, Checkbox, Button } from 'antd'
import dayjs from 'dayjs'
import { MODERATOR_ACCESS } from '../consts'
import { useModerators } from '../utils/hooks'
import axios from '../utils/axios'

export default function Moderator() {
  const [ messageApi, contextHolder ] = message.useMessage()
  const [ moderatorAccess, setModeratorAccess ] = useState([])
  const { id } = useParams()
  const user = useModerators(id)

  const listData = useMemo(() => [
    {
      title: 'Ник',
      desc: user.data?.nickname
    },
    {
      title: 'Клан',
      desc: user.data?.name
    },
    {
      title: 'Роль',
      desc: user.data?.role
    }
  ].filter(item => Boolean(item.desc)), [user.data])

  useEffect(() => {
    if (user.isFetchedAfterMount) {
      setModeratorAccess(user.data?.moderatorAccess || [])
    }
  }, [user.isFetchedAfterMount, user.moderatorAccess])
  if (user.isLoading) return null

  if (Array.isArray(user) && !user.length) {
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
      {!user.isLoading && <Col span={6}>
        <Card title='Права модератора'>
          <Form
            onFinish={async () => {
              await axios.post('/api/admin/moderator/update', { id, access: moderatorAccess })
              messageApi.success('Модертор обновлен')
            }}
          >
            {Object.keys(MODERATOR_ACCESS).map(key => (
              <div style={{ marginBottom: 10 }}>
                <Checkbox
                  checked={moderatorAccess.includes(key)}
                  onChange={e => setModeratorAccess(
                    moderatorAccess.includes(key) ?
                      moderatorAccess.filter(item => item !== key) :
                      [ ...moderatorAccess, key ]
                  )}
                >
                  {MODERATOR_ACCESS[key]}
                </Checkbox>
              </div>
            ))}
            <Button type='primary' htmlType='submit' block>Сохранить</Button>
          </Form>
        </Card>
      </Col>}
      {contextHolder}
    </Row>
  )
}