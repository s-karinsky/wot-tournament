import { Link } from 'react-router-dom'
import styles from './styles.module.scss'

export default function Button({
  children,
  ...rest
}) {
  const Element = rest.to ? Link : 'button'

  return (
    <Element
      {...rest}
      className={styles.button}
    >
      {children}
    </Element>
  )
}