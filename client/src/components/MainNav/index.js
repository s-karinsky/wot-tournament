import React from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import styles from './styles.module.scss'

export default function MainNav({
  items = [],
  user = {}
}) {
  return (
    <div className={styles.mainNav}>
      <ul className={cn('container', styles.navList)}>
        {items.map(item => (
          <li className={styles.navItem} key={item.link}>
            <Link className={styles.navLink} to={item.link}>{item.title}</Link>
          </li>
        ))}
        <li className={cn(styles.navItem, styles.profileItem)}>
          {user.authorized ?
            (<span>
              <Link className={styles.navLink} to="/account">
                {user.nickname}
              </Link>
              <a className={styles.logoutLink} href="http://localhost:3001/api/user/logout">Выход</a>
            </span>) :
            (<a className={styles.navLink} href="http://localhost:3001/api/user/auth">
              Войти или зарегистрироваться
            </a>)
          }
        </li>
      </ul>
    </div>
  )
}