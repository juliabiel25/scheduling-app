import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import React, { useState } from 'react'
import "../styles/SchedulePicker.css";

const SchedulePicker = (props) => {

    const [selection, setSelection] = useState([null, null])
    
    const generateDatePickers = (initDate, finalDate) => {
        let datePickers = []        

        let month = initDate.getMonth()
        let year = initDate.getFullYear()
        let months = [[month, year]]
        while (month !== finalDate.getMonth() || year !== finalDate.getFullYear()) {
            if (month === 11) {
                month = 0
                year += 1
            } else {
              month += 1  
            }
            months.push([month, year])
        }

        for ([month, year] of months) {
            datePickers.push(
                <DatePicker 
                    key={month.toString() + year.toString()}
                    month={month}
                    year={year}
                    initDate={initDate}
                    finalDate={finalDate} 
                    selection={selection}
                    setSelection={setSelection}
                />
            )
        }          
        return datePickers;        
    }

    const datePickers = generateDatePickers(props.initDate, props.finalDate)   
    console.log('sched-pick: init Date: ', props.initDate);

    return (
        <div className='schedule-picker'>
            
            <div className='date-picker-list'>
                {datePickers}
            </div>

            <div className='schedule-log'>
                <p>current selection: {selection.toString()}</p>
                {/* <p>start: {selection[0]}</p>
                <p>end: {selection[1]}</p> */}
            </div>
                
            {selection[0] !== null &&
                <TimePicker 
                selection={selection}
                setSelection={setSelection} />
            }
        </div>
    );
};

export default SchedulePicker;