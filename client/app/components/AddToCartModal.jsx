"use client";
import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_51234567890')

const PaymentForm = ({ vehicle, rentalDays, totalPrice, onClose, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe not loaded')
      return
    }

    setLoading(true)
    setError('')

    try {
      const intentResponse = await fetch('http://localhost:5000/api/bookings/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100),
          vehicleId: vehicle._id || vehicle.id,
          rentalDays,
        })
      })

      const intentData = await intentResponse.json()

      if (!intentData.success) {
        setError(intentData.message || 'Failed to create payment intent')
        setLoading(false)
        return
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        setError('Card details are not entered')
        setLoading(false)
        return
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer',
          },
        },
      })

      if (stripeError) {
        setError(stripeError.message)
        setLoading(false)
        return
      }

      if (paymentIntent.status !== 'succeeded') {
        setError('Payment was not completed.')
        setLoading(false)
        return
      }

      const confirmResponse = await fetch('http://localhost:5000/api/bookings/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          vehicleId: vehicle._id || vehicle.id,
          rentalDays,
          totalCost: totalPrice,
        }),
      })

      const confirmData = await confirmResponse.json()

      if (!confirmData.success) {
        setError(confirmData.message || 'Payment confirmation failed')
        setLoading(false)
        return
      }

      addToCart(vehicle, rentalDays)
      onSuccess()
      alert(`Payment successful! ${vehicle.name} added to cart for ${rentalDays} day(s)`)
      onClose()
    } catch (err) {
      setError('Payment error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePayment} className='space-y-4'>
      <div className='bg-gray-50 p-4 rounded-lg'>
        <label className='block text-sm font-semibold text-gray-900 mb-2'>
          Card Details
        </label>
        <div className='bg-white p-3 border border-gray-300 rounded-lg'>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
          {error}
        </div>
      )}

      <button
        type='submit'
        disabled={loading || !stripe}
        className='w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors'
      >
        {loading ? 'Processing...' : `Pay $${totalPrice}`}
      </button>
    </form>
  )
}

const AddToCartModalContent = ({ vehicle, isOpen, onClose }) => {
  const [rentalDays, setRentalDays] = useState(1)
  const [paymentStep, setPaymentStep] = useState(false)
  const { addToCart } = useCart()

  if (!isOpen) return null

  const pricePerDay = parseInt(vehicle.price.replace('$', '').replace('/day', ''))
  const totalPrice = pricePerDay * rentalDays

  const handleAddToCartOnly = () => {
    addToCart(vehicle, rentalDays)
    onClose()
    alert(`${vehicle.name} added to cart for ${rentalDays} day(s)!`)
  }

  const handleCheckout = () => {
    setPaymentStep(true)
  }

  const handleReset = () => {
    setPaymentStep(false)
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-md w-full p-6 md:p-8'>
        <button
          onClick={onClose}
          className='float-right text-gray-500 hover:text-gray-700 text-2xl'
        >
          <i className='bx bx-x'></i>
        </button>

        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          {paymentStep ? 'Complete Payment' : `Book ${vehicle.name}`}
        </h2>

        {!paymentStep ? (
          <>
            <img
              src={vehicle.image ? `http://localhost:5000${vehicle.image}` : '/placeholder-car.jpg'}
              alt={vehicle.name}
              className='w-full h-40 object-cover rounded-lg mb-4'
            />

            <div className='bg-gray-50 p-4 rounded-lg mb-4'>
              <div className='grid grid-cols-2 gap-2 text-sm mb-3'>
                <div>
                  <p className='text-gray-600'>Category</p>
                  <p className='font-semibold text-gray-900'>{vehicle.category}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Price/Day</p>
                  <p className='font-semibold text-gray-900'>{vehicle.price}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Seats</p>
                  <p className='font-semibold text-gray-900'>{vehicle.seats}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Transmission</p>
                  <p className='font-semibold text-gray-900'>{vehicle.transmission}</p>
                </div>
              </div>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-semibold text-gray-900 mb-2'>
                Number of Days
              </label>
              <input
                type='number'
                min='1'
                value={rentalDays}
                onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
              />
            </div>

            <div className='bg-orange-50 p-4 rounded-lg mb-6'>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>${pricePerDay} × {rentalDays} days</span>
                <span className='font-semibold text-gray-900'>${totalPrice}</span>
              </div>
              <div className='border-t border-orange-200 pt-2 flex justify-between'>
                <span className='font-semibold text-gray-900'>Total:</span>
                <span className='text-xl font-bold text-orange-500'>${totalPrice}</span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <button
                onClick={onClose}
                className='px-4 py-2 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors'
              >
                Checkout
              </button>
            </div>

            <button
              onClick={handleAddToCartOnly}
              className='w-full mt-3 px-4 py-2 border border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-colors'
            >
              Add to Cart (Pay Later)
            </button>
          </>
        ) : (
          <>
            <PaymentForm
              vehicle={vehicle}
              rentalDays={rentalDays}
              totalPrice={totalPrice}
              onClose={onClose}
              onSuccess={handleReset}
            />
            <button
              onClick={handleReset}
              className='w-full mt-3 px-4 py-2 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const AddToCartModal = ({ vehicle, isOpen, onClose }) => {
  return (
    <Elements stripe={stripePromise}>
      <AddToCartModalContent vehicle={vehicle} isOpen={isOpen} onClose={onClose} />
    </Elements>
  )
}

export default AddToCartModal;
