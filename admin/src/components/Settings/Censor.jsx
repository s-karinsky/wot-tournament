import { Button, Form, Input } from 'antd'

export default function Censor({
  initialValues,
  onSubmit = () => {}
}) {
  const [ form ] = Form.useForm()

  return (
    <Form
      form={form}
      initialValues={initialValues}
      layout='vertical'
      onFinish={onSubmit}
    >
      <Form.Item name={['forumCensor', 'findWords']} label='Список слов через запятую'>
        <Input.TextArea />
      </Form.Item>

      <Form.Item name={['forumCensor', 'replaceWith']} label='Заменить на'>
        <Input />
      </Form.Item>
      <Button htmlType='submit' type='primary' block>
        Сохранить
      </Button>
    </Form>
  )
}