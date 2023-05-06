import styles from './styles.module.scss'

export default function Button({
  children,
  ...rest
}) {
  return (
    <button
      {...rest}
      className={styles.button}
    >
      {children}
    </button>
  )
}