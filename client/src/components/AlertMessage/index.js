import { useDispatch } from 'react-redux'
import { hide } from '../../redux/store/modal'
import { Button } from '../Form'
import styles from './styles.module.scss'

export default function AlertMessage({
  icon,
  text
}) {
  const dispatch = useDispatch()
  return (
    <>
      <div className={styles.message}>
        {!!icon && <img src={icon} className={styles.icon} />}
        <div className={styles.text}>
          {text}
        </div>
      </div>
      <div className={styles.button}>
        <Button
          size='small'
          onClick={() => dispatch(hide('alert'))}
        >Ok</Button>
      </div>
    </>
  )
}