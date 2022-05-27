import React, { useState, useEffect } from 'react';
import '../styles/ScheduleNavigation.css';
import { CompleteDateSelection } from '../utils/DateSelection';
import DateSelectionSet from '../utils/DateSelectionSet';
import { generateDateSelections } from '../utils/functions';

export interface ScheduleTileProps {
  selectionSet: DateSelectionSet;
  focusedSelectionSet: number;
  getSelectionSetIndex: (id: number) => number;
  setFocusedSelectionSet: (index: number) => void;
}

const ScheduleTile: React.FC<ScheduleTileProps> = (props) => {
  const [dateSelections, setDateSelections] = useState<CompleteDateSelection[]>(
    [],
  );
  const selectionSetClicked = (): void => {
    props.setFocusedSelectionSet(props.selectionSet.id);
  };

  useEffect(() => {
    setDateSelections(
      generateDateSelections(
        props.selectionSet.dates,
        props.getSelectionSetIndex(props.selectionSet.id),
      ),
    );
  }, [props.selectionSet]);

  const dateSelectionJSX =
    dateSelections.length === 0 ? (
      <div className="date-selection">...</div>
    ) : (
      dateSelections.map((selection) => (
        <div className="date-selection" key={selection.toString()}>
          {selection.openingDate.toLocaleDateString() +
            ' - ' +
            selection.closingDate.toLocaleDateString()}
        </div>
      ))
    );

  return (
    <div
      className={`date-selection-set 
        ${
          props.focusedSelectionSet === props.selectionSet.id
            ? 'focused-selection-set'
            : ''
        }`}
      onClick={selectionSetClicked}
      style={
        { 
          backgroundColor: props.selectionSet.color.opacity(0.2).toString(),
          outlineColor: props.selectionSet.color.toString() 
        }}
    >
      {dateSelectionJSX}
    </div>
  );
};

export default ScheduleTile;
