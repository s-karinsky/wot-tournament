import { useEffect, useState } from 'react'
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import cn from 'classnames'
import dayjs from 'dayjs'
import axios from '../../utils/axios'
import ForumForm from '../../components/ForumForm'
import { Button } from '../../components/Form'
import styles from './styles.module.scss'

export default function Forum() {
  const [ threads, setThreads ] = useState([])
  const { page = 1 } = useSearchParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const authorized = useSelector(state => state.user.authorized)

  useEffect(() => {
    axios.get(
      '/api/forum/thread',
      { params: { skip: (page - 1) * 20, limit: page * 20 } }
    ).then(res => {
      setThreads(res.data?.threads || [])
    })
  }, [page])

  if (pathname === '/forum/create') {
    return (
      <div className="container content-block">
        {authorized &&
          <ForumForm
            onSubmit={values =>
              axios.post('/api/forum/thread', values)
                .then(({ data }) => data?.thread?._id && navigate(`/forum/${data.thread._id}`))
            }
            inputLabel='Название темы'
            submitLabel='Создать тему'
            withTitle
          />
        }
      </div>
    )
  }
  
  return (
    <>
      <Helmet>
        <title>The tank brothers. Forum</title>
      </Helmet>
      <div className="container content-block">
        {authorized && <Button to='/forum/create'>Создать тему</Button>}
        <div className={styles.threads}>
          {threads.map(thread => (
            <div
              className={styles.thread}
              key={thread._id}
            >
              <div
                className={cn(styles.threadTitle, {
                  [styles.threadTitle_updated]: !thread.lastView || dayjs(thread.updatedAt).isAfter(dayjs(thread.lastView))
                })}
              >
                <Link to={`/forum/${thread._id}`} className={styles.threadLink}>{thread.title}</Link>
              </div>
              <div className={styles.threadDetails}>
                Тема создана {dayjs(thread.createdAt).format(' DD.MM.YYYY в HH:mm')}
                {!!thread.lastReply && <span className={styles.lastMessage}>
                  <Link to={`/forum/${thread._id}#${thread.lastReply._id}`}>последнее сообщение</Link> оставил&nbsp;
                  <b>{thread.lastReply.user?.nickname}</b> {dayjs(thread.lastReply.createdAt).format('DD.MM.YYYY в HH:mm')}
                </span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}