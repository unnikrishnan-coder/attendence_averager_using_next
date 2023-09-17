"use client";
import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, DocumentData } from "firebase/firestore";
import { app } from "@/firebase";
import { Subject } from "@/types";
import AddSubject from "@/components/AddSubject/AddSubject";
import Image from "next/image";
import DeletePopUp from "@/components/DeletePopUp";

const UpdateAttendence = ({ params: { id } }: { params: { id: string } }) => {
  const db = getFirestore(app);
  const [subject, setSubject] = useState<Subject | DocumentData>({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);

  const handleAttend = () => {
    setSubject((sub) => ({ ...sub, attended: Number(sub.attended) + 1 }));
    setSubject((sub) => ({ ...sub, total: Number(sub.total) + 1 }));
  };

  const handleAbsent = () => {
    setSubject((sub) => ({ ...sub, total: Number(sub.total) + 1 }));
  };

  useEffect(() => {
    const docRef = doc(db, "subjects", id);
    getDoc(docRef)
      .then((val) => {
        if (val.exists()) {
          setSubject(val.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if(!subject){
    return (
      <div className="glass-div mt-4 mb-4 max-sm:mr-0 mr-4 ml-0 height-full-2rem max-sm:h-[calc(100vh-3rem)]">
        <h1 className="text-red-600">There was an error while fetching the data!</h1>
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
      {
        openDeletePopUp ? (
          <DeletePopUp id={id} db={db} setPopup={setOpenDeletePopUp}/>
        ) : null
      }
      {openPopUp ? (
        <div className="absolute z-40 top-0 left-0 right-0 bottom-0 bg-blue-500">
          <button
            className="rounded cursor-pointer z-10 glass-div-front text-white absolute p-3 top-10 right-5"
            onClick={() => {setOpenPopUp((val) => !val)}}
          >
            X
          </button>
          <div className="absolute glass-div z-40 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            <AddSubject
              title="Edit Course"
              db={db}
              nameVal={subject.name}
              attendedVal={subject.attended}
              totalVal={subject.total}
              update={true}
              id={id}
            />
          </div>
        </div>
      ) : null}
      <div className="glass-div-front h-[50%] max-sm:h-full">
        <h1 className="glass-h1">{subject.name}</h1>
        <div className="flex items-center justify-evenly w-full h-full max-sm:relative">
          <button
            className="rounded cursor-pointer text-white glass-div-front p-3  max-sm:absolute max-sm:left-5 max-sm:z-40 max-sm:top-[65%]"
            onClick={() => handleAbsent()}
          >
            <span className="max-sm:hidden">Was Absent In a Class</span><Image src={"/minus.png"} height={25} width={25} alt="Add" className="sm:hidden"/>
          </button>
          <div className="glass-div-front text-center p-3 max-sm:grow max-sm:m-4">
            <h1 className="text-white m-3">
              Attended Hours: {subject.attended}
            </h1>
            <h1 className="text-white m-3">Total Hours: {subject.total}</h1>
            <h1 className="text-white m-3">
              Average Attendence: {(subject.attended / subject.total) * 100}%
            </h1>
          </div>
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
