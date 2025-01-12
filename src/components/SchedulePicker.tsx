import { useEffect } from 'react';

import DatePickers from './DatePickers';
import DateSelectionSet from '../utils/DateSelectionSet';
import ScheduleNavigation from './ScheduleNavigation';
import styled from 'styled-components';
import { useDatePickerState } from '../state/StateContext';

const StyledSchedulePicker = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export interface SchedulePickerProps {
  monthsPerPage: number;
}

const SchedulePicker = ({ monthsPerPage }: SchedulePickerProps) => {
  const {
    state: { schedule },
    dispatch,
  } = useDatePickerState();

  // if a new selection set was added, put it in focus
  useEffect(() => {
    const id = schedule[schedule.length - 1].id;
    dispatch({
      type: 'SET_FOCUSED_SELECTION_SET',
      payload: id,
    });
  }, [schedule.length]);

  // create a new selection set and return it's index in the schedule array
  const newSelectionSet = (): number => {
    const prevScheduleLen = schedule.length;
    dispatch({
      type: 'SET_SCHEDULE',
      payload: [
        ...schedule,
        new DateSelectionSet({
          id: schedule[prevScheduleLen - 1].id + 1,
        }),
      ],
    });
    return prevScheduleLen - 1;
  };

  return (
    <StyledSchedulePicker>
      <DatePickers monthsPerPage={monthsPerPage} />
      <ScheduleNavigation newSelectionSet={newSelectionSet} />
    </StyledSchedulePicker>
  );
};

export default SchedulePicker;
