import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import dayjs from 'dayjs'
import { getStartTimeTZ, getEndTimeTZ } from '../../utils/utils'
import { Helmet } from 'react-helmet'
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
    <>
      <Helmet>
        <title>The tank brothers</title>
      </Helmet>
      <div className={cn('container', styles.home)}>
        <div className={styles.news}>
          <News list={news} />
        </div>
        <div className={styles.info}>
          {isAuthorized && !!clan.description_html && <div className='content-block'>
            <div className='header'>Правила клана</div>
            <span dangerouslySetInnerHTML={{ __html: clan.description_html }}></span>
          </div>}
          {isAuthorized && list.length > 0 && <div className='content-block'>
            <div className='header'>Активные турниры</div>
            <ul className={styles.tournaments}>
              {list.map(item => (
                <li key={item.id}>
                  <Link to={`/tournaments/${item.id}`}>{item.name}</Link>
                  <span className={styles.tournamentsDate}>
                    {getStartTimeTZ(item.startDate).isBefore(dayjs()) ?
                      `Окончание ${getEndTimeTZ(item.endDate).fromNow()}` :
                      `Начало ${getStartTimeTZ(item.startDate).fromNow()}`
                    }
                  </span>
                </li>
              ))}
            </ul>
          </div>}
          {!isAuthorized && <div className='content-block'>
            <div className='header'>Дорогие друзья, приветствую Вас на сайте для настоящих танкистов!</div>
            <span>
              Этот сайт создан для игроков из "Мир Танков". Любая активность возможна только после входа, допуск на сайт осуществляется через "LESTA GAMES" под своим аккаунтом. Согласно безопасности "LESTA GAMES" сайту не будет предоставлен доступ к Вашим Email, паролю и номеру телефона.
            </span>
          </div>}
        </div>
      </div>
    </>
  )
}