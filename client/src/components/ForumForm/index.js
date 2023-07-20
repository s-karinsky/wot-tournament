import { useState } from 'react'
import ReactQuill from 'react-quill'
import { Button, Input } from '../Form'
import styles from './styles.module.scss'
import 'react-quill/dist/quill.snow.css'

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

export default function ForumForm({
  onSubmit = () => {},
  withTitle = false,
  inputLabel = '',
  submitLabel = ''
}) {
  const [ title, setTitle ] = useState('')
  const [ value, setValue ] = useState('')
  return (
    <form
      className={styles.form}
      onSubmit={e => {
        e.preventDefault()
        onSubmit({ title, text: value })
      }}
    >
      {withTitle && <div className={styles.title}>
        <Input
          label={inputLabel}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>}
      <div className={styles.text}>
        <ReactQuill
          theme='snow'
          modules={modules}
          formats={formats}
          value={value}
          onChange={setValue}
        />
      </div>
      <div className={styles.submit}>
        <Button type='submit'>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}