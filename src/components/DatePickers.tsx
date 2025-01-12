import { useEffect } from 'react';

import DatePicker from './DatePicker';
import styled from 'styled-components';
import { useDatePickerState } from '../state/StateContext';

const NavigationButton = styled.button<{}>`
  border: none;
  width: 100%;
  border-radius: 0.6em;
  padding: 0.3em;
  transition: box-shadow 0.2s ease-out;

  &:hover {
    box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
      rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
    color: #222222;
  }
  &:disabled {
    visibility: hidden;
  }
`;

const DatePickersGroup = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

export interface DatePickersProps {
  monthsPerPage: number;
}

const DatePickers = ({ monthsPerPage }: DatePickersProps) => {
  const {
    state: { dateRange, activeSelection, calendarData, datePickerScroll },
    dispatch,
  } = useDatePickerState();

  useEffect(() => {
    if (dateRange.initDate && dateRange.finalDate) {
      // generate calendar data based on the date range limits
      let month = dateRange.initDate.getMonth();
      let year = dateRange.initDate.getFullYear();
      let months = [[month, year]];
      while (
        month !== dateRange.finalDate.getMonth() ||
        year !== dateRange.finalDate.getFullYear()
      ) {
        if (month === 11) {
          month = 0;
          year += 1;
        } else {
          month += 1;
        }
        months.push([month, year]);
      }
      dispatch({ type: 'SET_CALENDAR_DATA', payload: months });
    } else {
      console.warn(
        'DatePickers:: did not generate calendars because the date range was not specified',
      );
    }
  }, [dateRange]);

  const filteredCalendarData = calendarData.slice(
    datePickerScroll,
    datePickerScroll + monthsPerPage,
  );

  const scrollForward = () => {
    dispatch({
      type: 'SET_DATE_PICKER_SCROLL',
      payload:
        datePickerScroll + monthsPerPage < dateRange.getNumberOfMonths()
          ? datePickerScroll + 1
          : datePickerScroll,
    });
  };

  const scrollBackward = () => {
    dispatch({
      type: 'SET_DATE_PICKER_SCROLL',
      payload: datePickerScroll > 0 ? datePickerScroll - 1 : datePickerScroll,
    });
  };

  return (
    <div className="date-picker-list">
      <NavigationButton
        onClick={scrollBackward}
        disabled={datePickerScroll > 0 ? false : true}
      >
        previous month
      </NavigationButton>

      <DatePickersGroup>
        {dateRange.getNumberOfMonths() > 0 ? (
          filteredCalendarData.map(([month, year]) => (
            <DatePicker
              key={month.toString() + year.toString()}
              month={[month, year]}
              dateRange={dateRange}
            />
          ))
        ) : (
          <p>Select the date range to display calendars</p>
        )}
      </DatePickersGroup>

      <NavigationButton
        onClick={scrollForward}
        disabled={
          datePickerScroll + monthsPerPage < dateRange.getNumberOfMonths()
            ? false
            : true
        }
      >
        next month
      </NavigationButton>
    </div>
  );
};

export default DatePickers;
