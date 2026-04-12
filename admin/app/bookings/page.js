"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminAuthService, bookingService } from '../lib/apiService.js'
import AdminSidebar from '../components/AdminSidebar'

const Bookings = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredBookings, setFilteredBookings] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')

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
    fetchBookings()
  }

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await bookingService.getAllBookings()
      setBookings(res.data || [])
      filterBookings(res.data || [], 'all')
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = (data, status) => {
    if (status === 'all') {
      setFilteredBookings(data)
    } else {
      setFilteredBookings(data.filter(booking => booking.status === status))
    }
    setStatusFilter(status)
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    const res = await bookingService.updateBookingStatus(bookingId, newStatus)
    if (res.success) {
      fetchBookings()
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
      <AdminSidebar currentPage='bookings' onLogout={handleLogout} />

      <main className='flex-1 overflow-auto md:ml-0'>
        {/* Header */}
        <div className='bg-white shadow-sm p-6 md:p-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Bookings</h1>
          <p className='text-gray-600 mt-2'>Manage all rental bookings</p>
        </div>

        {/* Content */}
        <div className='p-6 md:p-8'>
          {/* Filter Tabs */}
          <div className='mb-6 flex flex-wrap gap-2 bg-white rounded-lg p-3 shadow-sm'>
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => filterBookings(bookings, status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 capitalize ${
                  statusFilter === status
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Bookings' : status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Booking ID</th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Customer</th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Vehicle</th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Dates</th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Cost</th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Status</th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id} className='border-b border-gray-100 hover:bg-gray-50 transition-colors'>
                        <td className='px-4 py-4 text-sm font-medium text-gray-800'>
                          {booking._id?.substring(0, 8)}...
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-600'>
                          <div>
                            <p className='font-semibold'>{booking.userId?.fullName || 'N/A'}</p>
                            <p className='text-xs text-gray-500'>{booking.userId?.email || ''}</p>
                          </div>
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-600'>
                          {booking.vehicleId?.name || 'N/A'}
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-600'>
                          <div>
                            <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                            <p className='text-xs text-gray-500'>to {new Date(booking.endDate).toLocaleDateString()}</p>
                          </div>
                        </td>
                        <td className='px-4 py-4 text-sm font-semibold text-gray-800'>
                          ${booking.totalCost || '0'}
                        </td>
                        <td className='px-4 py-4 text-sm'>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : booking.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className='px-4 py-4 text-sm'>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                            className='px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none'
                          >
                            <option value='pending'>Pending</option>
                            <option value='confirmed'>Confirmed</option>
                            <option value='completed'>Completed</option>
                            <option value='cancelled'>Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className='text-center py-16 bg-white rounded-lg'>
              <i className='bx bx-inbox text-6xl text-gray-300 mb-4 block'></i>
              <p className='text-gray-600 text-lg'>No bookings found in this category</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Bookings
