"use client"
import { db } from "@/firebase";
import { getCookie, hasCookie } from "cookies-next";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useState, ChangeEvent, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Sgpa = () => {
  const [average,setAverage] = useState("0");
  const [sgpaId,setSgpaId] = useState("");
  const [sgpaSet,setSgpaSet] = useState(false);
  const [sgpas,setSgpas] = useState({
    sem1:"",
    sem2:"",
    sem3:"",
    sem4:"",
    sem5:"",
    sem6:"",
    sem7:"",
    sem8:"",
  });

  const calcAverage = ()=>{
    let sems = 0;
    let total = 0;
    for (const [sem, mark] of Object.entries(sgpas)) {
      if(Number(mark)){
        total+=Number(mark);
        sems ++;
      }
    }
    if(sems==0){
      setAverage("");
      return;
    };
    let avg = total / sems;
    setAverage(avg.toFixed(2));
  }

  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    setSgpas((val)=>({...val,[e.target.name]:e.target.value}));
  }

  const saveToCloud = ()=>{
    if(hasCookie("user_id")){
      const uid = getCookie("user_id");
      if(sgpaSet){
        updateDoc(doc(db,"sgpas",sgpaId),{sgpas:sgpas}).then((res)=>{
          toast("Succesfully updated the marks in cloud",{type:"success",position:'top-right'});
        }).catch((err)=>{
          toast("Something went wrong",{type:"error",position:'top-right'});
        })
      }else{
        addDoc(collection(db,"sgpas"),{sgpas:sgpas,uid:uid}).then((res)=>{
          toast("Succesfully saved the marks to cloud",{type:"success",position:'top-right'});
        }).catch((err)=>{
          toast("Something went wrong",{type:"error",position:'top-right'});
        })
      }
    }
  }

  const resetSgpas = ()=>{
    setSgpas({sem1:"",
    sem2:"",
    sem3:"",
    sem4:"",
    sem5:"",
    sem6:"",
    sem7:"",
    sem8:""})
  }
  useEffect(()=>{
    calcAverage();
  },[sgpas]);

  useEffect(()=>{
    if(hasCookie("user_id")){
      const uid = getCookie("user_id");
      const q = query(collection(db,"sgpas"),where("uid","==",uid));
      getDocs(q).then((res) => {
        if(res.size==1){
          setSgpaSet(true);
          setSgpas(res.docs[0]?.data().sgpas);
          setSgpaId(res.docs[0].id);
        }
      }).catch((err) => {
        console.log("Something went wrong");
      });
    }
  },[])

  return (
    <>
      <div className="glass-div-front h-[50%] max-sm:h-full mt-4 mr-4 p-10">
        <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Average SGPA: {average}</h1>
        <div>
          <button type="button" className='glass-input mr-4' onClick={()=>{resetSgpas()}}>Clear All Marks </button>
          <button type="button" className='glass-input' onClick={()=>{saveToCloud()}}>Save To Cloud</button>
        </div>
        </div>
        <div id="semesters" className="flex w-full flex-wrap">
        <input type="number" className='glass-input mr-5 mt-5' name="sem1" value={sgpas.sem1} placeholder="S1" onChange={(e)=>handleChange(e)} max={10}/>
        <input type="number" className='glass-input mr-5 mt-5' name="sem2" value={sgpas.sem2} placeholder="S2" onChange={(e)=>handleChange(e)} max={10}/>
        <input type="number" className='glass-input mr-5 mt-5' name="sem3" value={sgpas.sem3} placeholder="S3" onChange={(e)=>handleChange(e)} max={10}/>
        <input type="number" className='glass-input mr-5 mt-5' name="sem4" value={sgpas.sem4} placeholder="S4" onChange={(e)=>handleChange(e)} max={10}/>
        <input type="number" className='glass-input mr-5 mt-5' name="sem5" value={sgpas.sem5} placeholder="S5" onChange={(e)=>handleChange(e)} max={10}/>
        <input type="number" className='glass-input mr-5 mt-5' name="sem6" value={sgpas.sem6} placeholder="S6" onChange={(e)=>handleChange(e)} max={10}/>
        <input type="number" className='glass-input mr-5 mt-5' name="sem7" value={sgpas.sem7} placeholder="S7" onChange={(e)=>handleChange(e)} max={10}/>
        <input type="number" className='glass-input mr-5 mt-5' name="sem8" value={sgpas.sem8} placeholder="S8" onChange={(e)=>handleChange(e)} max={10}/>
        </div>
      </div>
        <ToastContainer />
    </>
  )
}

export default Sgpa