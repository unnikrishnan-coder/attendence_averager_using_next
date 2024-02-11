import React from 'react'

const FallBackUI = () => {
  return (
    <div className='glass-div mt-4 mr-4 p-10'>
      <h2 className='text-white text-5xl pb-4'>Something went wrong</h2>
      <button className='glass-input'>
        Try again
      </button>
    </div>
  )
}

export default FallBackUI