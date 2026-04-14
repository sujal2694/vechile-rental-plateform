import React, { Suspense } from 'react'
import SuccessContent from '../components/SuccessContent'

const Suceess = () => {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen'>
          <p>Loading payment details....</p>
        </div>
      }>
      <SuccessContent />
    </Suspense>
  )
}

export default Suceess
