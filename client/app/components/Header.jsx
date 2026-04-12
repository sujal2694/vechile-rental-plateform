import React, { useState } from 'react'

const Header = () => {
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [sameLocation, setSameLocation] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search:', { pickupLocation, dropoffLocation, pickupDate, returnDate })
    // Add booking logic here
  }

  return (
    <div className='w-full'>
      {/* Hero Section */}
      <div className='relative w-full h-96 md:h-[500px] bg-gradient-to-r from-blue-900 via-blue-800 to-orange-500 overflow-hidden'>
        {/* Decorative Elements */}
        <div className='absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>

        {/* Content */}
        <div className='relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-3xl md:text-5xl font-bold text-white mb-4'>
            Your Journey, <span className='text-orange-400'>Our Priority</span>
          </h1>
          <p className='text-lg md:text-xl text-gray-100 mb-8 max-w-2xl'>
            Rent premium vehicles for your next adventure. Fast, easy, and affordable.
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className='relative z-20 -mt-20 md:-mt-32 mb-8'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <form onSubmit={handleSearch} className='bg-white rounded-xl shadow-2xl p-6 md:p-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end'>
              {/* Pickup Location */}
              <div className='flex flex-col'>
                <label className='text-sm font-semibold text-gray-700 mb-2'>
                  <i className='bx bx-map mr-2'></i>Pickup Location
                </label>
                <input
                  type='text'
                  placeholder='City or airport'
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  required
                />
              </div>

              {/* Dropoff Location */}
              <div className='flex flex-col'>
                <label className='text-sm font-semibold text-gray-700 mb-2'>
                  <i className='bx bx-map mr-2'></i>Dropoff Location
                </label>
                <input
                  type='text'
                  placeholder='City or airport'
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  disabled={sameLocation}
                  className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100'
                  required={!sameLocation}
                />
              </div>

              {/* Pickup Date */}
              <div className='flex flex-col'>
                <label className='text-sm font-semibold text-gray-700 mb-2'>
                  <i className='bx bx-calendar mr-2'></i>Pickup Date
                </label>
                <input
                  type='date'
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  required
                />
              </div>

              {/* Return Date */}
              <div className='flex flex-col'>
                <label className='text-sm font-semibold text-gray-700 mb-2'>
                  <i className='bx bx-calendar mr-2'></i>Return Date
                </label>
                <input
                  type='date'
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  required
                />
              </div>

              {/* Search Button */}
              <button
                type='submit'
                className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 h-12'
              >
                <i className='bx bx-search text-xl'></i>
                <span className='hidden sm:inline'>Search</span>
              </button>
            </div>

            {/* Quick Filters */}
            <div className='mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 items-center'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input 
                  type='checkbox' 
                  checked={sameLocation}
                  onChange={(e) => setSameLocation(e.target.checked)}
                  className='w-4 h-4 text-orange-500 rounded focus:ring-orange-500 cursor-pointer' 
                />
                <span className='text-sm text-gray-700'>Return to same location</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' className='w-4 h-4 text-orange-500 rounded focus:ring-orange-500 cursor-pointer' />
                <span className='text-sm text-gray-700'>Driver under 25</span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Header
