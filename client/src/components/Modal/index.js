import { useEffect } from 'react'
import styles from './styles.module.scss'

export default function Modal({
  children,
  title,
  width,
  onClose = () => {}
}) {
  useEffect(() => {
    document.querySelector('body').style.overflow = 'hidden'
    return () => {
      document.querySelector('body').style.overflow = 'auto'
    }
  }, [])

  return (
    <div
      className={styles.overlay}
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className={styles.modal}
        style={{ width }}
      >
        <div className={styles.modalTitle}>{title}</div>
        <span className={styles.modalClose} onClick={onClose}>×</span>
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  )
}