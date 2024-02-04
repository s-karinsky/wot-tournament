import { Route, Routes } from 'react-router-dom'
import { Row } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Users from './pages/Users'
import User from './pages/User'
import Layout from './components/Layout'
import { useProfile } from './utils/hooks'

export default function App() {
  const profile = useProfile()
  const hasAccess = ['admin', 'moderator'].includes(profile.data?.role)

  if (profile.isLoading) {
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
        <Route element={<Users />} index />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<User />} />
      </Route>
    </Routes>
  )
}

