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
          id: item.id || item._id,
          pricePerDay: item.pricePerDay || parseInt(item.price?.replace('$', '').replace('/day', '') || '0'),
          startDate: item.startDate || getDefaultStartDate(),
          endDate: item.endDate || getDefaultEndDate(),
          pickupLocation: item.pickupLocation || '',
          dropoffLocation: item.dropoffLocation || '',
          notes: item.notes || '',
          rentalDays: item.rentalDays || calculateRentalDays(item.startDate || getDefaultStartDate(), item.endDate || getDefaultEndDate())
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

  const getDefaultStartDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const getDefaultEndDate = () => {
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 2)
    return dayAfter.toISOString().split('T')[0]
  }

  const calculateRentalDays = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const addToCart = (vehicle, rentalDays = 1) => {
    const vehicleId = vehicle._id || vehicle.id;
    const pricePerDay = vehicle.pricePerDay || parseInt(vehicle.price?.replace('$', '').replace('/day', '') || '0')
    const startDate = getDefaultStartDate()
    const endDate = getDefaultEndDate()
    const existingItem = cartItems.find(item => item.id === vehicleId)
    
    if (existingItem) {
      // Update quantity if vehicle already in cart
      setCartItems(cartItems.map(item =>
        item.id === vehicleId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      // Add new vehicle to cart
      setCartItems([...cartItems, { 
        ...vehicle, 
        id: vehicleId, 
        quantity: 1, 
        rentalDays: calculateRentalDays(startDate, endDate),
        pricePerDay,
        startDate,
        endDate,
        pickupLocation: '',
        dropoffLocation: '',
        notes: ''
      }])
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

  const updateStartDate = (vehicleId, startDate) => {
    setCartItems(cartItems.map(item => {
      if (item.id === vehicleId) {
        const newRentalDays = calculateRentalDays(startDate, item.endDate)
        return { ...item, startDate, rentalDays: newRentalDays }
      }
      return item
    }))
  }

  const updateEndDate = (vehicleId, endDate) => {
    setCartItems(cartItems.map(item => {
      if (item.id === vehicleId) {
        const newRentalDays = calculateRentalDays(item.startDate, endDate)
        return { ...item, endDate, rentalDays: newRentalDays }
      }
      return item
    }))
  }

  const updatePickupLocation = (vehicleId, pickupLocation) => {
    setCartItems(cartItems.map(item =>
      item.id === vehicleId ? { ...item, pickupLocation } : item
    ))
  }

  const updateDropoffLocation = (vehicleId, dropoffLocation) => {
    setCartItems(cartItems.map(item =>
      item.id === vehicleId ? { ...item, dropoffLocation } : item
    ))
  }

  const updateNotes = (vehicleId, notes) => {
    setCartItems(cartItems.map(item =>
      item.id === vehicleId ? { ...item, notes } : item
    ))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.pricePerDay * item.rentalDays * item.quantity)
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
        updateStartDate,
        updateEndDate,
        updatePickupLocation,
        updateDropoffLocation,
        updateNotes,
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
