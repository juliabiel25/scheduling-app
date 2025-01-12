import SchedulePicker from './components/SchedulePicker';
import SchedulePickerLimits from './components/SchedulePickerLimits';
import styled from 'styled-components';
import { DatePickerStateProvider } from './state/StateContext';

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  return (
    <StyledApp>
      <DatePickerStateProvider>
        <div className="col center">
          <SchedulePickerLimits />
          <SchedulePicker monthsPerPage={2} />
        </div>
      </DatePickerStateProvider>
    </StyledApp>
  );
};

export default App;
