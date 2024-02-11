import React from 'react'

const AttendenceDisplay = ({attended,total,average}:{attended:number,total:number,average:number|undefined}) => {
  return (
    <div className="glass-div-front text-center p-3 max-sm:grow max-sm:m-4">
            <h1 className="text-white m-3">
              Attended Hours: {attended?attended:null}
            </h1>
            <h1 className="text-white m-3">Total Hours: {total?total:null}</h1>
            <h1 className="text-white m-3">
              Average Attendence: {average?average :null}
            </h1>
          </div>
  )
}

export default AttendenceDisplay