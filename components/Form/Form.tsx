"use client"
import { auth } from "@/firebase";
import { setCookie } from "cookies-next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const LoginForm = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((val) => ({ ...val, [name]: value }));
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        signInWithEmailAndPassword(auth, data.email, data.password).then((res) => {
            router.push("/dashboard");
            setCookie("user_token", "user_logged_in", { maxAge: 60 * 60 * 24 * 4 });
            setCookie("user_id", res.user.uid, { maxAge: 60 * 60 * 24 * 4 });
        }).catch((err) => {
            toast(err.message, {
                position: 'top-right',
                type: "error"
            })
            setLoading(false);
        })
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)} method='POST' className='flex flex-col justify-evenly p-6 rounded bg-[--white-text]'>
            <h1 className='text-center text-[20px]'>Login</h1>
            <label htmlFor="email">Email</label>
            <input autoComplete='username' className='home-input' value={data.email} type="email" name='email' id='email' placeholder='Enter your email' required onChange={(e) => handleChange(e)} />
            <label htmlFor="password">Password</label>
            <input autoComplete="current-password" type="password" value={data.password} className='home-input' name='password' id='password' placeholder='Enter your password' required onChange={(e) => handleChange(e)} />
            <button type='submit' className='p-3 bg-[--black-bg] rounded text-[--white-text] mt-3'>{loading ? "Submitting..." : "Submit"}</button>
        </form>
    )
}

export default LoginForm;