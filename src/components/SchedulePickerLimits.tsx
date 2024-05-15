import MonthRange from '../utils/MonthRange';
import styled from 'styled-components';

export interface SchedulePickerLimitsProps {
  dateRange: MonthRange;
  onInitDateChange: (date: Date | null) => void;
  onFinalDateChange: (date: Date | null) => void;
}

const StyledDateInput = styled.input`
  padding: 0.7em 1.2em;
  border-radius: 0.5em;
  border: solid 1px lightgray;
`;

const StyledInputContainer = styled.div`
  display: flex;
  gap: 0.5em;
`;

const SchedulePickerLimits = ({
  dateRange,
  onInitDateChange,
  onFinalDateChange,
}: SchedulePickerLimitsProps) => {
  return (
    <StyledInputContainer className="dateRangeLimiter">
      <StyledDateInput
        type="date"
        onChange={(e) => onInitDateChange(e.target.valueAsDate)}
      />
      <StyledDateInput
        type="date"
        onChange={(e) => onFinalDateChange(e.target.valueAsDate)}
      />
    </StyledInputContainer>
  );
};

export default SchedulePickerLimits;
