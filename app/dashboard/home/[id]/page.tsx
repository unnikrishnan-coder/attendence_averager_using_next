"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { Subject } from "@/types";
import Image from "next/image";
import DeletePopUp from "@/components/DeletePopUp";
import EditCoursePopUp from "@/components/PopUps/EditCoursePopUp";
import { toast } from "react-toastify";
import { db } from "@/firebase";
import AttendenceDisplay from "@/components/AttendenceDisplay/AttendenceDisplay";

const UpdateAttendence = ({ params: { id } }: { params: { id: string } }) => {
  const [subject, setSubject] = useState<Subject | DocumentData>({id:id,attended:1,name:"Error",total:1,uid:""});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  const [average,setAverage] = useState<number | undefined>();

  const handleAttend = () => {
    if(!subject.attended && !subject.total) return;
    setSubject((sub) => ({ ...sub, attended: sub.attended + 1 , total: sub.total + 1 }));
  };
  const handleAbsent = () => {
    if(!subject.attended && !subject.total) return;
    setSubject((sub) => ({ ...sub, total: sub.total + 1 }));
  };

  // useEffect(() => {
  //   const docRef = doc(db, "subjects", id);
  //   getDoc(docRef)
  //     .then((val) => {
  //       if (val.exists()) {
  //         setSubject(val.data());
  //       } else {
  //         toast("No such document exists!",{
  //           type:"error",
  //           position:"top-right"
  //         })
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [id]);

  useEffect(()=>{
    let val = subject.attended / subject.total;
    val = val * 100;
    let stVal = val.toFixed(2);
    setAverage(Number(stVal));
  },[subject])

  if(!subject.name){
    return (
      <div className="glass-div mt-4 mb-4 max-sm:mr-0 mr-4 ml-0 height-full-2rem max-sm:h-[calc(100vh-3rem)]">
        <h1 className="text-red-600 text-center">There was an error while fetching the data!</h1>
      </div>
    )
  }

  return (
    <div className="glass-div mt-4 mb-4 max-sm:mr-0 mr-4 ml-0 height-full-2rem max-sm:h-[calc(100vh-3rem)]">
      <button
        className="rounded cursor-pointer z-10 glass-div-front text-white absolute p-3 top-20 right-5"
        onClick={() => setOpenPopUp((val) => !val)}
      >
        <Image src="/edit.png" alt="edit" height="25" width="25" />
      </button>
      <button
      onClick={() => setOpenDeletePopUp((val) => !val)}
        className="rounded cursor-pointer z-10 glass-div-front text-white absolute p-3 top-36 right-5"
      >
        <Image src="/delete.png" alt="edit" height="25" width="25" />
      </button>

      {openDeletePopUp && <DeletePopUp id={id} setPopup={setOpenDeletePopUp}/>}

      {openPopUp && <EditCoursePopUp name={subject.name} attended={subject.attended} total={subject.total} id={id} setOpenPopUp={setOpenPopUp}/> }

      <div className="glass-div-front h-[50%] max-sm:h-full">
        <h1 className="glass-h1">{subject.name?String(subject.name).toUpperCase():"Error"}</h1>
        <div className="flex items-center justify-evenly w-full h-full max-sm:relative">
          <button
            className="rounded cursor-pointer text-white glass-div-front p-3  max-sm:absolute max-sm:left-5 max-sm:z-40 max-sm:top-[65%]"
            onClick={() => handleAbsent()}
          >
            <span className="max-sm:hidden">Was Absent In a Class</span><Image src={"/minus.png"} height={25} width={25} alt="Add" className="sm:hidden"/>
          </button>
          <AttendenceDisplay attended={subject.attended} total={subject.total} average={average}/>
          <button
            className="rounded cursor-pointer text-white glass-div-front p-3 max-sm:ml-1 max-sm:absolute max-sm:right-5 max-sm:z-40 max-sm:top-[65%]"
            onClick={() => handleAttend()}
          >
            <span className="max-sm:hidden">Attended A Class</span><Image src={"/add.png"} height={25} width={25} alt="Add" className="sm:hidden"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAttendence;
