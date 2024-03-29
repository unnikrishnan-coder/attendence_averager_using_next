"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, DocumentData, where } from 'firebase/firestore';
import { app } from '@/firebase';
import { Subject } from '@/types';
import AddSubject from '@/components/AddSubject/AddSubject';
import { getCookie, hasCookie } from 'cookies-next';
import Image from 'next/image';
import Sync from '@/components/Sync/Sync';
import DeletePopUp from '@/components/DeletePopUp';

const db = getFirestore(app);

const Dashboard = () => {
  // syncOn state to constrol the display of lms sync popup form 
  const [syncOn, setSyncOn] = useState(false);
  // to control the delete popup open state
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  // onDeleteId state variable to track the id of current delete popup 
  const [onDeleteId, setOnDeleteId] = useState("");
  const [subjects, setSubjects] = useState<Array<Subject | DocumentData>>([]);
  useEffect(() => {
    if (hasCookie("user_id")) {
      const uid = getCookie("user_id");
      const q = query(collection(db, "subjects"), where("uid", "==", uid));
      getDocs(q).then((val) => {
        let data: Array<DocumentData | Subject> = [];
        val.forEach((res) => {
          data.push({ ...res.data(), id: res.id });
        })
        setSubjects(data);
      }).catch((err) => {
        console.log(err);
      })
    } else {
      console.log("Error in reading cookie");
    }

  }, []);
  const getAvg = (val: Subject | DocumentData) => {
    let avg = val.attended / val.total;
    avg = avg * 100;
    return avg.toFixed(2);
  }
  return (
    <>
      <AddSubject title="Add New Course" nameVal="" attendedVal={0} totalVal={0} id="" setSubjects={setSubjects} />
      {
        syncOn ? <Sync setSyncOn={setSyncOn} setSubjects={setSubjects} /> : null
      }
      <div className='mt-4 mb-4 mr-4 ml-0 glass-div-front max-sm:w-full'>
        <div className='flex'>
          <h1 className='glass-h1 p-2 flex-grow'>All Courses</h1>
          <div className='glass-div-front flex items-center text-lg'>
            <button
              type="button"
              className='rounded-3xl text-center text-white border-green-400 border-2 bg-green-400 p-2'
              onClick={() => setSyncOn((val) => !val)}
            >
              Sync With LMS
            </button>
          </div>
        </div>
        <div className='flex max-sm:flex-col flex-wrap mt-4  justify-evenly items-center '>
        {openDeletePopUp && <DeletePopUp id={onDeleteId} setPopup={setOpenDeletePopUp} setSubjects={setSubjects}/>}
          {
            subjects.length > 0 && subjects?.map((val) => (
              <div key={val.id} className='glass-div-front max-sm:w-[90%] cursor-pointer w-[20%] p-4 mr-10 mb-10 max-sm:mr-0'>
                <div className='relative'>
                  <button className="rounded cursor-pointer z-10 glass-div-front text-white p-2 float-right"
                  onClick={() => {setOpenDeletePopUp((val) => !val);setOnDeleteId(val.id)}}>
                    <Image src="/delete.png" alt="edit" height="20" width="20" />
                  </button>
                  
                  <Link href={`/dashboard/home/${val.id}`} >
                    <h1>{val.name}</h1>
                    <h1>Average Attendence: {getAvg(val)}%</h1>
                    <div className='flex justify-between'>
                      <span>Total: {val.total}</span>
                      <span>Attended: {val.attended}</span>
                    </div>
                  </Link>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Dashboard;