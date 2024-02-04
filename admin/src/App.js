import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Row } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Home from './pages/Home'
import Layout from './components/Layout'
import { useUser } from './utils/hooks'

export default function App() {
  const user = useUser()
  const hasAccess = ['admin', 'moderator'].includes(user.data?.role)

  if (user.isLoading) {
    return (
      <Row style={{ height: '100vh' }} justify='center' align='middle'>
        <LoadingOutlined style={{ fontSize: '64px' }} />
      </Row>
    )
  }

  if (!hasAccess) {
    return <div>403</div>
  }

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route element={<Home />} index />
      </Route>
    </Routes>
  )
}

