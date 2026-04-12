"use client";
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminAuthService } from '../lib/apiService'

const AdminSidebar = ({ currentPage, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(adminAuthService.getUser())

  const menuItems = [
    { name: 'Dashboard', icon: 'bx bx-home', href: '/dashboard', id: 'dashboard' },
    { name: 'Vehicles', icon: 'bx bx-car', href: '/vehicles', id: 'vehicles' },
    { name: 'Bookings', icon: 'bx bx-calendar', href: '/bookings', id: 'bookings' },
    { name: 'Messages', icon: 'bx bx-envelope', href: '/messages', id: 'messages' },
    { name: 'Users', icon: 'bx bx-user', href: '/users', id: 'users' },
  ]

  const handleLogout = () => {
    onLogout()
  }

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='md:hidden fixed top-4 left-4 z-40 p-2 text-orange-500 bg-white rounded-lg shadow-lg hover:shadow-xl'
      >
        <i className={`bx ${isOpen ? 'bx-x' : 'bx-menu'} text-2xl`}></i>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/20 md:hidden z-20'
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl transform transition-transform duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className='p-6 border-b border-gray-700'>
          <h1 className='text-2xl font-bold text-orange-500'>MotiveRide</h1>
          <p className='text-sm text-gray-400'>Admin Panel</p>
        </div>

        {/* Admin Info */}
        <div className='p-4 border-b border-gray-700 bg-gray-800'>
          <p className='text-xs text-gray-400 mb-1'>Logged in as</p>
          <p className='text-sm font-semibold text-white truncate'>{user?.fullName || 'Admin'}</p>
        </div>

        {/* Navigation */}
        <nav className='p-4'>
          <ul className='space-y-2'>
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <i className={`${item.icon} text-xl`}></i>
                  <span className='font-medium'>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg'
          >
            <i className='bx bx-log-out text-xl'></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
