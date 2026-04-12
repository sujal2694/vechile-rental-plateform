import React from 'react'

const CTA = () => {
  return (
    <section className='bg-gradient-to-r from-blue-900 to-orange-500 py-16 md:py-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
          Ready to Book Your Next Ride?
        </h2>
        <p className='text-lg text-gray-100 mb-8 max-w-2xl mx-auto'>
          Sign up now and get exclusive discounts on your first booking. Join thousands of happy customers today!
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <button className='bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg'>
            Book Now
          </button>
          <button className='border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 rounded-lg font-semibold transition-colors duration-200'>
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
          <div>
            <p className='text-4xl font-bold text-white mb-2'>500+</p>
            <p className='text-gray-100'>Active Vehicles</p>
          </div>
          <div>
            <p className='text-4xl font-bold text-white mb-2'>10K+</p>
            <p className='text-gray-100'>Happy Customers</p>
          </div>
          <div>
            <p className='text-4xl font-bold text-white mb-2'>24/7</p>
            <p className='text-gray-100'>Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
