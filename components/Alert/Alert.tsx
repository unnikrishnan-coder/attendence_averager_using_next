import { AlertTypes } from '@/types'
import React, { useState } from 'react'

const Alert = ({ message, type }: { message: string, type?: AlertTypes }) => {
    const [show, setShow] = useState(true);

    return (
        <>
            {show && (
               type==AlertTypes.error ? (<div className='absolute top-[10%] right-[10%] p-3 rounded bg-red-800 text-white z-40 flex justify-between'>
                    <p>{message}</p><span className='ml-4'><button onClick={() => setShow(false)}>X</button></span>
                </div>)
                : (<div className='absolute top-[10%] right-[10%] p-3 rounded bg-green-600 text-white z-40 flex justify-between'>
                <p>{message}</p><span><button onClick={() => setShow(false)}>X</button></span>
            </div>)
            )
            }
        </>


    )
}

export default Alert