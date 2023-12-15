import React from 'react'
import { FaWhatsappSquare, FaTelegramPlane, FaViber, FaVk } from 'react-icons/fa'
import styles from './styles.module.scss'

export default function Header() {
  return (
    <footer className={styles.footer}>
      <div className='container'>
        <div className={styles.footer__inner}>
          <div>
            © 2023 ТВ (12+)
          </div>
          <div className={styles.footer__share}>
            <a target='_blank' href={`https://api.whatsapp.com/send?text=${encodeURIComponent(document.URL)}`}>
              <FaWhatsappSquare size={24} color='#25D366' />
            </a>
            <a target='_blank' href={`https://t.me/share/url?url=${encodeURIComponent(document.URL)}`}>
              <FaTelegramPlane size={24} color='#229ED9' />
            </a>
            <a target='_blank' href={`viber://forward?text=${encodeURIComponent(document.URL)}`}>
              <FaViber size={24} color='#7360f2' />
            </a>
            <a target='_blank' href={`http://vk.com/share.php?url=${encodeURIComponent(document.URL)}`}>
              <FaVk size={24} color='#0077FF' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}