"use client";
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useCart } from '../context/CartContext'
import { authService } from '../lib/apiService'

const Navbar = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const { getCartCount } = useCart()

    useEffect(() => {
        setIsMounted(true)
        checkAuth()
    }, [])

    const checkAuth = () => {
        const token = authService.getToken()
        const userData = authService.getUser()
        setIsAuthenticated(!!token)
        setUser(userData)
    }

    const handleLogout = () => {
        authService.logout()
        setIsAuthenticated(false)
        setUser(null)
        router.push('/')
        setIsOpen(false)
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Vehicles', href: '/vehicles' },
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Contact', href: '/contact' }
    ]

    const cartCount = isMounted ? getCartCount() : 0

    return (
        <nav className='w-full bg-white shadow-sm sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8'>
                <div className='flex items-center justify-between h-14 sm:h-16 md:h-20'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center gap-1 sm:gap-2 cursor-pointer flex-shrink-0'>
                        <Image 
                            src={assets.logo_2} 
                            alt='Logo'
                            className='h-8 sm:h-10 md:h-12 w-auto'
                        />
                        <Image 
                            src={assets.logo_1} 
                            alt='Brand'
                            className='h-6 sm:h-8 md:h-10 w-auto hidden sm:block'
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-8'>
                        <ul className='flex items-center gap-6 lg:gap-8'>
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link 
                                        href={link.href}
                                        className='text-gray-700 hover:text-orange-500 font-medium text-sm transition-colors duration-200'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Section */}
                    <div className='flex items-center gap-2 sm:gap-3 md:gap-4'>
                        {/* Cart Button */}
                        <Link href='/cart'>
                            <button 
                                className='relative p-2 text-gray-700 hover:text-orange-500 transition-colors duration-200 cursor-pointer active:text-orange-700'
                                aria-label='Shopping cart'
                            >
                                <i className='bx bx-cart text-xl sm:text-xl md:text-2xl'></i>
                                {cartCount > 0 && (
                                    <span className='absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold'>
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </button>
                        </Link>

                        {/* Desktop Login/Profile Button */}
                        {isAuthenticated ? (
                            <div className='hidden md:flex items-center gap-2 lg:gap-3'>
                                <span className='text-xs lg:text-sm text-gray-700 hidden lg:block'>
                                    Hi, {user?.fullName?.split(' ')[0] || 'User'}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className='px-4 lg:px-6 py-1.5 lg:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors duration-200 text-xs lg:text-sm font-medium shadow-md hover:shadow-lg'
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href='/login'>
                                <button 
                                    className='hidden md:block px-4 lg:px-6 py-1.5 lg:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-colors duration-200 text-xs lg:text-sm font-medium shadow-md hover:shadow-lg'
                                >
                                    Log In / Sign Up
                                </button>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={toggleMenu}
                            className='md:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors duration-200 active:text-orange-700'
                            aria-label='Toggle menu'
                        >
                            <i className={`bx bx-menu text-2xl ${isOpen ? 'hidden' : 'block'}`}></i>
                            <i className={`bx bx-x text-2xl ${isOpen ? 'block' : 'hidden'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className='md:hidden pb-6 border-t border-gray-200 bg-gray-50 animate-slideDown'>
                        <ul className='flex flex-col gap-2 pt-4 px-2'>
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link 
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className='block px-4 py-3 sm:py-4 text-gray-700 hover:bg-white hover:text-orange-500 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base border border-transparent hover:border-orange-200'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        
                        {/* Authentication Section in Mobile Menu */}
                        <div className='px-2 pt-4 border-t border-gray-200 mt-4'>
                            {isAuthenticated ? (
                                <>
                                    <div className='px-4 py-3 bg-white rounded-lg mb-3 border border-gray-200'>
                                        <p className='text-xs sm:text-sm text-gray-600'>Logged in as</p>
                                        <p className='text-sm sm:text-base font-semibold text-gray-800'>
                                            {user?.fullName || 'User'}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className='w-full px-4 py-3 sm:py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors duration-200 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg'
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link href='/login' className='block' onClick={() => setIsOpen(false)}>
                                    <button 
                                        className='w-full px-4 py-3 sm:py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-colors duration-200 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg'
                                    >
                                        Log In / Sign Up
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
