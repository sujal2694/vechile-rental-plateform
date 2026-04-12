"use client";
import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { contactService } from '../lib/apiService'

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await contactService.submitContactForm(formData)
      if (response.success) {
        setSuccess('Thank you for your message. We will get back to you soon!')
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
        setTimeout(() => setSuccess(''), 5000)
      } else {
        setError(response.message || 'Failed to send message')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-white'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-900 to-orange-500 text-white py-12 px-4'>
          <div className='max-w-7xl mx-auto'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>Contact Us</h1>
            <p className='text-lg text-gray-100'>Get in touch with our team. We're here to help!</p>
          </div>
        </div>

        {/* Contact Section */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16'>
            {/* Contact Info Cards */}
            <div className='bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow'>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4'>
                <i className='bx bx-map text-orange-500 text-2xl'></i>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>Address</h3>
              <p className='text-gray-600'>
                123 Main Street<br />
                Business District<br />
                City, Country 12345
              </p>
            </div>

            <div className='bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow'>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4'>
                <i className='bx bx-phone text-orange-500 text-2xl'></i>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>Phone</h3>
              <p className='text-gray-600'>
                +1 (123) 456-7890<br />
                Mon - Fri: 9AM - 6PM<br />
                Sat - Sun: 10AM - 4PM
              </p>
            </div>

            <div className='bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow'>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4'>
                <i className='bx bx-envelope text-orange-500 text-2xl'></i>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>Email</h3>
              <p className='text-gray-600'>
                support@motiveride.com<br />
                sales@motiveride.com<br />
                info@motiveride.com
              </p>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Form */}
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-6'>Send us a Message</h2>
              {error && (
                <div className='p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4'>
                  {error}
                </div>
              )}
              {success && (
                <div className='p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-4'>
                  {success}
                </div>
              )}
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label htmlFor='fullName' className='block text-sm font-semibold text-gray-900 mb-2'>
                    Full Name *
                  </label>
                  <input
                    type='text'
                    id='fullName'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder='John Doe'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    required
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='email' className='block text-sm font-semibold text-gray-900 mb-2'>
                      Email *
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='you@example.com'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor='phone' className='block text-sm font-semibold text-gray-900 mb-2'>
                      Phone (Optional)
                    </label>
                    <input
                      type='tel'
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder='+1 (123) 456-7890'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor='subject' className='block text-sm font-semibold text-gray-900 mb-2'>
                    Subject *
                  </label>
                  <input
                    type='text'
                    id='subject'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder='How can we help?'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    required
                  />
                </div>

                <div>
                  <label htmlFor='message' className='block text-sm font-semibold text-gray-900 mb-2'>
                    Message *
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    placeholder='Your message here...'
                    rows='6'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none'
                    required
                  ></textarea>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className={`w-full font-semibold py-3 rounded-lg transition-colors duration-200 ${
                    loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Info Section */}
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-6'>Why Contact Us?</h2>
              <div className='space-y-6'>
                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                      <i className='bx bx-check text-orange-500 text-xl'></i>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 mb-1'>Quick Response</h3>
                    <p className='text-gray-600'>
                      We respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                      <i className='bx bx-check text-orange-500 text-xl'></i>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 mb-1'>Expert Support</h3>
                    <p className='text-gray-600'>
                      Our team is trained to handle all booking and service inquiries professionally.
                    </p>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                      <i className='bx bx-check text-orange-500 text-xl'></i>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 mb-1'>Multiple Channels</h3>
                    <p className='text-gray-600'>
                      Reach us via phone, email, or our contact form - whatever works best for you.
                    </p>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                      <i className='bx bx-check text-orange-500 text-xl'></i>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 mb-1'>24/7 Emergency Support</h3>
                    <p className='text-gray-600'>
                      For urgent matters during your rental, we offer round-the-clock emergency support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Contact
