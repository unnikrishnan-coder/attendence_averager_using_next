"use client"
import Link from 'next/link'
import { useEffect,useState } from 'react';
import {getFirestore,collection,getDocs,query,DocumentData,where} from 'firebase/firestore';
import {app} from '@/firebase';
import { Subject } from '@/types';
import AddSubject from '@/components/AddSubject/AddSubject';
import {getCookie,hasCookie} from 'cookies-next';

const db = getFirestore(app);

const Dashboard = () => {
  const [subjects,setSubjects] = useState<Array<Subject | DocumentData>>([]);
  useEffect(()=>{
    if(hasCookie("user_id")){
      const uid = getCookie("user_id");
      const q = query(collection(db,"subjects"),where("uid","==",uid));
    getDocs(q).then((val)=>{
      let data : Array<DocumentData | Subject> = [];
      val.forEach((res)=>{
        data.push({...res.data(),id:res.id});
      })
      setSubjects(data);
    }).catch((err)=>{
      console.log(err);
    })
    }else{
      console.log("Error in reading cookie");
    }
    
  },[]);
  const getAvg = (val: Subject | DocumentData)=>{
    let avg = val.attended / val.total;
    avg = avg * 100;
    return avg.toFixed(2);
  }
  return (
    <>
      <AddSubject title="Add New Course" db={db} nameVal="" attendedVal="" totalVal="" id="" setSubjects={setSubjects}/>
      <div className='mt-4 mb-4 mr-4 ml-0 glass-div-front max-sm:w-full'>
      <h1 className='glass-h1 p-2'>All Courses</h1>
      <div className='flex max-sm:flex-col flex-wrap mt-4  justify-evenly items-center '>
        {
          subjects.length > 0 && subjects?.map((val)=>(
            <Link key={val.id} href={`/dashboard/home/${val.id}`} className='glass-div-front max-sm:w-[90%] cursor-pointer w-[20%] p-4 mr-10 mb-10 max-sm:mr-0'>
            <div className='relative'>
              <h1>{val.name}</h1>
              <h1>Average Attendence: {getAvg(val)}%</h1>
              <div className='flex justify-between'>
              <span>Total: {val.total}</span>
              <span>Attended: {val.attended}</span>
              </div>
            </div>
            </Link>
            
          ))
        }
      </div>
      </div>
    </>
  )
}

export default Dashboard;