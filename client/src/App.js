import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Header from './components/Header'
import Loader from './components/Loader'
import Home from './pages/Home'
import { setProfile, setLoaded, setLoading } from './redux/store/user'

export default function App() {
  const isUserLoaded = useSelector(state => state.user.isLoaded)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    axios.get('/api/user/profile').then(res => {
      dispatch(setLoading(false))
      dispatch(setLoaded(true))
      const { data = {} } = res
      if (data.status !== 'ok') return
      const userMap = data.data
      const userId = Object.keys(userMap)[0]
      const userData = userMap[userId]
      dispatch(setProfile({ ...userData, authorized: true }))
    }).catch(() => {
      dispatch(setLoading(false))
      dispatch(setLoaded(true))
    })
  }, [])

  return isUserLoaded ?
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/as" element={<Home />} />
      </Routes>
    </div> :
    <Loader />
}

