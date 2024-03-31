import { Fragment, useMemo } from 'react'
import { Col, Row, Typography, TimePicker, Input, Select } from 'antd'
import { useReserves } from '../utils/hooks'

const WEEKDAYS = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье'
]

const VARIANTS = Array.from({ length: 6 }, (v, i) => i + 1)

// ADDITIONAL_BRIEFING
// BATTLE_PAYMENTS
// MILITARY_MANEUVERS
// TACTICAL_TRAINING

export default function Akr() {
  const res = useReserves()
  
  if (res.isLoading) return null
  
  return (
    <>
      {WEEKDAYS.map((day, num) => (
        <Fragment key={day}>
          <Typography.Title>
            {day}
          </Typography.Title>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px' }}>
            {res.data.map(item => (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: '1 1 0' }}>
                <div>
                  <b>{item.name}</b><br /><i>{item.bonus_type}</i>
                </div>
                <div style={{ marginTop: 10 }}>
                  <TimePicker placeholder='Время активации' style={{ display: 'block' }} />
                  <Select
                    disabled={!item.in_stock || !item.in_stock.length}
                    options={(item.in_stock || []).map(item => ({ value: item.level, label: `Уровень ${item.level}` }))}
                    style={{ marginTop: 10, display: 'block' }}
                    placeholder='Уровень'
                  />
                </div>
              </div>
            ))}
          </div>
          {/* <div style={{ display: 'flex' }}>
            <div>
              <label className='akr_label'>
                <input type='radio' name={`day_${num}_type_1`} />
                <img alt='preview' width={55} src={`${process.env.PUBLIC_URL}/battle_payments.png`} />
              </label>
              <label className='akr_label'>
                <input type='radio' name={`day_${num}_type_1`} />
                <img alt='preview' width={55} src={`${process.env.PUBLIC_URL}/tactical_training.png`} />
              </label>
            </div>
            <Row style={{ flex: '1 0 auto' }} gutter={10}>
              {VARIANTS.map(i => (
                <Col span={4} key={i}>
                  <Input defaultValue='--:--' />
                  <Select options={[ { value: 'Опыт на танк' }, { value: 'На серебро' } ]} style={{ display: 'block', marginTop: 5 }} />
                  <Select options={[ { value: 'Сначала мин.' }, { value: 'Сначала макс.' } ]} style={{ display: 'block', marginTop: 5 }} />
                </Col>
              ))}
            </Row>
          </div>
          <div style={{ display: 'flex', marginTop: 40 }}>
            <div>
              <label className='akr_label'>
                <input type='radio' name={`day_${num}_type_1`} />
                <img alt='preview' width={55} src={`${process.env.PUBLIC_URL}/military_maneuvers.png`} />
              </label>
              <label className='akr_label'>
                <input type='radio' name={`day_${num}_type_1`} />
                <img alt='preview' width={55} src={`${process.env.PUBLIC_URL}/additional_briefing.png`} />
              </label>
            </div>
            <Row style={{ flex: '1 0 auto' }} gutter={10}>
              {VARIANTS.map(i => (
                <Col span={4} key={i}>
                  <Input defaultValue='--:--' />
                  <Select options={[ { value: 'Опыт на танк' }, { value: 'На серебро' } ]} style={{ display: 'block', marginTop: 5 }} />
                  <Select options={[ { value: 'Сначала мин.' }, { value: 'Сначала макс.' } ]} style={{ display: 'block', marginTop: 5 }} />
                </Col>
              ))}
            </Row>
          </div> */}
        </Fragment>
      ))}
    </>
  )
}