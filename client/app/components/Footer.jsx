import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { assets } from '../assets/assets'

const Footer = () => {
  return ( 
    <footer className='bg-white text-gray-600 pt-12 md:pt-16 pb-8 border-t border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 md:mb-12'>
          <div className='col-span-1'>
            <Link href='/' className='inline-flex items-center gap-2 mb-4 cursor-pointer'>
              <Image 
                src={assets.logo_2} 
                alt='MotiveRide'
                className='h-8 w-auto sm:h-10'
              />
              <Image 
                src={assets.logo_1} 
                alt='MotiveRide'
                className='h-6 w-auto sm:h-8 hidden xs:block'
              />
            </Link>
            <p className='text-gray-600 text-sm sm:text-base mb-4'>
              Your trusted partner for premium vehicle rentals at affordable prices.
            </p>
            <div className='flex gap-3 sm:gap-4'>
              <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='text-gray-600 hover:text-orange-500 transition-colors text-lg sm:text-xl'>
                <i className='bx bxl-facebook'></i>
              </a>
              <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' className='text-gray-600 hover:text-orange-500 transition-colors text-lg sm:text-xl'>
                <i className='bx bxl-twitter'></i>
              </a>
              <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='text-gray-600 hover:text-orange-500 transition-colors text-lg sm:text-xl'>
                <i className='bx bxl-instagram'></i>
              </a>
              <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer' className='text-gray-600 hover:text-orange-500 transition-colors text-lg sm:text-xl'>
                <i className='bx bxl-linkedin'></i>
              </a>
            </div>
          </div>

          <div className='col-span-1'>
            <h3 className='text-gray-900 font-semibold text-base sm:text-lg mb-3 sm:mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li><Link href='/' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base'>Home</Link></li>
              <li><Link href='/vehicles' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base'>Vehicles</Link></li>
              <li><Link href='/services' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base'>Services</Link></li>
              <li><Link href='/about' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base'>About Us</Link></li>
              <li><a href='#blog' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base'>Blog</a></li>
            </ul>
          </div>

          <div className='col-span-1'>
            <h3 className='text-gray-900 font-semibold text-base sm:text-lg mb-3 sm:mb-4'>Services</h3>
            <ul className='space-y-2'>
              <li><a href='#car-rental' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base'>Car Rental</a></li>
              <li><a href='#corporate' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base'>Corporate Rentals</a></li>
              <li><a href='#long-term' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base'>Long-term Deals</a></li>
              <li><a href='#airport' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base'>Airport Pickup</a></li>
              <li><Link href='/contact' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base'>24/7 Support</Link></li>
            </ul>
          </div>

          <div className='col-span-1'>
            <h3 className='text-gray-900 font-semibold text-base sm:text-lg mb-3 sm:mb-4'>Contact</h3>
            <ul className='space-y-2 sm:space-y-3'>
              <li className='flex gap-2 items-start sm:items-center'>
                <i className='bx bx-phone text-orange-500 flex-shrink-0 mt-0.5 sm:mt-0'></i>
                <span className='text-gray-600 text-sm sm:text-base break-all'>+1 (123) 456-7890</span>
              </li>
              <li className='flex gap-2 items-start sm:items-center'>
                <i className='bx bx-envelope text-orange-500 flex-shrink-0 mt-0.5 sm:mt-0'></i>
                <a href='mailto:support@motiveride.com' className='text-gray-600 hover:text-orange-500 transition-colors text-sm sm:text-base break-all'>
                  support@motiveride.com
                </a>
              </li>
              <li className='flex gap-2 items-start'>
                <i className='bx bx-map text-orange-500 flex-shrink-0 mt-0.5'></i>
                <span className='text-gray-600 text-sm sm:text-base'>123 Main Street, City</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className='border-gray-200 my-6 sm:my-8' />

        <div className='py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-center gap-4'>
          <p className='text-gray-600 text-center sm:text-left text-xs sm:text-sm order-2 sm:order-1'>
            &copy; 2024 MotiveRide. All rights reserved.
          </p>
          <div className='flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center sm:justify-end order-1 sm:order-2'>
            <a href='#privacy' className='text-gray-600 hover:text-orange-500 transition-colors text-xs sm:text-sm whitespace-nowrap'>
              Privacy Policy
            </a>
            <a href='#terms' className='text-gray-600 hover:text-orange-500 transition-colors text-xs sm:text-sm whitespace-nowrap'>
              Terms & Conditions
            </a>
            <a href='#cookies' className='text-gray-600 hover:text-orange-500 transition-colors text-xs sm:text-sm whitespace-nowrap'>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
