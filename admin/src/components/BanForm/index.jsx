import { Form, Checkbox, DatePicker, Input, Button } from 'antd'

export default function BanForm({ initialValues, onSubmit = () => {} }) {
  const [ form ] = Form.useForm()

  const banned = Form.useWatch('banned', form)

  return (
    <Form
      initialValues={initialValues}
      layout='vertical'
      form={form}
      onFinish={onSubmit}
    >
      <Form.Item
        name='banned'
        valuePropName='checked'
      >
        <Checkbox>
          Забанить пользователя на сайте
        </Checkbox>
      </Form.Item>
      {banned && <>
        <Form.Item
          name='endDate'
          label='Окончание бана'
          rules={[ { required: true }]}
        >
          <DatePicker format='DD.MM.YYYY' />
        </Form.Item>
        <Form.Item
          name='reason'
          label='Причина'
          rules={[ { required: true }]}
        >
          <Input.TextArea />
        </Form.Item>
      </>}
      <Button type='primary' htmlType='submit' block>
        Сохранить
      </Button>
    </Form>
  )
}