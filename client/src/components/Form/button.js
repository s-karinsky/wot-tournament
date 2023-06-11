import { Link } from 'react-router-dom'
import cn from 'classnames'
import styles from './styles.module.scss'

export default function Button({
  children,
  size,
  ...rest
}) {
  const Element = rest.to ? Link : 'button'

  return (
    <Element
      {...rest}
      className={cn(styles.button, {
        [styles[`button_${size}`]]: size
      })}
    >
      {children}
    </Element>
  )
}