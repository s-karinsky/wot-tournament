import styles from './styles.module.scss'

export default function Select({
  label,
  children,
  ...rest
}) {
  return (
    <label>
      {!!label && <span className={styles.label}>{label}</span>}
      <div className={styles.selectWrapper}>
        <select
           {...rest}
          className={styles.select}
        >
          {children}
        </select>
      </div>
    </label>
  )
}