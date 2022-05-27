import React from 'react';
import '../styles/SchedulePicker.css';
import DateSelectionSet from '../utils/DateSelectionSet';
import SelectionSetTile from './SelectionSetTile';

export interface SelectionSetNavigationProps {
  schedule: DateSelectionSet[];
  newSelectionSet: () => number;
  focusedSelectionSetIndex: number;
  setFocusedSelectionSetIndex: (index: number) => void;
}

const SelectionSetNavigation: React.FC<SelectionSetNavigationProps> = (
  props,
) => {
  const selectionSets = props.schedule.map((selectionSet) => (
    <SelectionSetTile
      key={selectionSet.index}
      selectionSet={selectionSet}
      focusedSelectionSetIndex={props.focusedSelectionSetIndex}
      setFocusedSelectionSetIndex={props.setFocusedSelectionSetIndex}
    />
  ));

  return (
    <div className="date-selection-navigation">
      Selections so far: <br />
      {selectionSets}
      <button onClick={props.newSelectionSet}>New Selection Set</button>
    </div>
  );
};

export default SelectionSetNavigation;
