import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ForumForm from '../../components/ForumForm'
import Loader from '../../components/Loader'
import Reply from '../../components/Reply'
import styles from './styles.module.scss'

export default function Thread() {
  const { thread: threadId } = useParams()
  const [ replies, setReplies ] = useState([])
  const [ thread, setThread ] = useState()

  const loadThreads = useCallback(id => {
    axios.get('/api/forum/thread', { params: { id } })
      .then(({ data }) => {
        setReplies(data.replies)
        setThread(data.thread)
      })
  }, [])

  useEffect(() => loadThreads(threadId), [loadThreads, threadId])

  if (!thread) return <Loader />

  return (
    <div className="container content-block">
      <h1 className={styles.header}>
        {thread.title}
      </h1>
      <div className={styles.replies}>
        {replies.map(reply => <Reply
          id={reply._id}
          {...reply}
        />)}
      </div>
      <div className={styles.answer}>
        Форма ответа
        <ForumForm
          onSubmit={
            values =>
              axios.post('/api/forum/reply', { ...values, thread_id: threadId })
                .then(() => loadThreads(threadId))
          }
          submitLabel='Ответить'
        />
      </div>
    </div>
  )
}