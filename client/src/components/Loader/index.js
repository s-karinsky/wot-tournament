import styles from './styles.module.scss'

export default function Loader({ size = '40px' }) {
  return (
    <div
      style={{
        width: size,
        height: size
      }}
      className={styles.loader}
    ></div>
  )
}