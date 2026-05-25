import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'

const CartContext = createContext()

// Generate or retrieve a session ID
const getSessionId = () => {
  let id = localStorage.getItem('arkive_session')
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('arkive_session', id)
  }
  return id
}

const API = import.meta.env.VITE_API_URL || '/api'

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const sessionId = getSessionId()

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/cart/${sessionId}`)
      setCart(data.items)
    } catch (err) {
      console.error('Failed to fetch cart', err)
    }
  }, [sessionId])

  const addToCart = async (item) => {
    try {
      await axios.post(`${API}/cart`, { ...item, sessionId })
      await fetchCart()
      setIsOpen(true)
    } catch (err) {
      console.error('Failed to add to cart', err)
    }
  }

  const updateQty = async (itemId, qty) => {
    try {
      await axios.patch(`${API}/cart/${itemId}`, { qty })
      await fetchCart()
    } catch (err) {
      console.error('Failed to update qty', err)
    }
  }

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${API}/cart/${itemId}`)
      await fetchCart()
    } catch (err) {
      console.error('Failed to remove item', err)
    }
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      cart, cartCount, cartTotal,
      isOpen, setIsOpen,
      addToCart, updateQty, removeItem, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
