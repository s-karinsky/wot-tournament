import styles from './styles.module.scss'

export default function Input({
  label,
  type = 'text',
  width,
  ...rest
}) {
  return (
    <label
      className={styles.input}
      style={{ width }}
    >
      {!!label && <span className={styles.label}>{label}</span>}
      <input
        {...rest}
        type={type}
        className={styles.inputField}
      />
    </label>
  )
}