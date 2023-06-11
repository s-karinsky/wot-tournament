import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import dayjs from 'dayjs'
import News from '../../components/News'
import { getTournaments, getList } from '../../redux/store/tournaments'
import styles from './styles.module.scss'

export default function Home() {
  const dispatch = useDispatch()
  const list = useSelector(state => getList(state, 'active'))
  const news = useSelector(state => state.data.news)
  const clan = useSelector(state => state.data.clan)
  const isAuthorized = useSelector(state => state.user.authorized)
  useEffect(() => {
    const startDate = dayjs()
    const endDate = dayjs().add(5, 'day')
    dispatch(
      getTournaments('active', {
        dateRange: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')].join(';')
      })
    )
  }, [])

  return (
    <div className={cn('container', styles.home)}>
      <div className={styles.news}>
        <News list={news} />
      </div>
      <div className={styles.info}>
        {isAuthorized && !!clan.description_html && <div className='content-block'>
          <div className='header'>Правила клана</div>
          <span dangerouslySetInnerHTML={{ __html: clan.description_html }}></span>
        </div>}
        <div className='content-block'>
          <div className='header'>Активные турниры</div>
          <ul className={styles.tournaments}>
            {list.map(item => (
              <li key={item.id}>
                <Link to={`/tournaments/${item.id}`}>{item.name}</Link>
                <span className={styles.tournamentsDate}>
                  {dayjs(item.startDate).isBefore(dayjs()) ?
                    `Окончание ${dayjs(item.endDate).fromNow()}` :
                    `Начало ${dayjs(item.startDate).fromNow()}`
                  }
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}