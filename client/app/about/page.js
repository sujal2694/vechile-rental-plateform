"use client";
import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-white'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-900 to-orange-500 text-white py-12 px-4'>
          <div className='max-w-7xl mx-auto'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>About MotiveRide</h1>
            <p className='text-lg text-gray-100'>Your trusted partner in premium vehicle rentals</p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 mb-16'>
            {/* Mission */}
            <div className='bg-gray-50 p-8 rounded-lg'>
              <div className='w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4'>
                <i className='bx bx-target text-white text-2xl'></i>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Our Mission</h2>
              <p className='text-gray-600 leading-relaxed'>
                To provide affordable, reliable, and convenient vehicle rental services that empower travelers 
                and businesses to explore the world with confidence and ease.
              </p>
            </div>

            {/* Vision */}
            <div className='bg-gray-50 p-8 rounded-lg'>
              <div className='w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4'>
                <i className='bx bx-star text-white text-2xl'></i>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Our Vision</h2>
              <p className='text-gray-600 leading-relaxed'>
                To become the leading car rental platform globally, known for excellence, innovation, and 
                customer satisfaction in every rental experience.
              </p>
            </div>
          </div>

          {/* Company Story */}
          <div className='mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>Our Story</h2>
            <div className='bg-gradient-to-r from-orange-50 to-blue-50 p-8 rounded-lg border-l-4 border-orange-500'>
              <p className='text-gray-700 leading-relaxed mb-4'>
                MotiveRide was founded in 2020 with a simple vision: to revolutionize the car rental industry 
                by offering exceptional vehicles at unbeatable prices. What started as a small fleet of 10 vehicles 
                has grown into a thriving business with over 500 premium cars across multiple locations.
              </p>
              <p className='text-gray-700 leading-relaxed'>
                Today, we're proud to serve thousands of satisfied customers annually, from business travelers 
                to adventure seekers. Our commitment to quality, affordability, and customer service remains 
                unchanged, and we're excited about the future as we continue to expand and innovate.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-16'>
            <div className='text-center'>
              <p className='text-4xl font-bold text-orange-500 mb-2'>500+</p>
              <p className='text-gray-600 font-semibold'>Active Vehicles</p>
            </div>
            <div className='text-center'>
              <p className='text-4xl font-bold text-orange-500 mb-2'>10K+</p>
              <p className='text-gray-600 font-semibold'>Happy Customers</p>
            </div>
            <div className='text-center'>
              <p className='text-4xl font-bold text-orange-500 mb-2'>50+</p>
              <p className='text-gray-600 font-semibold'>Locations</p>
            </div>
            <div className='text-center'>
              <p className='text-4xl font-bold text-orange-500 mb-2'>4.9★</p>
              <p className='text-gray-600 font-semibold'>Average Rating</p>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className='text-3xl font-bold text-gray-900 mb-8'>Our Core Values</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4'>
                  <i className='bx bx-heart text-orange-500 text-xl'></i>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Customer First</h3>
                <p className='text-gray-600'>
                  Your satisfaction is our priority. We go the extra mile to ensure every rental experience is exceptional.
                </p>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4'>
                  <i className='bx bx-check-shield text-orange-500 text-xl'></i>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Reliability</h3>
                <p className='text-gray-600'>
                  Quality vehicles, transparent policies, and 24/7 support you can count on.
                </p>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4'>
                  <i className='bx bx-bulb text-orange-500 text-xl'></i>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Innovation</h3>
                <p className='text-gray-600'>
                  Continuously improving our services with latest technology and customer insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About
