import Navbar from '@/components/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignupForm from '@/components/Form/SignupForm';

const Signup = () => {
  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center h-[90vh] bg-[--black-bg]'>
        <SignupForm />
      </div>
      <ToastContainer />
    </>
  )
}

export default Signup