"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {hasCookie,deleteCookie} from "cookies-next";
import StickySidebar from '@/components/StickySidebar/StickySidebar';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase';

const DashBoard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  onAuthStateChanged(auth,(user)=>{
    if(user){
      console.log("logged in");
    }else{
      console.log("logged out");
    }
  })
  function handleLogout(): void {
    signOut(auth).then(()=>{
      if(hasCookie("user_id")){
        deleteCookie("user_id");
        deleteCookie("user_token");
      }
      router.push("/login")
    }).catch((err)=>{
      console.log(err.message);
    })
  }

  return (
    <div className='flex max-sm:flex-col max-sm:items-center max-sm:justify-center h-auto min-h-screen dashboard-bg'>
      <StickySidebar />
      <div className='glass-div-front w-[20vw] m-4 max-height-screen-2rem max-sm:hidden'>
        <ul className='flex items-center flex-col justify-between h-full'>
          <Link href="/dashboard" className='mt-4 cursor-pointer rounded w-[80%] text-center glass-div-front p-3'>
            <li >
              Home
            </li>
          </Link>
          <div className='flex items-center flex-col w-full'>
          {/* <Link href="/settings" className='mb-4 rounded w-[80%] text-center glass-div-front p-3'>
            <li className='text-black'>
              Settings
            </li>
          </Link> */}
          <li className='text-black mb-4 rounded glass-div-front w-[80%] text-center p-3'>
              <button type='button' onClick={()=>handleLogout()}>Logout</button>
          </li>
          </div>
        </ul>
      </div>
      <div className='w-[80vw] height-screen-2rem'>
        {children}
      </div>
    </div>
  )
}

export default DashBoard;