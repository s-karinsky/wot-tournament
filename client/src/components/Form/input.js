import styles from './styles.module.scss'

export default function Input({
  label,
  type = 'text',
  ...rest
}) {
  return (
    <label>
      {!!label && <span className={styles.label}>{label}</span>}
      <input
        {...rest}
        type={type}
        className={styles.input}
      />
    </label>
  )
}