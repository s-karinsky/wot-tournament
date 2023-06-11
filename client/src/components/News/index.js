import dayjs from 'dayjs'
import styles from './styles.module.scss'

export default function News({ list = [] }) {
  return (
    <div className='content-block'>
      <div className='header'>Танковые новости</div>
      <div className={styles.news}>
        {list.slice(0, 10).map((item, i) => (
          <div className={styles.newsItem} key={i}>
            <a
              className={styles.newsLink}
              href={`http://tanki.su${item.link}`}
              target="_blank"
            >
              <div className={styles.preview}>
                <img src={item.image} className={styles.image} />
              </div>
              <span className={styles.newsTitle}>
                {item.title}
              </span>
              <span className={styles.newsDate}>
                {dayjs(item.date).format('DD.MM.YYYY')}
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}