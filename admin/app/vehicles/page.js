"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminAuthService, vehicleService } from '../lib/apiService.js'
import AdminSidebar from '../components/AdminSidebar';

const Vehicles = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Economy',
    price: '',
    seats: 5,
    transmission: 'Manual',
    fuel: 'Petrol',
    rating: 4.5,
    image: null,
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = adminAuthService.getToken()
    if (!token) {
      router.push('/')
      return
    }
    setIsAuthenticated(true)
    fetchVehicles()
  }

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const res = await vehicleService.getAllVehicles()
      if (res.success) {
        setVehicles(res.data || [])
      } else {
        console.error('Error fetching vehicles:', res.message)
        setVehicles([])
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setEditingId(vehicle._id)
      setFormData({
        name: vehicle.name,
        category: vehicle.category,
        price: vehicle.price?.replace('$', '').replace('/day', '') || '',
        seats: vehicle.seats,
        transmission: vehicle.transmission,
        fuel: vehicle.fuel,
        rating: vehicle.rating,
        image: null, // Reset image for editing
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        category: 'Economy',
        price: '',
        seats: 5,
        transmission: 'Manual',
        fuel: 'Petrol',
        rating: 4.5,
        image: null,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'seats' || name === 'rating' ? parseFloat(value) || 0 : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('price', `$${formData.price}/day`)
    formDataToSend.append('seats', formData.seats.toString())
    formDataToSend.append('transmission', formData.transmission)
    formDataToSend.append('fuel', formData.fuel)
    formDataToSend.append('rating', formData.rating.toString())
    
    if (formData.image) {
      formDataToSend.append('image', formData.image)
    }

    if (editingId) {
      const res = await vehicleService.updateVehicle(editingId, formDataToSend)
      if (res.success) {
        fetchVehicles()
        handleCloseModal()
      }
    } else {
      const res = await vehicleService.createVehicle(formDataToSend)
      if (res.success) {
        fetchVehicles()
        handleCloseModal()
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const res = await vehicleService.deleteVehicle(id)
      if (res.success) {
        fetchVehicles()
      }
    }
  }

  const handleLogout = () => {
    adminAuthService.logout()
    router.push('/')
  }

  if (!isAuthenticated) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      <AdminSidebar currentPage='vehicles' onLogout={handleLogout} />

      <main className='flex-1 overflow-auto md:ml-0'>
        {/* Header */}
        <div className='bg-white shadow-sm p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Vehicles</h1>
            <p className='text-gray-600 mt-2'>Manage vehicle inventory</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className='bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-semibold transition-all duration-200 flex items-center gap-2'
          >
            <i className='bx bx-plus text-xl'></i>
            Add Vehicle
          </button>
        </div>

        {/* Content */}
        <div className='p-6 md:p-8'>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
            </div>
          ) : vehicles.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {vehicles.map((vehicle) => (
                <div key={vehicle._id} className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200'>
                  <div className='h-48 bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center relative overflow-hidden'>
                    {vehicle.image ? (
                      <img
                        src={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api$/, '')}${vehicle.image}`}
                        alt={vehicle.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <i className='bx bx-car text-6xl text-white opacity-80'></i>
                    )}
                  </div>
                  <div className='p-4'>
                    <h3 className='text-lg font-bold text-gray-800 mb-2'>{vehicle.name}</h3>
                    <div className='space-y-2 text-sm text-gray-600 mb-4'>
                      <p><span className='font-semibold'>Category:</span> {vehicle.category}</p>
                      <p><span className='font-semibold'>Price:</span> {vehicle.price}</p>
                      <p><span className='font-semibold'>Seats:</span> {vehicle.seats}</p>
                      <p><span className='font-semibold'>Fuel:</span> {vehicle.fuel}</p>
                      <p><span className='font-semibold'>Rating:</span> ⭐ {vehicle.rating}</p>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleOpenModal(vehicle)}
                        className='flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-semibold transition-colors duration-200 flex items-center justify-center gap-1'
                      >
                        <i className='bx bx-edit text-lg'></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle._id)}
                        className='flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-semibold transition-colors duration-200 flex items-center justify-center gap-1'
                      >
                        <i className='bx bx-trash text-lg'></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-16'>
              <i className='bx bx-car text-6xl text-gray-300 mb-4 block'></i>
              <p className='text-gray-600 text-lg'>No vehicles found. Add one to get started!</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4'>
          <div className='bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto'>
            <div className='sticky top-0 bg-orange-500 text-white p-6 flex justify-between items-center'>
              <h2 className='text-xl font-bold'>
                {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <button
                onClick={handleCloseModal}
                className='text-2xl hover:text-orange-200'
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Vehicle Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='e.g., Honda City'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Category
                </label>
                <select
                  name='category'
                  value={formData.category}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
                >
                  <option>Economy</option>
                  <option>SUV</option>
                  <option>Compact</option>
                  <option>Premium</option>
                  <option>Luxury</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Price (per day)
                </label>
                <input
                  type='number'
                  name='price'
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder='e.g., 50'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Seats
                </label>
                <input
                  type='number'
                  name='seats'
                  value={formData.seats}
                  onChange={handleInputChange}
                  min='1'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Transmission
                </label>
                <select
                  name='transmission'
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
                >
                  <option>Manual</option>
                  <option>Automatic</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Fuel Type
                </label>
                <select
                  name='fuel'
                  value={formData.fuel}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Rating
                </label>
                <input
                  type='number'
                  name='rating'
                  value={formData.rating}
                  onChange={handleInputChange}
                  min='0'
                  max='5'
                  step='0.1'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Vehicle Image
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100'
                />
                <p className='text-xs text-gray-500 mt-1'>
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  type='submit'
                  className='flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 font-semibold transition-colors'
                >
                  {editingId ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
                <button
                  type='button'
                  onClick={handleCloseModal}
                  className='flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-semibold transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vehicles
