import DatePickers from './DatePickers'
import React, { useState } from 'react'
import "../styles/SchedulePicker.css";


const SchedulePicker = props => {


    const [schedule, setSchedule] = useState([]);
    const addDateSelection = selection => (
        setSchedule (prevSchedule => ([...prevSchedule, selection])))

    return (
        <div className='schedule-picker'>
            
            <DatePickers 
                dateRange={props.dateRange}
                addDateSelection={addDateSelection} />

        </div>
    );
};


export default SchedulePicker;