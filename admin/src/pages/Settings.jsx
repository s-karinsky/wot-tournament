import { Card, Row, Col, message } from 'antd'
import Censor from '../components/Settings/Censor'
import Rank from '../components/Settings/Rank'
import ThreadAge from '../components/Settings/ThreadAge'
import axios from '../utils/axios'
import { useSettings } from '../utils/hooks'

export default function Settings() {
  const [ messageApi, contextHolder ] = message.useMessage()
  const { data = {}, isLoading } = useSettings()

  if (isLoading) return null

  return (
    <Row gutter={20}>
      <Col span={6}>
        <Card title='Цензура на форуме'>
          <Censor
            initialValues={data.forumCensor}
            onSubmit={async (values) => {
              const { forumCensor } = values
              if (typeof forumCensor.findWords === 'string') {
                forumCensor.findWords = forumCensor.findWords.split(',').map(item => item.trim())
              }
              try {
                await axios.post('/api/admin/settings', { forumCensor })
                messageApi.success('Успешно сохранено')
              } catch (e) {
                messageApi.error('Ошибка сохранения')
              }
            }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card title='Ранг на форуме по сообщениям'>
          <Rank
            initialValues={data.forumRepliesRank}
            onSubmit={async (values) => {
              try {
                await axios.post('/api/admin/settings', values)
                messageApi.success('Успешно сохранено')
              } catch (e) {
                messageApi.error('Ошибка сохранения')
              }
            }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card title='Время активности форума'>
          <ThreadAge
            initialValues={data.forumActiveThreadAge}
            onSubmit={async (values) => {
              values.forumActiveThreadAge = values.forumActiveThreadAge * 60 * 60 * 1000
              try {
                await axios.post('/api/admin/settings', values)
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