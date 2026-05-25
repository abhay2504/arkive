import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import ProductPage from './components/ProductPage'
import CartDrawer from './components/CartDrawer'

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <ProductPage />
      <CartDrawer />
    </CartProvider>
  )
}
