const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Admin Auth Service
export const adminAuthService = {
  register: async (fullName, email, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
          role: 'admin'
        }),
      })
      const data = await response.json()
      
      if (!response.ok) {
        return { success: false, message: data.message || 'Registration failed' }
      }

      if (data.token) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify({
          id: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: 'admin'
        }))
      }

      return { success: true, message: 'Admin registered successfully', token: data.token }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, message: 'An error occurred during registration' }
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: 'admin' }),
      })
      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || 'Login failed' }
      }

      if (data.token) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify({
          id: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: 'admin'
        }))
      }

      return { success: true, message: 'Login successful', token: data.token }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'An error occurred during login' }
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken')
    }
    return null
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('adminUser')
      return user ? JSON.parse(user) : null
    }
    return null
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('adminToken')
    }
    return false
  },

  getProfile: async () => {
    try {
      const token = this.getToken()
      if (!token) return { success: false, message: 'No token found' }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to fetch profile' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Get profile error:', error)
      return { success: false, message: 'An error occurred' }
    }
  },
}

// Vehicle Service (for admin)
export const vehicleService = {
  getAllVehicles: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`)
      const data = await response.json()
      return { success: true, data: data.vehicles || data }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      return { success: false, data: [] }
    }
  },

  createVehicle: async (vehicleData) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: vehicleData, // FormData
      })
      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to create vehicle' }
      }

      return { success: true, message: 'Vehicle created successfully', data }
    } catch (error) {
      console.error('Create vehicle error:', error)
      return { success: false, message: 'An error occurred' }
    }
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      })
      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to update vehicle' }
      }

      return { success: true, message: 'Vehicle updated successfully', data }
    } catch (error) {
      console.error('Update vehicle error:', error)
      return { success: false, message: 'An error occurred' }
    }
  },

  deleteVehicle: async (vehicleId) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return { success: false, message: 'Failed to delete vehicle' }
      }

      return { success: true, message: 'Vehicle deleted successfully' }
    } catch (error) {
      console.error('Delete vehicle error:', error)
      return { success: false, message: 'An error occurred' }
    }
  },
}

// Booking Service (for admin)
export const bookingService = {
  getAllBookings: async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      return { success: true, data: data.bookings || data }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return { success: false, data: [] }
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to update booking' }
      }

      return { success: true, message: 'Booking updated successfully', data }
    } catch (error) {
      console.error('Update booking error:', error)
      return { success: false, message: 'An error occurred' }
    }
  },
}

// Contact Service (for admin)
export const contactService = {
  getAllMessages: async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      return { success: true, data: data.messages || data }
    } catch (error) {
      console.error('Error fetching messages:', error)
      return { success: false, data: [] }
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/contact/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return { success: false, message: 'Failed to delete message' }
      }

      return { success: true, message: 'Message deleted successfully' }
    } catch (error) {
      console.error('Delete message error:', error)
      return { success: false, message: 'An error occurred' }
    }
  },
}
