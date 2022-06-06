import React from 'react'
import styled from 'styled-components';
import SchedulePicker from './components/SchedulePicker';

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App: React.FC = () => {

  let initDate = new Date(2022, 0, 3) 
  let finalDate = new Date(2022, 1, 15)

  return (
    <StyledApp>
      <SchedulePicker monthsPerPage={2} dateRange={[initDate, finalDate]} />
    </StyledApp>
  );
};

export default App;
