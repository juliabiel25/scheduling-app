import React, { useState, useEffect } from 'react';
import '../styles/SchedulePicker.css';
import { CompleteDateSelection } from '../utils/DateSelection';
import DateSelectionSet from '../utils/DateSelectionSet';
import { addDays, generateDateSelections } from '../utils/functions';

export interface SelectionSetTileProps {
  selectionSet: DateSelectionSet;
  focusedSelectionSetIndex: number;
  setFocusedSelectionSetIndex: (index: number) => void;
}

const SelectionSetTile: React.FC<SelectionSetTileProps> = (props) => {
  const [dateSelections, setDateSelections] = useState<
    CompleteDateSelection[]
  >([]);
  const selectionSetClicked = (): void => {
    props.setFocusedSelectionSetIndex(props.selectionSet.index);
  };

  useEffect(() => {   
    // console.log('selectionSet changed. Dates:', props.selectionSet.dates)
    setDateSelections(
      generateDateSelections(
        props.selectionSet.dates,
        props.selectionSet.index,
      )
    );
  }, [props.selectionSet]);

  useEffect(() => {
    // console.log('generated selections:', dateSelections);
  }, [dateSelections]);

  const dateSelectionJSX = dateSelections.map(selection => (
    <div className="date-selection" key={selection.toString()}>
      {selection.openingDate.toDateString() + ' - ' +
      selection.closingDate.toDateString()}
    </div>
  ));

  return (
    <div
      className={`date-selection-set 
        ${
          props.focusedSelectionSetIndex === props.selectionSet.index
            ? 'focused-selection-set'
            : ''
        }`}
      onClick={selectionSetClicked}
    >
      Selection set <br />
      {dateSelectionJSX}
    </div>
  );
};

export default SelectionSetTile;
