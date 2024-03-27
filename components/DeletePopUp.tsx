import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { usePathname } from 'next/navigation'
import { Subject } from "@/types";
import { toast } from "react-toastify";

const DeletePopUp = ({id,setPopup,setSubjects}:{id:string,setPopup:Function,setSubjects?:Function}) => {
    const {push,refresh} = useRouter();
    const pathname = usePathname();
    const [loading,setLoading] = useState(false);
    function deleteCourse(): void {
        if(id===""){
          toast("Something went wrong",{
            type:"error",
            position:"top-right"
          });
          return;
        }
        setLoading(true);
        deleteDoc(doc(db,"subjects",id)).then((res)=>{
            setLoading(false);
            setPopup((val:boolean)=>!val);
            toast("Subject deleted successfully",{
              type:"success",
              position:"top-right"
            })
            if(pathname!=="/dashboard"){
              push("/dashboard");
            }else{
              if(setSubjects){
                setSubjects((val:Array<Subject>)=>{return val.filter((value,index)=>{
                  return value.id!==id
                })})
              }
            }
        }).catch((err)=>{
          toast("Something went wrong",{
            type:"error",
            position:"top-right"
          })
            setPopup((val:boolean)=>!val)
        })
    }

    function cancelDelete(): void {
        setPopup((val:boolean)=>!val);
    }

  return (
    <div className="absolute bg-blue-500 top-0 left-0 right-0 bottom-0 z-40 glass-div">
        <button
            className="rounded cursor-pointer z-10 glass-div-popup text-white absolute p-3 top-10 right-5"
            onClick={()=>setPopup((val:boolean)=>!val)}
          >
            X
          </button>
        <div className="relative top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded bg-white w-[30%] max-sm:w-full p-3 glass-div-popup text-white max-sm:text-black">
            <p>Do you really want to delete this course?</p>
            <div className="flex p-4 justify-between">
            <button disabled={loading} className="p-3 border-2 border-red-600 rounded" onClick={()=>deleteCourse()}>Yes,Delete</button>
            <button disabled={loading} className="p-3 border-2 border-green-600 rounded" onClick={()=>cancelDelete()}>No,Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default DeletePopUp