"use client";
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminAuthService } from './lib/apiService'

const AdminLogin = () => {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })

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
      let response
      if (isLogin) {
        response = await adminAuthService.login(formData.email, formData.password)
        if (response.success) {
          setSuccess('Login successful! Redirecting to admin dashboard...')
          setTimeout(() => router.push('/dashboard'), 1500)
        } else {
          setError(response.message || 'Login failed')
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        response = await adminAuthService.register(
          formData.fullName,
          formData.email,
          formData.password,
          formData.confirmPassword
        )
        if (response.success) {
          setSuccess('Admin account created successfully! Redirecting...')
          setTimeout(() => router.push('/dashboard'), 1500)
        } else {
          setError(response.message || 'Registration failed')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>MotiveRide</h1>
            <p className='text-gray-600'>Admin Panel</p>
          </div>

          {/* Tab Switch */}
          <div className='flex gap-4 mb-8 bg-gray-100 p-1 rounded-lg'>
            <button
              onClick={() => {
                setIsLogin(true)
                setFormData({
                  email: '',
                  password: '',
                  fullName: '',
                  confirmPassword: ''
                })
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                isLogin
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setFormData({
                  email: '',
                  password: '',
                  fullName: '',
                  confirmPassword: ''
                })
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                !isLogin
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className='p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-pulse'>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className='p-4 mb-6 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-pulse'>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-5'>
            {!isLogin && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Full Name
                </label>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder='Enter your full name'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200'
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter your email'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter your password'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200'
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='Confirm your password'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200'
                  required={!isLogin}
                />
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 active:from-orange-700 active:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <span className='flex items-center justify-center'>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                isLogin ? 'Login as Admin' : 'Create Admin Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-6 pt-6 border-t border-gray-200 text-center'>
            <p className='text-sm text-gray-600'>
              Not an admin?{' '}
              <Link href='/'>
                <span className='text-orange-500 hover:text-orange-600 font-semibold cursor-pointer'>
                  Go to user page
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
