"use client"
import { app } from "@/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const SignupForm = () => {
    const [data,setData] = useState({email:"",pass1:"",pass2:""});
  const router = useRouter();
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
    const name = event.target.name;
    const value = event.target.value;

    setData((val)=>({...val,[name]:value}));
  }

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(data.pass1===data.pass2){
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth,data.email,data.pass1).then((res)=>{
        toast("Account created successfully",{
          position:'top-right',
          type:"success"
        })
        router.push("/login")
      }).catch((err)=>{
        toast(err.message,{
          position:'top-right',
          type:"error"
        })
      })
    }else{
      toast("Passwords dont match",{
        position:'top-right',
        type:"error"
      })
    }
  }
  return (
    <form onSubmit={(e)=>handleSubmit(e)} method='POST' className='flex flex-col justify-evenly  p-6 rounded bg-[--white-text]'>
        <h1 className='text-center text-[20px]'>Signup</h1>
        <label htmlFor="email">Email</label>
        <input type="email" autoComplete='email' onChange={(e)=>handleChange(e)} value={data.email} className='home-input'  name='email' id='email' placeholder='Enter your email' required/>
        <label htmlFor="pass1">Password</label>
        <input type="password" autoComplete='new-password' onChange={(e)=>handleChange(e)} value={data.pass1} className='home-input'  name='pass1' id='pass1' placeholder='Enter your password' required/>
        <label htmlFor="pass2">Confirm Password</label>
        <input type="password" autoComplete='new-password' onChange={(e)=>handleChange(e)} value={data.pass2} className='home-input' name='pass2' id='pass2' placeholder='Re Enter your password' required/>
        <button type='submit' className='p-3 bg-[--black-bg] rounded text-[--white-text] mt-3'>Submit</button>
      </form>
  )
}

export default SignupForm