import React from 'react'
import MainNav from '../MainNav'
import styles from './styles.module.scss'

const NAV_ITEMS = [
  {
    link: '/tournaments',
    title: 'Турниры',
    roles: ['admin']
  },
  {
    link: '/akr',
    title: 'АКР',
    roles: ['admin']
  },
  {
    link: '/terms-of-use',
    title: 'Правила сайта'
  },
  {
    link: '/forum',
    title: 'Форум'
  },
  {
    link: '/ratings',
    title: 'Рейтинги'
  }
]

export default function Header() {
  return (
    <header className={styles.header}>
      <MainNav items={NAV_ITEMS} />
    </header>
  )
}