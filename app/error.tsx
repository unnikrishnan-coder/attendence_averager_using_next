'use client'
import { useEffect } from 'react'

export default function Error({error,reset,}: {error: Error ,reset: () => void}) {

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='bg-black text-white w-full h-screen'>
      <h2>Something went wrong!</h2>
      <h2>{error.message}</h2>
      <button onClick={() => reset()} className='p-3 bg-blue-600 text-white rounded'>Try again</button>
    </div>
  )
}