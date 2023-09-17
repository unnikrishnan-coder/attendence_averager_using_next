import { Firestore } from "firebase/firestore"
import AddSubject from "../AddSubject/AddSubject"

interface Props {
    db : Firestore;
    name : string;
    attended : string;
    total : string;
    id : string;
    setOpenPopUp : Function
}

const EditCoursePopUp = (props : Props) => {
    const {db,name,attended,total,id,setOpenPopUp} = props;
    return (
        <div className="absolute z-40 top-0 left-0 right-0 bottom-0 bg-blue-500">
            <button
                className="rounded cursor-pointer z-10 glass-div-front text-white absolute p-3 top-10 right-5"
                onClick={() => { setOpenPopUp((val : boolean) => !val) }}
            >
                X
            </button>
            <div className="absolute glass-div z-40 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                <AddSubject
                    title="Edit Course"
                    db={db}
                    nameVal={name}
                    attendedVal={attended}
                    totalVal={total}
                    update={true}
                    id={id}
                />
            </div>
        </div>
    )
}

export default EditCoursePopUp