import dayjs from 'dayjs'
import styles from './styles.module.scss'

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
        <b>{user.nickname}</b><br />{dayjs(createdAt).format('DD.MM.YYYY в HH:mm')}
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