import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Marketplace from './pages/Marketplace'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/prijava" element={<Login />} />
        <Route path="/registracija" element={<Register />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/proizvodi" element={<Marketplace />} />
        <Route path="/proizvod/:id" element={<ProductDetail />} />
        <Route path="/korpa" element={<Cart />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
