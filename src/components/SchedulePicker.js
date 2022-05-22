import DatePickers from './DatePickers'
import React, { useState, useEffect } from 'react'
import DateSelectionSet from '../utils/SelectionSet'
import "../styles/SchedulePicker.css";


const SelectionSet = props => {

    const selectionSetClicked = () => {
        props.setFocusedSelectionSetIndex(props.selectionSet.index)
    }

    return (
        <div 
            className={
                `
                date-selection-set 
                ${props.focusedSelectionSetIndex === props.selectionSet.index ? 'focused-selection-set' : ''}
                `
            }
            onClick={selectionSetClicked}
        >
            Selection set <br/>
            {props.selectionSet.dates.map(selection => (
                <div className='date-selection' key={selection.toString()}>
                    {selection.openingDate.toLocaleDateString("en-US")} - {selection.closingDate.toLocaleDateString("en-US")}
                </div>
            ))}
        </div>
    )
}

const SchedulePicker = props => {

    const [schedule, setSchedule] = useState([new DateSelectionSet({})]);
    const [focusedSelectionSetIndex, setFocusedSelectionSetIndex] = useState(0)

    const getSelectionSetColor = () => {
        if (typeof schedule[focusedSelectionSetIndex] !== undefined) {
            return schedule[focusedSelectionSetIndex].color;
        }            
    };

    // add a new date selection to the selection set of given index
    const addDateSelection = (dateSelection) => {
        const index = focusedSelectionSetIndex;
        setSchedule (prevSchedule => (
            [
                ...prevSchedule.slice(0, index), 
                {
                    ...prevSchedule[index],
                    dates: [
                        ...prevSchedule[index].dates, 
                        dateSelection
                    ]
                },
                ...prevSchedule.slice(index + 1)
            ]
        ));
    }

    const switchSelectionSets = (fromIndex, toIndex, date) => {
        console.log(`switch selection sets
        \n\tday: ${date}
        \n\tfrom: ${fromIndex}
        \n\tto: ${toIndex}`);
    }

    useEffect(() => {
        // if a new selection set was added, put it in focus
          setFocusedSelectionSetIndex(schedule.length - 1);
    }, [schedule.length])   

    useEffect(() => {
      console.log('focused selection set changed:', focusedSelectionSetIndex)
    }, [focusedSelectionSetIndex])   


    // create a new selection set and return it's index in the schedule array
    const newSelectionSet = () => {
        const prevScheduleLen = schedule.length;
        setSchedule (prevSchedule => [
            ...prevSchedule, 
            new DateSelectionSet({index: prevSchedule.length})
        ]);
        return prevScheduleLen - 1;        
    }
  

    let selectionSets = schedule.map((selectionSet, i) => (
        <SelectionSet
            key={selectionSet.index}
            selectionSet={selectionSet}
            focusedSelectionSetIndex={focusedSelectionSetIndex}
            setFocusedSelectionSetIndex={setFocusedSelectionSetIndex} 
        />
    ));

    return (
        <div className='schedule-picker'>   
            <DatePickers 
                dateRange={props.dateRange}
                newSelectionSet={newSelectionSet}
                focusedSelectionSetIndex={focusedSelectionSetIndex}
                selectionSet={{
                    getColor: getSelectionSetColor,
                    addSelection: addDateSelection,
                    switch: switchSelectionSets
                }}
            />
            <div>
                Selections so far: <br />
                {selectionSets}
                <button onClick={newSelectionSet}>New Selection Set</button>
            </div>
            
        </div>
    );
};


export default SchedulePicker;