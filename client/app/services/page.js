"use client";
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Car Rental",
      description: "Wide range of vehicles for personal and business use",
      icon: "bx-car",
      features: ["All vehicle types", "Flexible rental periods", "Comprehensive insurance"]
    },
    {
      id: 2,
      title: "Airport Transfer",
      description: "Convenient pickup and drop-off at major airports",
      icon: "bx-plane",
      features: ["Meet & greet service", "Flight tracking", "Professional drivers"]
    },
    {
      id: 3,
      title: "Corporate Rentals",
      description: "Customized solutions for businesses and corporate clients",
      icon: "bx-briefcase",
      features: ["Bulk discounts", "Dedicated account manager", "Flexible billing"]
    },
    {
      id: 4,
      title: "Long-term Rentals",
      description: "Affordable rates for extended rental periods",
      icon: "bx-calendar-alt",
      features: ["Monthly discounts", "Maintenance included", "Unlimited mileage"]
    },
    {
      id: 5,
      title: "Chauffeur Service",
      description: "Professional drivers for your transportation needs",
      icon: "bx-user-check",
      features: ["Experienced drivers", "Premium vehicles", "On-demand service"]
    },
    {
      id: 6,
      title: "Wedding & Events",
      description: "Luxury vehicles for special occasions",
      icon: "bx-heart-circle",
      features: ["Premium fleet", "Decoration available", "Special packages"]
    }
  ]

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-white'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-900 to-orange-500 text-white py-12 px-4'>
          <div className='max-w-7xl mx-auto'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>Our Services</h1>
            <p className='text-lg text-gray-100'>Comprehensive rental solutions tailored to your needs</p>
          </div>
        </div>

        {/* Services Grid */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {services.map((service) => (
              <div 
                key={service.id}
                className='bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2'
              >
                <div className='w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4'>
                  <i className={`bx ${service.icon} text-orange-500 text-3xl`}></i>
                </div>
                
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>{service.title}</h3>
                <p className='text-gray-600 mb-4'>{service.description}</p>
                
                <ul className='space-y-2 mb-6'>
                  {service.features.map((feature, idx) => (
                    <li key={idx} className='flex items-center gap-2 text-gray-600'>
                      <i className='bx bx-check text-orange-500'></i>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href='/contact'>
                  <button className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors duration-200'>
                    Learn More
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className='bg-gray-50 py-16 px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Ready to Get Started?</h2>
            <p className='text-lg text-gray-600 mb-8'>
              Choose the perfect service for your needs and book now for the best rates and service quality.
            </p>
            <Link href='/vehicles'>
              <button className='bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg'>
                Book a Service
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Services
