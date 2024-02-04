import { Outlet, Link } from 'react-router-dom'
import { Breadcrumb, Menu, Layout as AntLayout } from 'antd'
import { CommentOutlined, SettingOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = AntLayout

const menuItems = [
  {
    label: <Link to='/'>Пользователи</Link>,
    key: 'users',
    icon: <UserOutlined />
  },
  {
    label: <Link to='/clans'>Кланы</Link>,
    key: 'clans',
    icon: <TeamOutlined />
  },
  {
    label: <Link to='/forum'>Форум</Link>,
    key: 'forum',
    icon: <CommentOutlined />
  },
  {
    label: <Link to='/settings'>Настройки</Link>,
    key: 'settings',
    icon: <SettingOutlined />
  }
]

export default function Layout() {
  return (
    <AntLayout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Menu
          theme='dark'
          mode='horizontal'
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
          defaultSelectedKeys={['users']}
        />
      </Header>
      <Content style={{ padding: '20px 48px 0' }}>
        {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Пользователи</Breadcrumb.Item>
        </Breadcrumb> */}
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        
      </Footer>
    </AntLayout>
  )
}