"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '../components/AdminSidebar'
import { adminAuthService, vehicleService, bookingService } from '../lib/apiService'

const Dashboard = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])

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
    fetchDashboardData()
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch vehicles
      const vehiclesRes = await vehicleService.getAllVehicles()
      const bookingsRes = await bookingService.getAllBookings()

      setStats({
        totalVehicles: vehiclesRes.data?.length || 0,
        totalBookings: bookingsRes.data?.length || 0,
        totalUsers: 0,
        totalRevenue: 0,
      })

      setRecentBookings(bookingsRes.data?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
      <AdminSidebar currentPage='dashboard' onLogout={handleLogout} />

      <main className='flex-1 overflow-auto md:ml-0'>
        {/* Header */}
        <div className='bg-white shadow-sm p-6 md:p-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
          <p className='text-gray-600 mt-2'>Welcome to MotiveRide Admin Panel</p>
        </div>

        {/* Content */}
        <div className='p-6 md:p-8'>
          {loading ? (
            <div className='flex items-center justify-center h-64'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
                <p className='text-gray-600'>Loading dashboard data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                {/* Total Vehicles */}
                <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-gray-600 text-sm font-medium'>Total Vehicles</p>
                      <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.totalVehicles}</p>
                    </div>
                    <div className='bg-blue-100 rounded-lg p-4'>
                      <i className='bx bx-car text-2xl text-blue-600'></i>
                    </div>
                  </div>
                </div>

                {/* Total Bookings */}
                <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-gray-600 text-sm font-medium'>Total Bookings</p>
                      <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.totalBookings}</p>
                    </div>
                    <div className='bg-green-100 rounded-lg p-4'>
                      <i className='bx bx-calendar text-2xl text-green-600'></i>
                    </div>
                  </div>
                </div>

                {/* Total Users */}
                <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-gray-600 text-sm font-medium'>Total Users</p>
                      <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.totalUsers}</p>
                    </div>
                    <div className='bg-purple-100 rounded-lg p-4'>
                      <i className='bx bx-user text-2xl text-purple-600'></i>
                    </div>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-gray-600 text-sm font-medium'>Total Revenue</p>
                      <p className='text-3xl font-bold text-gray-800 mt-2'>${stats.totalRevenue}</p>
                    </div>
                    <div className='bg-orange-100 rounded-lg p-4'>
                      <i className='bx bx-dollar text-2xl text-orange-600'></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                  <i className='bx bx-history text-orange-500'></i>
                  Recent Bookings
                </h2>

                {recentBookings.length > 0 ? (
                  <div className='overflow-x-auto'>
                    <table className='w-full text-left'>
                      <thead>
                        <tr className='border-b border-gray-200'>
                          <th className='px-4 py-3 text-sm font-semibold text-gray-700'>Booking ID</th>
                          <th className='px-4 py-3 text-sm font-semibold text-gray-700'>Customer</th>
                          <th className='px-4 py-3 text-sm font-semibold text-gray-700'>Vehicle</th>
                          <th className='px-4 py-3 text-sm font-semibold text-gray-700'>Status</th>
                          <th className='px-4 py-3 text-sm font-semibold text-gray-700'>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking._id} className='border-b border-gray-100 hover:bg-gray-50'>
                            <td className='px-4 py-3 text-sm text-gray-800 font-medium'>
                              {booking._id?.substring(0, 8)}...
                            </td>
                            <td className='px-4 py-3 text-sm text-gray-600'>
                              {booking.userId?.fullName || 'N/A'}
                            </td>
                            <td className='px-4 py-3 text-sm text-gray-600'>
                              {booking.vehicleId?.name || 'N/A'}
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className='px-4 py-3 text-sm font-semibold text-gray-800'>
                              ${booking.totalCost || '0'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='text-center py-8 text-gray-500'>
                    No recent bookings found
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
