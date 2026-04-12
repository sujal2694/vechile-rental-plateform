import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('motiveRideCart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        const updatedCart = parsed.map(item => ({
          ...item,
          id: item.id || item._id
        }))
        setCartItems(updatedCart)
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('motiveRideCart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (vehicle, rentalDays) => {
    const vehicleId = vehicle._id || vehicle.id;
    const existingItem = cartItems.find(item => item.id === vehicleId)
    
    if (existingItem) {
      // Update quantity and days if vehicle already in cart
      setCartItems(cartItems.map(item =>
        item.id === vehicleId
          ? { ...item, rentalDays, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      // Add new vehicle to cart
      setCartItems([...cartItems, { ...vehicle, id: vehicleId, quantity: 1, rentalDays }])
    }
  }

  const removeFromCart = (vehicleId) => {
    setCartItems(cartItems.filter(item => item.id !== vehicleId))
  }

  const updateQuantity = (vehicleId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(vehicleId)
    } else {
      setCartItems(cartItems.map(item =>
        item.id === vehicleId ? { ...item, quantity } : item
      ))
    }
  }

  const updateRentalDays = (vehicleId, rentalDays) => {
    setCartItems(cartItems.map(item =>
      item.id === vehicleId ? { ...item, rentalDays } : item
    ))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const pricePerDay = parseInt(item.price.replace('$', '').replace('/day', ''))
      return total + (pricePerDay * item.rentalDays * item.quantity)
    }, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateRentalDays,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
