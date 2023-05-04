import styles from './styles.module.scss'

export default function Loader({ size = '40px', isStatic }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: isStatic ? 'static' : 'absolute',
        margin: isStatic ? 0 : undefined
      }}
      className={styles.loader}
    ></div>
  )
}