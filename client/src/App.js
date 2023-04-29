import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Header from './components/Header'
import Footer from './components/Footer'
import Loader from './components/Loader'
import Home from './pages/Home'
import TermsOfUse from './pages/TermsOfUse'
import { getProfile } from './redux/store/user'
import { getData } from './redux/store/data'

export default function App() {
  const isUserLoaded = useSelector(state => state.user.isLoaded)
  const isDataLoaded = useSelector(state => state.data.isLoaded)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isUserLoaded) dispatch(getProfile)
    if (!isDataLoaded) dispatch(getData)
  }, [])

  return isUserLoaded && isDataLoaded ?
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
      </Routes>
      <Footer />
    </div> :
    <Loader />
}

