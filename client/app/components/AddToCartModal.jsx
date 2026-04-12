"use client";
import React, { useState } from 'react'
import { useCart } from '../context/CartContext'

const AddToCartModalContent = ({ vehicle, isOpen, onClose }) => {
  const [rentalDays, setRentalDays] = useState(1)
  const { addToCart } = useCart()

  if (!isOpen) return null

  const pricePerDay = parseInt(vehicle.price.replace('$', '').replace('/day', ''))
  const totalPrice = pricePerDay * rentalDays

  const handleAddToCart = () => {
    addToCart(vehicle, rentalDays)
    onClose()
    alert(`${vehicle.name} added to cart for ${rentalDays} day(s)!`)
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
          Book {vehicle.name}
        </h2>

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
            onClick={handleAddToCart}
            className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors'
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

const AddToCartModal = ({ vehicle, isOpen, onClose }) => {
  return (
    <AddToCartModalContent vehicle={vehicle} isOpen={isOpen} onClose={onClose} />
  )
}

export default AddToCartModal;
