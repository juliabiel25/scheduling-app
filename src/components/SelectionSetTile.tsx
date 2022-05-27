import React, { useState, useEffect } from 'react';
import '../styles/SchedulePicker.css';
import { CompleteDateSelection } from '../utils/DateSelection';
import DateSelectionSet from '../utils/DateSelectionSet';
import { generateDateSelections } from '../utils/functions';

export interface SelectionSetTileProps {
  selectionSet: DateSelectionSet;
  focusedSelectionSetIndex: number;
  setFocusedSelectionSetIndex: (index: number) => void;
}

const SelectionSetTile: React.FC<SelectionSetTileProps> = (props) => {
  const [dateSelections, setDateSelections] = useState<CompleteDateSelection[]>(
    [],
  );
  const selectionSetClicked = (): void => {
    props.setFocusedSelectionSetIndex(props.selectionSet.index);
  };

  useEffect(() => {
    setDateSelections(
      generateDateSelections(
        props.selectionSet.dates,
        props.selectionSet.index,
      ),
    );
  }, [props.selectionSet]);

  const dateSelectionJSX = dateSelections.map((selection) => (
    <div className="date-selection" key={selection.toString()}>
      {selection.openingDate.toDateString() +
        ' - ' +
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
