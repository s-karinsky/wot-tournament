import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import News from '../../components/News'
import styles from './styles.module.scss'

export default function Home() {
  const news = useSelector(state => state.data.news)
  const clan = useSelector(state => state.data.clan)
  const isAuthorized = useSelector(state => state.user.authorized)

  return (
    <div className={cn('container', styles.home)}>
      <div className={styles.news}>
        <News list={news} />
      </div>
      <div className={styles.info}>
        {isAuthorized && <div className='content-block'>
          <div className='header'>Правила клана</div>
          <span dangerouslySetInnerHTML={{ __html: clan.description_html }}></span>
        </div>}
        <div className='content-block'>
          <div className='header'>Активные турниры</div>
          <ul className={styles.tournaments}>
            <li>
              <Link to='#'>Турнир 1</Link>
              <span className={styles.tournamentsDate}>Начнется через 2 дня</span>
            </li>
            <li>
              <Link to='#'>Турнир 2</Link>
              <span className={styles.tournamentsDate}>Начнется сегодня</span>
            </li>
            <li>
              <Link to='#'>Турнир 3</Link>
              <span className={styles.tournamentsDate}>Окончание через 5 дней</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}