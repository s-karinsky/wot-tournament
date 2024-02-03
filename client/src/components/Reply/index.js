import dayjs from 'dayjs'
import styles from './styles.module.scss'

const IconWarning = () => (  
  <svg fill="currentColor" version="1.1" viewBox="0 0 478.125 478.125">
    <g>
      <g>
        <g>
          <circle cx="239.904" cy="314.721" r="35.878"/>
          <path d="M256.657,127.525h-31.9c-10.557,0-19.125,8.645-19.125,19.125v101.975c0,10.48,8.645,19.125,19.125,19.125h31.9
            c10.48,0,19.125-8.645,19.125-19.125V146.65C275.782,136.17,267.138,127.525,256.657,127.525z"/>
          <path d="M239.062,0C106.947,0,0,106.947,0,239.062s106.947,239.062,239.062,239.062c132.115,0,239.062-106.947,239.062-239.062
            S371.178,0,239.062,0z M239.292,409.734c-94.171,0-170.595-76.348-170.595-170.596c0-94.248,76.347-170.595,170.595-170.595
            s170.595,76.347,170.595,170.595C409.887,333.387,333.464,409.734,239.292,409.734z"/>
        </g>
      </g>
    </g>
  </svg>
)

export default function Reply({
  id,
  createdAt,
  text,
  updatedAt,
  user
}) {
  return (
    <div className={styles.reply} id={id}>
      <div className={styles.replyInfo}>
        <b>{user.nickname}</b><br />
        {dayjs(createdAt).format('DD.MM.YYYY в HH:mm')}
        {user.violations?.length > 0 &&
          <div className={styles.violations}>
            <b>Предупреждения:</b>
            <div className={styles.warnings}>
              {user.violations.map(item => (
                <span className={styles.warning} data-reason={item.reason}>
                  <IconWarning />
                </span>
              ))}
            </div>
          </div>
        }
      </div>
      <div
        className={styles.replyText}
        dangerouslySetInnerHTML={{
          __html: text
        }}
      />
    </div>
  )
}