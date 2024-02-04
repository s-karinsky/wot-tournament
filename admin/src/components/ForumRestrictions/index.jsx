import { Button, Checkbox, Form, DatePicker, Divider } from 'antd'

export default function ForumRestrictions({ initialValues, onSubmit = () => {} }) {
  const [ form ] = Form.useForm()

  const isRead = Form.useWatch('read', form)
  const isWrite = Form.useWatch('write', form)

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
      layout='vertical'
    >
      <Form.Item
        name='read'
        valuePropName='checked'
      >
        <Checkbox>Ограничение на чтение</Checkbox>
      </Form.Item>
      {isRead && <>
        <Form.Item
          name='read_date'
          label='Дата окончания'
          rules={[ { required: true }]}
        >
          <DatePicker format='DD.MM.YYYY' />
        </Form.Item>
      </>}
      <Divider />
      <Form.Item
        name='write'
        valuePropName='checked'
      >
        <Checkbox>Ограничение на запись</Checkbox>
      </Form.Item>
      {isWrite && <>
        <Form.Item
          name='write_date'
          label='Дата окончания'
          rules={[ { required: true }]}
        >
          <DatePicker format='DD.MM.YYYY' />
        </Form.Item>
      </>}
      <Button htmlType='submit' type='primary' block>
        Сохранить
      </Button>
    </Form>
  )
}