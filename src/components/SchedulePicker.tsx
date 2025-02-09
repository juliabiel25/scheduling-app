import DatePickers from './DatePickers';
import ScheduleNavigation from './ScheduleNavigation';
import styled from 'styled-components';

const StyledSchedulePicker = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const SchedulePicker = () => {
  return (
    <StyledSchedulePicker>
      <DatePickers />
      <ScheduleNavigation />
    </StyledSchedulePicker>
  );
};

export default SchedulePicker;
