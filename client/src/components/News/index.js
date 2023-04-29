import dayjs from 'dayjs'
import styles from './styles.module.scss'

export default function News({ list = [] }) {
  return (
    <div className='content-block'>
      <div className='header'>Танковые новости</div>
      {list.slice(0, 10).map((item, i) => (
        <div className={styles.newsItem} key={i}>
          <span className={styles.newsDate}>
            {dayjs(item.date).format('DD.MM.YYYY')}
          </span>
          <a
            className={styles.newsLink}
            href={`http://tanki.su${item.link}`}
            target="_blank"
          >
            {item.title}
          </a>
        </div>
      ))}
    </div>
  )
}