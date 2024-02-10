"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { hasCookie, deleteCookie } from "cookies-next";
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';

const SideBar = () => {
  const router = useRouter();
  function handleLogout(): void {
    signOut(auth).then(() => {
      if (hasCookie("user_id")) {
        deleteCookie("user_id");
        deleteCookie("user_token");
      }
      router.push("/login")
    }).catch((err) => {
      console.log(err.message);
    })
  }
  return (
    <div className='glass-div-front w-[20vw] m-4 max-height-screen-2rem max-sm:hidden'>
      <ul className='flex items-center flex-col justify-between h-full'>
        <li className='mt-4 cursor-pointer rounded w-[80%] text-center glass-div-front p-3'>
          <Link href="/dashboard">
            Home
          </Link>
        </li>
        <li className='mt-4 cursor-pointer rounded w-[80%] text-center glass-div-front p-3'>
          <Link href="/dashboard/sgpa" >
            Calculate SGPA average
          </Link>
        </li>
        <li className='flex items-center flex-col w-full'>
            {/* <Link href="/settings" className='mb-4 rounded w-[80%] text-center glass-div-front p-3'>
            <li className='text-black'>
              Settings
            </li>
          </Link> */}
            <div className='text-black mb-4 rounded glass-div-front w-[80%] text-center p-3'>
              <button type='button' onClick={() => handleLogout()}>Logout</button>
            </div>
        </li>
      </ul>
    </div>
  )
}

export default SideBar