import styled from 'styled-components';
import { useDatePickerState } from '../state/StateContext';
import {
  setDateRangeStart,
  setDateRangeEnd,
  generateCalendars,
} from '../state/actions';

export interface SchedulePickerLimitsProps {}

const StyledDateInput = styled.input`
  padding: 0.7em 1.2em;
  border-radius: 0.5em;
  border: solid 1px lightgray;
`;

const StyledInputContainer = styled.div`
  display: flex;
  gap: 0.5em;
`;

const SchedulePickerLimits = ({}: SchedulePickerLimitsProps) => {
  const { state, dispatch } = useDatePickerState();

  return (
    <StyledInputContainer className="dateRangeLimiter">
      <StyledDateInput
        type="date"
        value={state.dateRange.initDate?.toISOString().split('T')[0] || ''}
        onChange={(e) => {
          if (e.target.valueAsDate) {
            dispatch(setDateRangeStart(e.target.valueAsDate));
          }
        }}
      />
      <StyledDateInput
        type="date"
        value={state.dateRange.finalDate?.toISOString().split('T')[0] || ''}
        onChange={(e) => {
          if (e.target.valueAsDate) {
            dispatch(setDateRangeEnd(e.target.valueAsDate));
            dispatch(generateCalendars());
          }
        }}
      />
    </StyledInputContainer>
  );
};

export default SchedulePickerLimits;
