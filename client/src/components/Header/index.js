import React from 'react'
import MainNav from '../MainNav'

const NAV_ITEMS = [
  {
    link: '/tournaments',
    title: 'Турниры',

  },
  {
    link: '/akr',
    title: 'АКР'
  },
  {
    link: '/rules',
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

export default function Header({ user }) {
  return (
    <header>
      <MainNav items={NAV_ITEMS} user={user} />
    </header>
  )
}