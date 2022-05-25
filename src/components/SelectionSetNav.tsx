import React from 'react'
import "../styles/SchedulePicker.css";
import DateSelection from '../utils/DateSelection';
import DateSelectionSet from '../utils/DateSelectionSet';

export interface SelectionSetNavProps {
    selectionSet: DateSelectionSet;
    focusedSelectionSetIndex: number;
    setFocusedSelectionSetIndex: (index: number) => void;
}

const SelectionSetNav: React.FC<SelectionSetNavProps> = props => {

    const selectionSetClicked = (): void => {
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
                    {selection.openingDate?.toLocaleDateString("en-US")} - {selection.closingDate?.toLocaleDateString("en-US")}
                </div>
            ))}
        </div>
    )
}

export default SelectionSetNav;