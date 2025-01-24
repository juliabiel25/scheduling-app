import { useEffect } from 'react';

import DatePickers from './DatePickers';
import ScheduleNavigation from './ScheduleNavigation';
import styled from 'styled-components';
import { useDatePickerState } from '../state/StateContext';
import {
  setFocusedSelectionSetId,
  createNewSelectionSet,
} from '../state/actions';

const StyledSchedulePicker = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export interface SchedulePickerProps {}

const SchedulePicker = ({}: SchedulePickerProps) => {
  const {
    state: { schedule },
    dispatch,
  } = useDatePickerState();

  // if a new selection set was added, put it in focus
  // useEffect(() => {
  //   const id = schedule[schedule.length - 1].id;
  //   dispatch(setFocusedSelectionSetId(id));
  // }, [schedule]);

  // create a new selection set and return it's index in the schedule array
  // const newSelectionSet = (): number => {
  //   const prevScheduleLen = schedule.length;
  //   dispatch(createNewSelectionSet());
  //   return prevScheduleLen - 1;
  // };

  return (
    <StyledSchedulePicker>
      <DatePickers />
      <ScheduleNavigation />
      {/* <ScheduleNavigation newSelectionSet={newSelectionSet} /> */}
    </StyledSchedulePicker>
  );
};

export default SchedulePicker;
