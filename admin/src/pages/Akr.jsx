import { Fragment, useState } from 'react'
import { Typography, Input, Form, Select, Button, message } from 'antd'
import { useReserves } from '../utils/hooks'
import axios from '../utils/axios'

const WEEKDAYS = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье'
]

const LEVEL_OPTIONS = [
  {
    value: 'min',
    label: 'От мин. к макс.'
  },
  {
    value: 'max',
    label: 'От макс. к мин.'
  }
]

export default function Akr({ profile = {} }) {
  const [ messageApi, contextHolder ] = message.useMessage()
  const [ saving, setSaving ] = useState(false)
  const res = useReserves()
  
  if (res.isLoading) return null
  
  return (
    <Form
      initialValues={res.data.initialValues}
      onFinish={async (values) => {
        setSaving(true)
        const data = Object.keys(values).reduce((acc, key) => {
          const [ weekday, type ] = key.split('-')
          const value = values[key]
          value.weekday = weekday
          value.type = type
          return [...acc, value]
        }, []).filter(item => !!item.time && !!item.startFrom)
        await axios.post('/api/admin/reserves', { data, clan: profile.clan_id })
        setSaving(false)
        messageApi.success('Данные сохранены')
      }}
    >
      <Button size='large' type='primary' htmlType='submit' loading={saving}>Сохранить</Button>
      {WEEKDAYS.map((day, num) => (
        <Fragment key={day}>
          <Typography.Title>
            {day}
          </Typography.Title>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px' }}>
            {res.data.list.map(item => (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: '1 1 0' }}>
                <div>
                  <b>{item.name}</b><br /><i>{item.bonus_type}</i>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Form.Item name={[`${num + 1}-${item.type}`, 'time']} style={{ margin: 0 }}>
                    <Input placeholder='Время активации (Мск)' style={{ display: 'block' }} />
                  </Form.Item>
                  <Form.Item name={[`${num + 1}-${item.type}`, 'startFrom']}>
                    <Select
                      disabled={!item.in_stock || !item.in_stock.length}
                      options={LEVEL_OPTIONS}
                      style={{ marginTop: 10, display: 'block' }}
                      placeholder='Уровень'
                    />
                  </Form.Item>
                </div>
              </div>
            ))}
          </div>
          {contextHolder}
        </Fragment>
      ))}
    </Form>
  )
}