import React, { useState } from 'react';

import MonthRange from './utils/MonthRange';
import SchedulePicker from './components/SchedulePicker';
import SchedulePickerLimits from './components/SchedulePickerLimits';
import styled from 'styled-components';

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  const [dateRange, setDateRange] = useState<MonthRange>(
    new MonthRange(null, null),
  );

  function onInitDateChange(date: Date | null) {
    // const confirm = window.confirm(
    //   'Changing the date ranges will erase all inputed data. Are you sure you want to change the date range?',
    // );
    // if (confirm) {
    setDateRange((prev) => new MonthRange(date, prev.finalDate));
  }

  function onFinalDateChange(date: Date | null) {
    // const confirm = window.confirm(
    //   'Changing the date ranges will erase all inputed data. Are you sure you want to change the date range?',
    // );
    // if (confirm) {
    setDateRange((prev) => new MonthRange(prev.initDate, date));
    // }
  }

  return (
    <StyledApp>
      <div className="col center">
        <SchedulePickerLimits
          dateRange={dateRange}
          onInitDateChange={onInitDateChange}
          onFinalDateChange={onFinalDateChange}
        />
        <SchedulePicker
          monthsPerPage={2}
          dateRange={dateRange}
        />
      </div>
    </StyledApp>
  );
};

export default App;
