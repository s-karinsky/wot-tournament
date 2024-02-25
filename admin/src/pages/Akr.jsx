import { Fragment } from 'react'
import { Col, Row, Typography, Input, Select } from 'antd'

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

export default function Akr() {
  return (
    <>
      {WEEKDAYS.map((day, num) => (
        <Fragment key={day}>
          <Typography.Title>
            {day}
          </Typography.Title>
          <div style={{ display: 'flex' }}>
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
                  <Select options={[ { value: 'Сначала мин.' }, { value: 'Снаала макс.' } ]} style={{ display: 'block', marginTop: 5 }} />
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
                  <Select options={[ { value: 'Сначала мин.' }, { value: 'Снаала макс.' } ]} style={{ display: 'block', marginTop: 5 }} />
                </Col>
              ))}
            </Row>
          </div>
        </Fragment>
      ))}
    </>
  )
}