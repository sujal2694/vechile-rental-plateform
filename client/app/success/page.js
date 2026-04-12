"use client";
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

const Success = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [bookingDetails, setBookingDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (sessionId) {
      // Verify the payment and create bookings
      fetch(`http://localhost:5000/api/bookings/verify-checkout/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBookingDetails(data.bookings)
            clearCart() // Clear the cart after successful payment
          }
          setLoading(false)
        })
        .catch(err => {
          console.error('Error verifying checkout:', err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [searchParams, clearCart])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <i className='bx bx-loader-alt bx-spin text-4xl text-orange-500 mb-4'></i>
            <p className='text-gray-600'>Verifying your payment...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gray-50 py-8 md:py-12 px-4'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white rounded-lg shadow-md p-8 text-center'>
            <div className='mb-6'>
              <i className='bx bx-check-circle text-6xl text-green-500'></i>
            </div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Payment Successful!</h1>
            <p className='text-gray-600 mb-6'>
              Thank you for your booking. Your vehicle rental has been confirmed.
            </p>

            {bookingDetails && bookingDetails.length > 0 && (
              <div className='bg-gray-50 rounded-lg p-6 mb-6 text-left'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>Booking Details</h2>
                <div className='space-y-3'>
                  {bookingDetails.map((booking, index) => (
                    <div key={booking.id || index} className='border-b border-gray-200 pb-3 last:border-b-0'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='font-semibold text-gray-900'>{booking.vehicleName}</h3>
                          <p className='text-sm text-gray-600'>
                            {booking.rentalDays} days × ${Math.round(booking.totalCost / booking.rentalDays)}/day
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-bold text-orange-500'>${booking.totalCost}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='border-t border-gray-200 pt-3 mt-3'>
                  <div className='flex justify-between text-lg font-bold'>
                    <span>Total Paid:</span>
                    <span className='text-orange-500'>
                      ${bookingDetails.reduce((sum, booking) => sum + booking.totalCost, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className='space-y-4'>
              <Link href='/vehicles'>
                <button className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200'>
                  Rent More Vehicles
                </button>
              </Link>
              <Link href='/'>
                <button className='w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 rounded-lg transition-colors duration-200'>
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Success