import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import axios from 'axios'
import Header from './components/Header'
import Home from './pages/Home'

export default function App() {
  const [ user, setUser ] = useState({ authorized: false })

  useEffect(() => {
    axios.get('/api/user/profile').then(res => {
      const { data = {} } = res
      if (data.status !== 'ok') return
      const userMap = data.data
      const userId = Object.keys(userMap)[0]
      const userData = userMap[userId]
      setUser({ ...userData, authorized: true })
    })
  }, [])

  return (
    <div>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/as" element={<Home />} />
      </Routes>
    </div>
  )
}

