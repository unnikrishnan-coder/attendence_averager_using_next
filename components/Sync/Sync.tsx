import Loading from "@/app/dashboard/loading";
import { db } from "@/firebase";
import { Subject } from "@/types";
import { CookieValueTypes, getCookie, hasCookie } from "cookies-next";
import { collection, doc, writeBatch } from "firebase/firestore";
import { FormEvent, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { read, utils } from "xlsx";

type SyncSubject = {key1?:string,key2?:string,key3?:string,key4?:string,key5?:string}

const Sync = ({setSyncOn,setSubjects}:{setSyncOn:Function,setSubjects:Function}) => {
    const [file, setFile] = useState<Blob | null>(null);
    const [tableData, settableData] = useState<string[][]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (file != null) {
            toast("File uploaded", { position: 'top-right', type: "success" });
            toast("Click Upload to start the syncing process", { position: 'top-right', type: "info" });
        }

    }, [file]);

    const readExcel = () => {
        const promise = new Promise<string[][]>((resolve, reject) => {
            const fileReader = new FileReader();
            if (file == null) {
                reject("File not uploaded properly");
            }else{
                fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e) => {
                if(e.target==null){
                    reject("Something went wrong");
                    return;
                }
                const bufferArray = e.target.result;
                const wb = read(bufferArray, {
                    type: "buffer"
                });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data : SyncSubject[] = utils.sheet_to_json(ws);
                let tableData:string[][] = [];
                for (let i = 2; i < data.length; i++) {
                    if (i == data.length - 1) break;
                    let datas: string[] = [];
                    Object.values(data[i]).forEach((val) => {
                        datas.push(val);
                    })
                    tableData.push(datas);
                }
                resolve(tableData);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
            }
            
        });
        return promise;
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        if (file == null) {
            toast("No file uploaded", {
                position: 'top-right',
                type: "error"
            })
        } else {
            setLoading(true);
            readExcel().then((val) => {
                settableData(val);
                setLoading(false);
                setFile(null);
            }).catch((err) => {
                toast("Something went wrong", { position: 'top-right', type: "error" });
                setLoading(false);
                setFile(null);
            })
        }

    }

    if (loading) {
        return (
            <div
                className="text-white grid place-items-center bg-black rounded w-1/2 min-h-[50%] absolute top-1/2 left-1/2 text-center z-50 -translate-x-1/2 -translate-y-1/2">
                <Loading /><h1>Wait a few seconds. Syncing in progress.</h1>
            </div>
        )
    } else {
        return (
            <div
                className="text-white bg-black rounded w-1/2 min-h-[50%] absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 max-h-screen overflow-x-hidden overflow-y-scroll">
                {
                    tableData != null ? <TableComponent tableData={tableData} setSyncOn={setSyncOn} setSubjects={setSubjects}/> : 
                    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col p-6 justify-center">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-4" aria-describedby="file_input_help" id="file_input" type="file" name="syncfile" onChange={(e) => { if (e.target.files) { setFile(e.target.files[0]) } }} />
                        
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 mb-4" id="file_input_help">
                            Upload the attendence file exported from lms (XLSX files only)
                        </p>

                        <button type="submit" className="rounded text-center text-white border-green-400 border-2 bg-green-400 p-3 disabled:cursor-not-allowed">
                            Upload
                        </button>
                    </form>
                }
            </div>
        )
    }

}

export const TableComponent = ({ tableData,setSyncOn,setSubjects }: {tableData:string[][],setSyncOn:Function,setSubjects:Function}) => {

    const uploadSubjects = async () => {
        if(!hasCookie("user_id")) {
            toast("Error in writing data",{position:'top-right',type:"error"});
            return ;
        }
        const uid = getCookie("user_id");
        const documentDatas : {name:string;attended:string;total:string;uid:CookieValueTypes}[] = [];
        tableData.forEach((val)=>{
            const singleDoc = {name:val[1],attended:val[2],total:val[3],uid:uid};
            documentDatas.push(singleDoc);
        });
        const batch = writeBatch(db);
        documentDatas.forEach((data) => {
            const docRef = doc(collection(db,"subjects"));
            batch.set(docRef, data);
        });
        batch.commit().then((res) => {
            toast("Subjects in sync with LMS",{position:'top-right',type:"success"});
            setSyncOn(false);
            if(setSubjects){
                setSubjects((val:Array<Subject>)=>([...val,...documentDatas]))
            }
        }).catch((err) => {
            console.log(err);
            toast("Soemthing went wrong",{position:'top-right',type:"error"})
        })
      }

    return (
        <div className="m-8">
            {
                tableData ? <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

                        <tr><th className="px-6 py-3">Si No</th><th className="px-6 py-3">Subject</th><th className="px-6 py-3">Attended Hours</th><th className="px-6 py-3">Total Hours</th><th className="px-6 py-3">Percentage</th></tr>

                    </thead>
                    <tbody>
                        {
                            tableData.map((val, index) => {
                                return (
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4">{val[0]}</td>
                                        <td className="px-6 py-4">{val[1]}</td>
                                        <td className="px-6 py-4">{val[2]}</td>
                                        <td className="px-6 py-4">{val[3]}</td>
                                        <td className="px-6 py-4">{val[4]}</td>
                                    </tr>
                                )
                            }

                            )
                        }
                    </tbody>
                </table> : null
            }

            <div className="flex mt-4 justify-evenly border-2 border-slate-400 p-3">
                <h1 className="text-center">Is the data Correct?</h1>
                <button className="rounded text-center text-white  bg-red-400 p-3 disabled:cursor-not-allowed" onClick={()=>setSyncOn(false)}>No !! Cancel</button>
                <button className="rounded text-center text-white  bg-green-400 p-3 disabled:cursor-not-allowed" onClick={()=>uploadSubjects()}>Yes, Upload</button>
            </div>
        </div>
    )
}


export default Sync