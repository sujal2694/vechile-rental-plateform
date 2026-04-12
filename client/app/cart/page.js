"use client";
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, updateRentalDays, getCartTotal, clearCart } = useCart()

  const total = getCartTotal()
  const subtotal = total
  const tax = Math.round(subtotal * 0.1)
  const finalTotal = subtotal + tax

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gray-50 py-8 md:py-12 px-4'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>Shopping Cart</h1>
            <p className='text-gray-600'>Review and manage your vehicle rentals</p>
          </div>

          {cartItems.length === 0 ? (
            // Empty Cart
            <div className='bg-white rounded-lg shadow-md p-8 text-center'>
              <div className='mb-4'>
                <i className='bx bx-cart text-6xl text-gray-300'></i>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Your cart is empty</h2>
              <p className='text-gray-600 mb-6'>Start adding vehicles to your cart to continue shopping</p>
              <Link href='/vehicles'>
                <button className='bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200'>
                  Browse Vehicles
                </button>
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
              {/* Cart Items */}
              <div className='lg:col-span-2'>
                <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                  {/* Cart Items List */}
                  <div className='divide-y divide-gray-200'>
                    {cartItems.map((item, index) => {
                      const pricePerDay = parseInt(item.price.replace('$', '').replace('/day', ''))
                      const itemTotal = pricePerDay * item.rentalDays * item.quantity

                      return (
                        <div key={item.id || item._id || index} className='p-4 md:p-6 hover:bg-gray-50 transition-colors'>
                          <div className='grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4'>
                            {/* Vehicle Image */}
                            <div className='col-span-1'>
                              <Image
                                src={`http://localhost:5000${item.image}`}
                                alt={item.name}
                                width={400}
                                height={128}
                                className='w-full h-32 object-cover rounded-lg'
                              />
                            </div>

                            {/* Vehicle Details */}
                            <div className='col-span-1 sm:col-span-2'>
                              <div className='mb-2'>
                                <h3 className='text-lg font-bold text-gray-900'>{item.name}</h3>
                                <p className='text-sm text-gray-600'>{item.category}</p>
                              </div>

                              <div className='grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4'>
                                <div className='flex items-center gap-1'>
                                  <i className='bx bx-user text-orange-500'></i>
                                  {item.seats} Seats
                                </div>
                                <div className='flex items-center gap-1'>
                                  <i className='bx bx-cog text-orange-500'></i>
                                  {item.transmission}
                                </div>
                                <div className='flex items-center gap-1'>
                                  <i className='bx bx-droplet text-orange-500'></i>
                                  {item.fuel}
                                </div>
                              </div>

                              {/* Rental Days Input */}
                              <div className='flex items-center gap-2 mb-4'>
                                <label className='text-sm font-semibold text-gray-700'>Rental Days:</label>
                                <input
                                  type='number'
                                  min='1'
                                  value={item.rentalDays}
                                  onChange={(e) => updateRentalDays(item.id, parseInt(e.target.value) || 1)}
                                  className='w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500'
                                />
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className='col-span-1 flex flex-col items-end justify-between'>
                              <div className='text-right mb-4'>
                                <p className='text-sm text-gray-600'>{item.price}</p>
                                <p className='text-sm text-gray-600'>× {item.rentalDays} days</p>
                                <p className='text-xl font-bold text-orange-500'>${itemTotal}</p>
                              </div>

                              {/* Quantity Controls */}
                              <div className='flex items-center gap-2 border border-gray-300 rounded-lg p-1'>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className='px-2 py-1 hover:bg-gray-200 rounded transition-colors'
                                >
                                  <i className='bx bx-minus'></i>
                                </button>
                                <span className='px-3 font-semibold text-gray-900'>{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className='px-2 py-1 hover:bg-gray-200 rounded transition-colors'
                                >
                                  <i className='bx bx-plus'></i>
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className='mt-3 text-red-500 hover:text-red-700 font-semibold text-sm transition-colors'
                              >
                                <i className='bx bx-trash mr-1'></i>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Clear Cart Button */}
                  <div className='p-4 md:p-6 bg-gray-50 border-t border-gray-200'>
                    <button
                      onClick={clearCart}
                      className='text-red-500 hover:text-red-700 font-semibold transition-colors text-sm'
                    >
                      <i className='bx bx-trash mr-2'></i>
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-lg shadow-md p-6 sticky top-24'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-6'>Order Summary</h2>

                  <div className='space-y-4 mb-6'>
                    <div className='flex justify-between text-gray-600'>
                      <span>Subtotal:</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between text-gray-600'>
                      <span>Tax (10%):</span>
                      <span>${tax.toLocaleString()}</span>
                    </div>
                    <div className='border-t border-gray-200 pt-4 flex justify-between text-xl font-bold text-gray-900'>
                      <span>Total:</span>
                      <span className='text-orange-500'>${finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link href='/checkout'>
                    <button className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mb-4'>
                      Proceed to Checkout
                    </button>
                  </Link>

                  <Link href='/vehicles'>
                    <button className='w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 rounded-lg transition-colors duration-200'>
                      Continue Shopping
                    </button>
                  </Link>

                  {/* Promo Code */}
                  <div className='mt-6 pt-6 border-t border-gray-200'>
                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                      Promo Code
                    </label>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        placeholder='Enter code'
                        className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm'
                      />
                      <button className='px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors'>
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Cart
