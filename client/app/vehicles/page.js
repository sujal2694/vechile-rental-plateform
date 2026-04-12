"use client";
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AddToCartModal from '../components/AddToCartModal'
import { vehicleService } from '../lib/apiService'

const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000'

const Vehicles = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const categories = ['All', 'Economy', 'Compact', 'SUV', 'Van', 'Premium', 'Luxury']

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await vehicleService.getAllVehicles()
      if (response.success && response.vehicles) {
        setVehicles(response.vehicles)
      } else {
        setError(response.message || 'Failed to load vehicles')
      }
    } catch (err) {
      setError('Error loading vehicles')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredVehicles = selectedCategory === 'All' 
    ? vehicles 
    : vehicles.filter(v => v.category === selectedCategory)

  const handleBookNow = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedVehicle(null)
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-white'>
        {/* Header Section */}
        <div className='bg-gradient-to-r from-blue-900 to-orange-500 text-white py-12 px-4'>
          <div className='max-w-7xl mx-auto'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>Our Vehicle Fleet</h1>
            <p className='text-lg text-gray-100'>Explore our wide range of premium vehicles for every occasion</p>
          </div>
        </div>

        {/* Filters and Results */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          {error && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6'>
              {error}
            </div>
          )}

          {/* Category Filter */}
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Filter by Category</h2>
            <div className='flex flex-wrap gap-3'>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
                <p className='text-gray-600'>Loading vehicles...</p>
              </div>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-600 text-lg'>No vehicles found in this category</p>
            </div>
          ) : (
            /* Vehicles Grid */
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredVehicles.map((vehicle, index) => (
              <div 
                key={vehicle._id || vehicle.id || index}
                className='bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
              >
                <div className='relative h-64 overflow-hidden bg-gray-200'>
                  <img 
                    src={vehicle.image ? `${backendBaseUrl}${vehicle.image}` : '/placeholder-car.jpg'}
                    alt={vehicle.name}
                    className='w-full h-full object-cover hover:scale-110 transition-transform duration-300'
                  />
                  <div className='absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                    {vehicle.category}
                  </div>
                </div>

                <div className='p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>{vehicle.name}</h3>
                  
                  <div className='grid grid-cols-3 gap-3 mb-4 text-sm'>
                    <div className='flex items-center gap-1'>
                      <i className='bx bx-user text-orange-500'></i>
                      <span className='text-gray-600'>{vehicle.seats} Seats</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <i className='bx bx-cog text-orange-500'></i>
                      <span className='text-gray-600'>{vehicle.transmission}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <i className='bx bx-droplet text-orange-500'></i>
                      <span className='text-gray-600'>{vehicle.fuel}</span>
                    </div>
                  </div>

                  <div className='flex items-center gap-2 mb-4'>
                    <div className='flex'>
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i}
                          className={`bx bxs-star ${i < Math.floor(vehicle.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        ></i>
                      ))}
                    </div>
                    <span className='text-gray-600 text-sm'>({vehicle.rating})</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-2xl font-bold text-orange-500'>{vehicle.price}</span>
                    <button 
                      onClick={() => handleBookNow(vehicle)}
                      className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold'
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      {selectedVehicle && (
        <AddToCartModal 
          vehicle={selectedVehicle} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  )
}

export default Vehicles
