import React, { useState } from 'react'
import styles from './styles.module.scss'

export default function Checkbox({
  children,
  className,
  ...rest
}) {
  return (
    <label className={className}>
      <input
        {...rest}
        type='checkbox'
        className={styles.checkboxInput}
      />
      <span className={styles.checkboxLabel}>
        {children}
      </span>
    </label>
  )
}
