import React, { useState } from 'react'
import { faqs } from '../assets/assets'

const FAQ = () => {
  const [openId, setOpenId] = useState(null)

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className='bg-gray-50 py-16 md:py-24'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Frequently Asked <span className='text-orange-500'>Questions</span>
          </h2>
          <p className='text-gray-600 text-lg'>
            Find answers to common questions about our rental services
          </p>
        </div>

        {/* FAQ Items */}
        <div className='space-y-4'>
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className='bg-white rounded-lg shadow-md overflow-hidden'
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className='w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200'
              >
                <h3 className='text-lg font-semibold text-gray-900 text-left'>
                  {faq.question}
                </h3>
                <i className={`bx bx-chevron-down text-orange-500 text-2xl transition-transform duration-300 ${
                  openId === faq.id ? 'rotate-180' : ''
                }`}></i>
              </button>

              {/* Answer */}
              {openId === faq.id && (
                <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
                  <p className='text-gray-600 leading-relaxed'>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className='mt-12 text-center bg-orange-50 p-8 rounded-lg'>
          <h3 className='text-2xl font-bold text-gray-900 mb-2'>Still have questions?</h3>
          <p className='text-gray-600 mb-4'>
            Our customer support team is here to help you 24/7
          </p>
          <button className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200'>
            Contact Us
          </button>
        </div>
      </div>
    </section>
  )
}

export default FAQ
