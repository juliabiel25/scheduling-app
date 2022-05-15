import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import React, { useState, useEffect } from 'react'
import "../styles/SchedulePicker.css";
import DateSelection from '../utils/DateSelection';
import { randomColor } from '../utils/functions';
import RGBAColor from '../utils/RGBAColor';

const Selection = ({selection}) => {
    return (
        <div className='selection'>
            {selection.toString()}
        </div>)

}

const SelectedDates = ({selectionSet, selectionColor, setSelectionColor}) => {
    const clearSelection = () => {
        setSelectionColor(randomColor());
    }

    return (
        <div className='active-selections'>
            {selectionSet.map((selection, index) => (
                <Selection selection={selection} key={index} />
            ))}
            <button onClick={clearSelection}>Clear list of selections</button>
        </div>
        );
}


const SchedulePicker = ({initDate, finalDate}) => {
    
    const [selectionColor, setSelectionColor] = useState(new RGBAColor({}))
    const [activeSelection, setActiveSelection] = useState(new DateSelection({openingDate: null, color: selectionColor}));
    const [hoverSelection, setHoverSelection] = useState();
    const [selectionSet, setSelectionSet] = useState([]);
    const [mouseOverListening, setMouseOverListening] = useState(false);

    useEffect(() => {
        console.log('mouseover listening:', mouseOverListening);
    }, [mouseOverListening])

    

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
                    activeSelection={activeSelection}
                    setActiveSelection={setActiveSelection}
                    selectionSet={selectionSet}
                    setSelectionSet={setSelectionSet}
                    selectionColor={selectionColor}
                    setSelectionColor={setSelectionColor}
                    setMouseOverListening={setMouseOverListening}
                    setHoverSelection={setHoverSelection}
                    hoverSelection={hoverSelection}
                />
            )
        }          
        return datePickers;        
    }

    const datePickers = generateDatePickers(initDate, finalDate)   

    return (
        <div className='schedule-picker'>
            
            <div className='date-picker-list'>
                {datePickers}
            </div>

            <SelectedDates selectionSet={selectionSet} selectionColor={selectionColor} setSelectionColor={setSelectionColor}/>
                
            {selectionSet[0] !== null &&
                <TimePicker 
                selectionSet={selectionSet}
                setSelectionSet={setSelectionSet} />
            }
        </div>
    );
};


export default SchedulePicker;