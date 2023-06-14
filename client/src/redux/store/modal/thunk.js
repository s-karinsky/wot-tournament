import { show } from './'
import iconError from '../../../components/Icon/error.svg'

export const alertResponseError = error => dispatch => {
  const { response } = error
  const message = response.data?.error
  dispatch(show({ name: 'alert', icon: iconError, text: message }))
}