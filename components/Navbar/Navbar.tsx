import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="h-[10vh] p-8 bg-[--black-bg] text-[--white-text]">
        <ul className='flex flex-row justify-between items-center h-full'>
            <li>
                <Link href="/">
                    Logo
                </Link>
            </li>
            <div className='flex justify-between'>
            <li className='mr-4'>
                <Link href="/login">Login</Link>
            </li>
            <li className='mr-4'>
                <Link href="/signup">SignUp</Link>
            </li>
            </div>
        </ul>
    </nav>
  )
}

export default Navbar