import { Button, Input, Form, DatePicker } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Fragment } from 'react';

export default function ForumViolations({ initialValues, onSubmit = () => {} }) {
  const [ form ] = Form.useForm()

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
      layout='vertical'
    >
      <Form.List
        name='violations'
      >
         {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Fragment key={field.key}>
                <Form.Item
                  label='Дата'
                  name={[field.name, 'date']}
                  required
                >
                  <DatePicker format='DD.MM.YYYY' />
                </Form.Item>
                <Form.Item
                  label='Причина'
                  name={[field.name, 'reason']}
                >
                  <Input />
                </Form.Item>
                <Button
                  type='dashed'
                  onClick={() => remove(field.name)}
                  icon={<MinusCircleOutlined />}
                  style={{ marginBottom: 20 }}
                  danger
                  block
                >
                  Убрать предупреждение
                </Button>
              </Fragment>
            ))}
            <Form.Item>
              <Button
                type='dashed'
                onClick={() => add()}
                icon={<PlusOutlined />}
                style={{ marginTop: 20 }}
                block
              >
                Добавить предупреждение
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Button htmlType='submit' type='primary' block>
        Сохранить
      </Button>
    </Form>
  )
}