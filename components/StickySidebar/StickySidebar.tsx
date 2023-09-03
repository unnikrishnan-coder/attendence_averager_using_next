import { deleteCookie, hasCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const StickySidebar = () => {
    const [menu, setMenu] = useState(false);
    const router = useRouter();
    function handleLogout(): void {
        if (hasCookie("user_id")) {
            deleteCookie("user_id");
            deleteCookie("user_token");
        }
        router.push("/login");
    }
    function openMenu(): void {
        setMenu((val) => (!val));
    }

    return (
        <div>
            <div className=' z-30 w-screen fixed top-0 left-0 right-0 h-14 sm:hidden'>
                <button onClick={openMenu} className='relative top-4 left-2 z-40'>
                    <Image src="/hamburger.png" width="25" height="25" alt='menu' />
                </button>
                {
                    menu && (
                        <ul className='transition-all duration-1000 ease-in-out flex relative -top-8 items-center flex-col glass-div w-[60vw] z-30 justify-between min-h-screen'>
                            <Link href="/dashboard" onClick={()=>setMenu((val)=>!val)} className='mt-14 cursor-pointer rounded w-[80%] text-center glass-div-front p-3'>
                                <li >
                                    Home
                                </li>
                            </Link>
                            <div className='flex items-center flex-col w-full'>
                                {/* <Link href="/settings" onClick={()=>setMenu((val)=>!val)} className='mb-4 rounded w-[80%] text-center glass-div-front p-3'>
                                    <li className='text-black'>
                                        Settings
                                    </li>
                                </Link> */}
                                <li className='text-black mb-4 rounded glass-div-front w-[80%] text-center p-3'>
                                    <button type='button' onClick={() => handleLogout()}>Logout</button>
                                </li>
                            </div>
                        </ul>
                    )
                }
            </div>
        </div>
    )
}

export default StickySidebar