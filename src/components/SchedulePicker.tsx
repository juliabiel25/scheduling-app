import DatePickers from './DatePickers'
import React, { useState, useEffect } from 'react'
import "../styles/SchedulePicker.css";
import DateSelectionSet from '../utils/DateSelectionSet';
import SelectionSetNav from './SelectionSetNav';
import RGBAColor from '../utils/RGBAColor';
import DateSelection from '../utils/DateSelection';

export interface SchedulePickerProps {
    dateRange: [Date, Date];
}

const SchedulePicker: React.FC<SchedulePickerProps> = props => {

    const [schedule, setSchedule] = useState<DateSelectionSet[]>([new DateSelectionSet()]);
    const [focusedSelectionSetIndex, setFocusedSelectionSetIndex] = useState<number>(0)

    useEffect(() => {
      console.log('schedule has changed:', schedule.map(selectionSet => (
          {
              selectionSetIndex: selectionSet.index,
              color: selectionSet.color
          }
      )))
    }, [schedule])
    
    useEffect(() => {
        console.log('focused selection set:', focusedSelectionSetIndex);
    }, [focusedSelectionSetIndex])
    

    const getSelectionSetColor = (index: number = focusedSelectionSetIndex): RGBAColor | undefined => {
        if (typeof schedule[index] !== undefined) {
            return schedule[index].color;
        }            
    };

    const getSelectionSetIndex = (): number => {
        if (typeof schedule[focusedSelectionSetIndex] !== undefined) {
            return schedule[focusedSelectionSetIndex].index;
        }
        return 0;            
    };

    // add a new date selection to the selection set currently in focus
    const addDateSelection = (dateSelection: DateSelection): void => {
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

    // if a day tile was assigned to a new selection set - switch selection sets
    const switchSelectionSets = (from: number, to: number, date: Date): void => {
        console.log(`switch selection sets
        \n\tday: ${date}
        \n\tfrom: ${from}
        \n\tto: ${to}`);
    }
    
    // if a new selection set was added, put it in focus
    useEffect(() => {
          setFocusedSelectionSetIndex(schedule.length - 1);
    }, [schedule.length])   

    // create a new selection set and return it's index in the schedule array
    const newSelectionSet = (): number => {
        const prevScheduleLen = schedule.length;
        setSchedule (prevSchedule => [
            ...prevSchedule, 
            new DateSelectionSet(prevSchedule.length)
        ]);
        return prevScheduleLen - 1;        
    }
  
    const selectionSets = schedule.map((selectionSet, i) => (
        <SelectionSetNav
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
                    getIndex: getSelectionSetIndex,
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