import cn from 'classnames'
import styles from './styles.module.scss'

export default function Loader({ size = '40px', margin, color, isStatic }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: isStatic ? 'static' : 'absolute',
        margin: margin || (isStatic ? 0 : undefined)
      }}
      className={cn(styles.loader, {
        [styles[color]]: !!color
      })}
    ></div>
  )
}