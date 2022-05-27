import React from 'react';
import '../styles/ScheduleNavigation.css';
import DateSelectionSet from '../utils/DateSelectionSet';
import ScheduleTile from './ScheduleTile';

export interface ScheduleNavigationProps {
  schedule: DateSelectionSet[];
  newSelectionSet: () => number;
  getSelectionSetIndex: (id: number) => number;
  focusedSelectionSet: number;
  setFocusedSelectionSet: (index: number) => void;
}

const ScheduleNavigation: React.FC<ScheduleNavigationProps> = (props) => {
  const selectionSets = props.schedule.map((selectionSet) => (
    <ScheduleTile
      key={selectionSet.id}
      selectionSet={selectionSet}
      getSelectionSetIndex={props.getSelectionSetIndex}
      focusedSelectionSet={props.focusedSelectionSet}
      setFocusedSelectionSet={props.setFocusedSelectionSet}
    />
  ));

  return (
    <div className="date-selection-navigation">
      <button className='add-selection-set-btn 'onClick={props.newSelectionSet}>+</button>
      {selectionSets}
    </div>
  );
};

export default ScheduleNavigation;
