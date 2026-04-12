"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '../components/AdminSidebar'
import { adminAuthService } from '../lib/apiService'

const Users = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

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
    fetchUsers()
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = adminAuthService.getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
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
      <AdminSidebar currentPage='users' onLogout={handleLogout} />

      <main className='flex-1 overflow-auto md:ml-0'>
        {/* Header */}
        <div className='bg-white shadow-sm p-6 md:p-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Users</h1>
          <p className='text-gray-600 mt-2'>Manage registered users</p>
        </div>

        {/* Content */}
        <div className='p-6 md:p-8'>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
            </div>
          ) : users.length > 0 ? (
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Name</th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Email</th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Role</th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Joined</th>
                      <th className='px-4 py-4 text-left text-sm font-semibold text-gray-700'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className='border-b border-gray-100 hover:bg-gray-50 transition-colors'>
                        <td className='px-4 py-4 text-sm font-medium text-gray-800'>
                          {user.fullName}
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-600'>
                          {user.email}
                        </td>
                        <td className='px-4 py-4 text-sm'>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-600'>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className='px-4 py-4 text-sm'>
                          <span className='px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800'>
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className='text-center py-16 bg-white rounded-lg'>
              <i className='bx bx-user text-6xl text-gray-300 mb-4 block'></i>
              <p className='text-gray-600 text-lg'>No users found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Users
