import { Input, InputNumber, Form, Button } from 'antd'

export default function Rank({
  initialValues,
  onSubmit = () => {}
}) {
  return (
    <Form
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.List name='forumRepliesRank'>
        {(fields, { add, remove }) => (
          <>
            {fields.map(field => (
              <div key={field.name} style={{ borderBottom: '1px solid #ccc', marginBottom: 20 }}>
                <Form.Item name={[field.name, 'repliesCount']} label='Количество постов'>
                  <InputNumber />
                </Form.Item>
                <Form.Item name={[field.name, 'rank']} label='Название ранга'>
                  <Input />
                </Form.Item>
              </div>
            ))}
            <Button onClick={() => add()} style={{ marginBottom: 20 }} block>
              + Добавить пункт
            </Button>
          </>
        )}
      </Form.List>
      <Button type='primary' htmlType='submit' block>
        Сохранить
      </Button>
    </Form>
  )
}