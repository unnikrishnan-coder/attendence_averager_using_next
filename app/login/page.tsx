import Navbar from '@/components/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from '@/components/Form/Form';

const Login = () => {
  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center h-[90vh] bg-[--black-bg]'>
        <LoginForm />
      </div>
      <ToastContainer />
    </>
  )
}

export default Login