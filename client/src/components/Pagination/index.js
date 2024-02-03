import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import styles from './styles.module.scss'

export default function Pagination({
  title = 'Страницы',
  total,
  current
}) {
  const pages = useMemo(() => Array.from({ length: total }, (value, index) => index + 1), [total])
  if (total <= 1) return null

  return (
    <div>
      {title}
      <ul className={styles.pagination}>
        {pages.map(page => (
          <li className={cn(styles.page, {
            [styles.page__current]: Number(current) === page
          })}>
            <Link to={`?page=${page}`}>
              {page}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}