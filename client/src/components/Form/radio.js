import React from 'react'
import styles from './styles.module.scss'

export default function Radio({
  children,
  className,
  ...rest
}) {
  return (
    <label className={className}>
      <input
        {...rest}
        type='radio'
        className={styles.radioInput}
      />
      <span className={styles.radioLabel}>
        {children}
      </span>
    </label>
  )
}
