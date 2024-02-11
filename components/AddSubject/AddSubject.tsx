import { useState } from "react";
import { doc, updateDoc,addDoc,collection} from "firebase/firestore";
import { hasCookie, getCookie } from "cookies-next";
import { Subject } from "@/types";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from "@/firebase";

const AddSubject = ({ title, nameVal, attendedVal, totalVal, update, id ,setSubjects}: { title: string, nameVal: string, attendedVal: string, totalVal: string, update?: boolean, id: string ,setSubjects?:Function}) => {

  const [name, setName] = useState(nameVal);
  const [attended, setAttended] = useState(attendedVal);
  const [total, setTotal] = useState(totalVal);
  const [loading, setLoading] = useState(false);

  const resetData = () => {
    setName("");
    setAttended("");
    setTotal("");
  }

  const validate = () : boolean=>{
    if(attended>total){
      return false
    }else{
      return true
    }
  };

  const updateSubject = ()=>{
    updateDoc(doc(db, "subjects", id), { name, attended, total }).then((res) => {
      setLoading(false);
      toast("Successfully updated course",{
        position:'top-right',
        type:"success"
      })
    }).catch((err) => {
      console.log(err);
      setLoading(false);
      toast("Error while updating course",{
        position:'top-right',
        type:"error"
      })
    })
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const validated = validate();
    if(!validated){
      toast("Attended can't be higher than total",{
        position:'top-right',
        type:"error"
      })
      setLoading(false);
      return
    }
    if (update === true) {
      updateSubject();
    } else {
      if (hasCookie("user_id")) {
        const uid = getCookie("user_id");
        addDoc(collection(db, "subjects"), {
          name: name,
          attended: attended,
          total: total,
          uid: uid
        }).then((res) => {
          setLoading(false);
          resetData();
          toast("Successfully created course",{
            position:'top-right',
            type:"success"
          })
          if(setSubjects){
            setSubjects((val:Array<Subject>)=>([...val,{id:res.id,name,attended,total,uid}]))
          }
        }).catch((err) => {
          console.log(err);
          setLoading(false);
          toast("Error while creating course",{
            position:'top-right',
            type:"error"
          })
        })
      } else {
        toast("Error in writing data",{
          position:'top-right',
          type:"error"
        })
      }
    }

  }
  return (
    <>
      <div className="flex flex-col glass-div-front mt-4 max-sm:mt-0 mb-4 mr-4 ml-0 max-sm:h-full max-sm:w-full">
        <h1 className='glass-h1 p-2'>{title}</h1>
        <form onSubmit={(e) => handleSubmit(e)} method='post' className='flex flex-col p-4'>
          <label htmlFor="name" className="mt-3">Course Name</label>
          <input type="text" className='glass-input' value={name} onChange={(e) => setName(e.target.value)} name="name" id="name" placeholder='Enter the course name' required/>
          <label htmlFor="total" className="mt-3">Total Hours</label>
          <input type="number" className='glass-input' value={total} onChange={(e) => setTotal(e.target.value)} name="total" id="total" placeholder='Enter the total course hours' required/>
          <label htmlFor="attended" className="mt-3">Attended Hours</label>
          <input type="number" name="attended" id="attended" value={attended} onChange={(e) => setAttended(e.target.value)} className='mb-3 glass-input' placeholder='Enter the attended hours' required/>
          <button type="submit" className='rounded text-white glass-div-front p-3 disabled:cursor-not-allowed' disabled={loading} >{loading ? "Loading..." : "Submit"}</button>
        </form>
      </div>
      <ToastContainer />
    </>
  )
}

export default AddSubject