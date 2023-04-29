import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

export default function MainNav({
  items = []
}) {
  const user = useSelector(state => state.user)
  const { pathname } = useLocation()

  return (
    <div className={styles.mainNav}>
      <ul className={cn('container', styles.navList)}>
        <li className={styles.navItem}>
          <Link
            className={cn(styles.navLink, styles.navLinkLogo, {
              [styles.navLinkLogo_active]: pathname === '/'
            })}
            title="Сайт для настоящих танкистов"
            to="/"
          >
            ТаВ
          </Link>
        </li>
        {items.map(item => (
          <li className={styles.navItem} key={item.link}>
            <Link
              className={cn(styles.navLink, {
                [styles.navLink_active]: pathname.indexOf(item.link) === 0
              })}
              to={item.link}
            >
              {item.title}
            </Link>
          </li>
        ))}
        <li className={cn(styles.navItem, styles.profileItem)}>
          {user.authorized ?
            (<span>
              <Link className={cn(styles.accountLink)} to="/account">
                {user.profile?.nickname}
              </Link>
              <br />
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