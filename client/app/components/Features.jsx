import React from 'react'
import { features } from '../assets/assets'

const Features = () => {
  return (
    <section className='bg-gray-50 py-16 md:py-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Why <span className='text-orange-500'>Choose</span> MotiveRide?
          </h2>
          <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
            We provide the best car rental experience with reliable service and competitive prices
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature) => (
            <div 
              key={feature.id}
              className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200'
            >
              {/* Icon */}
              <div className='inline-block p-4 bg-orange-100 rounded-lg mb-4'>
                <i className={`bx ${feature.icon} text-orange-500 text-3xl`}></i>
              </div>

              {/* Title and Description */}
              <h3 className='text-xl font-bold text-gray-900 mb-3'>{feature.title}</h3>
              <p className='text-gray-600 leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
