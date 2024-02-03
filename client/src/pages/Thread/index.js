import { useEffect, useState, useCallback, useMemo } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from '../../utils/axios'
import ForumForm from '../../components/ForumForm'
import Loader from '../../components/Loader'
import Reply from '../../components/Reply'
import Pagination from '../../components/Pagination'
import { selectUserRestrictions } from '../../redux/store/user/selectors'
import styles from './styles.module.scss'
import dayjs from 'dayjs'

const REPLIES_PER_PAGE = 20

export default function Thread() {
  const [ searchParams, setSearchParams ] = useSearchParams()
  const restrictions = useSelector(selectUserRestrictions)
  const { thread: threadId } = useParams()
  const [ totalReplies, setTotalReplies ] = useState(0)
  const [ replies, setReplies ] = useState([])
  const [ thread, setThread ] = useState()

  const loadThreads = useCallback(id => {
    axios.get('/api/forum/thread', { params: {
      id,
      skip: (searchParams.get('page') || 1) * REPLIES_PER_PAGE - REPLIES_PER_PAGE,
      limit: REPLIES_PER_PAGE
    } })
      .then(({ data }) => {
        setTotalReplies(data.totalReplies)
        setReplies(data.replies)
        setThread(data.thread)
      })
  }, [searchParams])

  useEffect(() => loadThreads(threadId), [loadThreads, threadId])
  const [ readRestrict, writeRestrict ] = useMemo(() => [
    restrictions.find(item => item.type === 'read'),
    restrictions.find(item => item.type === 'write')
  ], [restrictions])

  if (readRestrict) {
    return (
      <div className="container content-block">
        <div className={styles.restrictMessage}>
          Вы ограничены в правах и не можете просматривать форум {!!readRestrict.date && `до ${dayjs(readRestrict.date).format('DD.MM.YYYY')}`}
        </div>
      </div>
    )
  }

  if (!thread) return <Loader />

  const totalPages = Math.ceil(totalReplies / REPLIES_PER_PAGE)

  return (
    <div className="container content-block">
      <h1 className={styles.header}>
        {thread.title}
      </h1>
      <Pagination total={totalPages} current={searchParams.get('page')} />
      <div className={styles.replies}>
        {replies.map(reply => <Reply
          id={reply._id}
          {...reply}
        />)}
      </div>
      <Pagination total={totalPages} current={searchParams.get('page')} />
      {!writeRestrict && !thread.closed &&
        <div className={styles.answer}>
          Форма ответа
          <ForumForm
            onSubmit={
              (values, reset) =>
                axios.post('/api/forum/reply', { ...values, thread_id: threadId })
                  .then(() => {
                    reset()
                    loadThreads(threadId)
                  })
            }
            submitLabel='Ответить'
          />
        </div>
      }
      {writeRestrict && !thread.closed &&
        <div className={styles.restrictMessage}>
          Вы ограничены в правах и не можете отвечать на сообщения {!!writeRestrict.date && `до ${dayjs(writeRestrict.date).format('DD.MM.YYYY')}`}
        </div>
      }
    </div>
  )
}