"use client";
import React, { useState, useEffect } from 'react'
import { vehicleService } from '../lib/apiService'
import AddToCartModal from './AddToCartModal'

const FeaturedVehicles = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await vehicleService.getAllVehicles()
      if (response.success && response.vehicles) {
        setVehicles(response.vehicles.slice(0, 6)) // Show only first 6
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVehicle(null)
  }

  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
      {/* Section Header */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
          Our <span className='text-orange-500'>Featured</span> Vehicles
        </h2>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
          Explore our premium collection of well-maintained vehicles for every occasion
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading vehicles...</p>
          </div>
        </div>
      ) : (
        /* Vehicles Grid */
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle._id || vehicle.id} 
              className='bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
            >
              {/* Vehicle Image */}
              <div className='relative h-64 overflow-hidden bg-gray-200'>
                <img 
                  src={vehicle.image ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api$/, '')}${vehicle.image}` : '/placeholder-car.jpg'}
                  alt={vehicle.name}
                  className='w-full h-full object-cover hover:scale-110 transition-transform duration-300'
                />
                <div className='absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                  {vehicle.category}
                </div>
              </div>

            {/* Vehicle Details */}
            <div className='p-6'>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>{vehicle.name}</h3>
              
              {/* Specs */}
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

              {/* Rating */}
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

              {/* Price and Button */}
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold text-orange-500'>{vehicle.price}</span>
                <button 
                  onClick={() => openModal(vehicle)}
                  className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold flex items-center gap-2'
                >
                  <i className='bx bx-cart-add text-lg'></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Add to Cart Modal */}
      {selectedVehicle && (
        <AddToCartModal 
          vehicle={selectedVehicle} 
          isOpen={isModalOpen} 
          onClose={closeModal}
        />
      )}
    </section>
  )
}

export default FeaturedVehicles
