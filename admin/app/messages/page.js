"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '../components/AdminSidebar'
import { adminAuthService, contactService } from '../lib/apiService.js'

const Messages = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)

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
    fetchMessages()
  }

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await contactService.getAllMessages()
      setMessages(res.data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const res = await contactService.deleteMessage(messageId)
      if (res.success) {
        fetchMessages()
        setSelectedMessage(null)
      }
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
      <AdminSidebar currentPage='messages' onLogout={handleLogout} />

      <main className='flex-1 overflow-auto md:ml-0'>
        {/* Header */}
        <div className='bg-white shadow-sm p-6 md:p-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Messages</h1>
          <p className='text-gray-600 mt-2'>View and manage customer inquiries</p>
        </div>

        {/* Content */}
        <div className='p-6 md:p-8'>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Messages List */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-lg shadow-md h-full max-h-[70vh] overflow-y-auto'>
                  {messages.length > 0 ? (
                    <div className='divide-y divide-gray-200'>
                      {messages.map((message) => (
                        <div
                          key={message._id}
                          onClick={() => setSelectedMessage(message)}
                          className={`p-4 cursor-pointer transition-colors duration-200 hover:bg-orange-50 ${
                            selectedMessage?._id === message._id ? 'bg-orange-100 border-l-4 border-orange-500' : ''
                          }`}
                        >
                          <h4 className='font-semibold text-gray-800 text-sm truncate'>
                            {message.fullName}
                          </h4>
                          <p className='text-xs text-gray-600 truncate'>{message.email}</p>
                          <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                            {message.message}
                          </p>
                          <p className='text-xs text-gray-400 mt-2'>
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='p-6 text-center text-gray-500'>
                      <i className='bx bx-inbox text-3xl mb-2 block'></i>
                      <p>No messages found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Detail */}
              <div className='lg:col-span-2'>
                {selectedMessage ? (
                  <div className='bg-white rounded-lg shadow-md p-6'>
                    <div className='mb-6'>
                      <div className='flex justify-between items-start mb-4'>
                        <div>
                          <h2 className='text-2xl font-bold text-gray-800'>
                            {selectedMessage.fullName}
                          </h2>
                          <p className='text-gray-600'>{selectedMessage.email}</p>
                          {selectedMessage.phone && (
                            <p className='text-gray-600'>{selectedMessage.phone}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(selectedMessage._id)}
                          className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold transition-colors flex items-center gap-2'
                        >
                          <i className='bx bx-trash text-lg'></i>
                          Delete
                        </button>
                      </div>

                      <div className='bg-gray-100 rounded-lg p-4'>
                        <p className='text-sm text-gray-600 mb-2'>Message Date</p>
                        <p className='text-lg font-semibold text-gray-800'>
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className='border-t border-gray-200 pt-6'>
                      <h3 className='text-lg font-bold text-gray-800 mb-4'>Message Content</h3>
                      <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                        <p className='text-gray-700 whitespace-pre-wrap'>
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='mt-6 flex gap-3'>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className='flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 font-semibold transition-colors flex items-center justify-center gap-2'
                      >
                        <i className='bx bx-envelope text-lg'></i>
                        Reply via Email
                      </a>
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className='flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-colors'
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='bg-white rounded-lg shadow-md p-12 text-center h-full flex flex-col items-center justify-center'>
                    <i className='bx bx-mail-open text-6xl text-gray-300 mb-4'></i>
                    <p className='text-gray-600 text-lg'>Select a message to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Messages
