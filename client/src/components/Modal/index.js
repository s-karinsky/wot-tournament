import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getModalState, hide } from '../../redux/store/modal'
import styles from './styles.module.scss'

export default function Modal({
  name,
  children,
  title,
  width
}) {
  const modalState = useSelector(state => getModalState(state, name))
  const dispatch = useDispatch()
  const onClose = useCallback(() => dispatch(hide(name)), [name])
  const style = !modalState.visibility ? { display: 'none' } : {}

  useEffect(() => () => document.querySelector('body').style.overflow = 'auto', [])

  useEffect(() => {
    if (modalState.visibility) {
      document.querySelector('body').style.overflow = 'hidden'
    } else {
      document.querySelector('body').style.overflow = 'auto'
    }
  }, [modalState.visibility])

  const child = React.isValidElement(children) && modalState.props ?
    React.cloneElement(children, modalState.props) :
    children

  return (
    <div
      className={styles.overlay}
      style={style}
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
          {child}
        </div>
      </div>
    </div>
  )
}