"use client"
import Navbar from '@/components/Navbar/Navbar'
import {  FormEvent, useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../../firebase';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

const Login = () => {
  const [data,setData] = useState({email:"",password:""});
  const router = useRouter();

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const name = e.target.name;
    const value = e.target.value;

    setData((val)=>({...val,[name]:value}));
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const email = data.email;
    const password = data.password;
  
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth,email,password).then((res)=>{
      setCookie("user_token","user_logged_in",{maxAge:60*60*24*4});
      setCookie("user_id",res.user.uid,{maxAge:60*60*24*4});
      router.push("/dashboard")
    }).catch((err)=>{
      console.log(err);
    })
  }

  return (
    <>
    <Navbar />
      <div className='flex items-center justify-center h-[90vh] bg-[--black-bg]'>
      <form onSubmit={(e)=>handleSubmit(e)} method='POST' className='flex flex-col justify-evenly p-6 rounded bg-[--white-text]'>
        <h1 className='text-center text-[20px]'>Login</h1>
        <label htmlFor="email">Email</label>
        <input autoComplete='username' className='home-input' value={data.email} type="email" name='email' id='email' placeholder='Enter your email' required onChange={(e)=>handleChange(e)}/>
        <label htmlFor="password">Password</label>
        <input autoComplete="current-password" type="password" value={data.password} className='home-input' name='password' id='password' placeholder='Enter your password' required onChange={(e)=>handleChange(e)}/>
        <button type='submit' className='p-3 bg-[--black-bg] rounded text-[--white-text] mt-3'>Submit</button>
      </form>
    </div>
    </>
  )
}

export default Login