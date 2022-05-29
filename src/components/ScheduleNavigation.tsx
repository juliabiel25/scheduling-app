import React from 'react';
import styled from 'styled-components';
import DateSelectionSet from '../utils/DateSelectionSet';
import ScheduleTile from './ScheduleTile';

const StyledScheduleNavigation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 20em;
  max-height: min-content;
`;

const StyledAddSelectionBtn = styled.button`
  align-self: flex-end;
  margin: 0 0 0.3em 0;
  padding: 0.4em;
  border-radius: 50%;
  aspect-ratio: 1/1;
  font-size: xx-large;
  border: none;
  color: darkgray;
  
  &:hover {
    box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
      rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
    color: #222222;
  }
`;

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
    // <div className="date-selection-navigation">
    <StyledScheduleNavigation>
      <StyledAddSelectionBtn onClick={props.newSelectionSet}>
        +
      </StyledAddSelectionBtn>
      {selectionSets}
    </StyledScheduleNavigation>
  );
};

export default ScheduleNavigation;
