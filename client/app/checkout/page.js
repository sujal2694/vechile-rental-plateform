"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart')
    }
  }, [cartItems, router])

  const total = getCartTotal()
  const subtotal = total
  const tax = Math.round(subtotal * 0.1)
  const finalTotal = subtotal + tax

  const handleCheckout = async () => {
    setIsProcessing(true)
    setError('')

    const validOrigin = typeof window !== 'undefined' && (window.location.protocol === 'http:' || window.location.protocol === 'https:')
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/bookings/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            vehicleId: item.id || item._id,
            quantity: item.quantity,
            rentalDays: item.rentalDays,
          })),
          successUrl: `${validOrigin}/success`,
          cancelUrl: `${validOrigin}/cart`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        setError(data.message || 'Failed to create checkout session')
        setIsProcessing(false)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className='flex items-center justify-center min-h-screen'>
          <p>Redirecting to cart...</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gray-50 py-8 md:py-12 px-4'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>Checkout</h1>
            <p className='text-gray-600'>Complete your vehicle rental booking</p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Order Summary */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Order Summary</h2>

              <div className='space-y-4 mb-6'>
                {cartItems.map((item, index) => {
                  const pricePerDay = parseInt(item.price.replace('$', '').replace('/day', ''))
                  const itemTotal = pricePerDay * item.rentalDays * item.quantity

                  return (
                    <div key={item.id || item._id || index} className='flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0'>
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                        className='w-16 h-16 object-cover rounded-lg'
                      />
                      <div className='flex-1'>
                        <h3 className='font-semibold text-gray-900'>{item.name}</h3>
                        <p className='text-sm text-gray-600'>{item.category}</p>
                        <p className='text-sm text-gray-600'>Qty: {item.quantity} × {item.rentalDays} days</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-bold text-orange-500'>${itemTotal}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className='border-t border-gray-200 pt-4 space-y-2'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Tax (10%):</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <div className='flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200'>
                  <span>Total:</span>
                  <span className='text-orange-500'>${finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Payment Information</h2>

              {error && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6'>
                  {error}
                </div>
              )}

              <div className='mb-6'>
                <p className='text-gray-600 mb-4'>
                  You will be redirected to Stripe's secure checkout page to complete your payment.
                </p>
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <i className='bx bx-shield-check text-blue-600 text-xl'></i>
                    <span className='font-semibold text-blue-900'>Secure Payment</span>
                  </div>
                  <p className='text-sm text-blue-700'>
                    Your payment information is processed securely by Stripe. We never store your card details.
                  </p>
                </div>
              </div>

              <div className='space-y-4'>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className='w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
                >
                  {isProcessing ? (
                    <>
                      <i className='bx bx-loader-alt bx-spin'></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className='bx bx-credit-card'></i>
                      Pay ${finalTotal.toLocaleString()} with Stripe
                    </>
                  )}
                </button>

                <Link href='/cart'>
                  <button className='w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-colors duration-200'>
                    Back to Cart
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkout