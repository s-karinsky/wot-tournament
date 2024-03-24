import { Form, Button, InputNumber } from 'antd'

export default function ThreadAge({
  initialValues,
  onSubmit = () => {}
}) {
  return (
    <Form
      layout='vertical'
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item name='forumActiveThreadAge' label='Время до перемещения форума в архив (в часах)'>
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Button type='primary' htmlType='submit' block>
        Сохранить
      </Button>
    </Form>
  )
}