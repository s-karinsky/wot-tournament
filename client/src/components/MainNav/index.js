import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { API_URL } from '../../consts'
import { getClanRole } from '../../redux/store/data'
import styles from './styles.module.scss'

export default function MainNav({
  items = []
}) {
  const user = useSelector(state => state.user)
  const role = useSelector(state => getClanRole(state, user.profile?.account_id))
  const { pathname } = useLocation()
  const nav = user.authorized ? items : []
  return (
    <div className={styles.mainNavWrapper}>
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
              <img src="/logo.png" alt="Logo" />
            </Link>
          </li>
          {nav.map(item => (
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
                  {role ? role.role_i18n : ''} {user.profile?.nickname}
                </Link>
                <br />
                <a className={styles.logoutLink} href={`${API_URL}/api/user/logout`}>Выход</a>
              </span>) :
              (<a className={styles.navLink} href={`${API_URL}/api/user/auth`}>
                Войти
              </a>)
            }
          </li>
        </ul>
      </div>
    </div>
  )
}