import axios from 'axios'

export default axios.create({
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*', 
    'Content-Type': 'application/json'
  }
})