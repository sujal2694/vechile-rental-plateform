import React from 'react'
import { testimonials } from '../assets/assets'

const Testimonials = () => {
  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
      {/* Section Header */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
          What Our <span className='text-orange-500'>Customers</span> Say
        </h2>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
          Thousands of satisfied customers trust MotiveRide for their rental needs
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className='bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200'
          >
            {/* Stars */}
            <div className='flex gap-1 mb-4'>
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i}
                  className={`bx bxs-star ${i < Math.floor(testimonial.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                ></i>
              ))}
            </div>

            {/* Comment */}
            <p className='text-gray-600 mb-6 italic leading-relaxed'>"{testimonial.comment}"</p>

            {/* Author */}
            <div className='flex items-center gap-4 pt-6 border-t border-gray-200'>
              <img 
                src={testimonial.image}
                alt={testimonial.name}
                className='w-12 h-12 rounded-full object-cover'
              />
              <div>
                <p className='font-semibold text-gray-900'>{testimonial.name}</p>
                <p className='text-sm text-gray-600'>{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
