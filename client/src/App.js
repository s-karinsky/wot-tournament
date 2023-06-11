import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Header from './components/Header'
import Footer from './components/Footer'
import Loader from './components/Loader'
import Modal from './components/Modal'
import AlertMessage from './components/AlertMessage'
import Home from './pages/Home'
import TermsOfUse from './pages/TermsOfUse'
import Tournaments from './pages/Tournaments'
import { getProfile } from './redux/store/user'
import { getData } from './redux/store/data'

export default function App() {
  const isUserLoaded = useSelector(state => state.user.isLoaded)
  const isDataLoaded = useSelector(state => state.data.isLoaded)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isUserLoaded) dispatch(getProfile)
  }, [])

  useEffect(() => {
    if (!isUserLoaded) return
    if (!isDataLoaded) dispatch(getData)
  }, [isUserLoaded])

  return isUserLoaded && isDataLoaded ?
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/tournaments/:page?" element={<Tournaments />} />
      </Routes>
      <Modal
        name='alert'
      >
        <AlertMessage />
      </Modal>
      <Footer />
    </div> :
    <Loader />
}

