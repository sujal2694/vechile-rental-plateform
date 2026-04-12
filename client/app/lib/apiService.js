// API Service - Handle all backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Auth Services
export const authService = {
  register: async (fullName, email, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, confirmPassword })
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, message: 'Not authenticated' };

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getToken: () => localStorage.getItem('token'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem('token')
};

// Vehicle Services
export const vehicleService = {
  getAllVehicles: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message, vehicles: [] };
    }
  },

  getVehicleById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  searchVehicles: async (category, minPrice, maxPrice) => {
    try {
      let url = `${API_BASE_URL}/vehicles/search?`;
      if (category) url += `category=${category}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}`;
      
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message, vehicles: [] };
    }
  },

  createVehicle: async (vehicleData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicleData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// Booking Services
export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, message: 'Please login to book' };

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getUserBookings: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, message: 'Not authenticated', bookings: [] };

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message, bookings: [] };
    }
  },

  getBookingById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  cancelBooking: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// Contact Services
export const contactService = {
  submitContactForm: async (contactData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// User Services
export const userService = {
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, message: 'Not authenticated' };

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};
