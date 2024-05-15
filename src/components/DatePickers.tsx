import { useEffect, useState } from 'react';

import DatePicker from './DatePicker';
import DateSelection from '../utils/DateSelection';
import MonthRange from '../utils/MonthRange';
import { selectionSetProp } from '../types/types';
import styled from 'styled-components';

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
  dateRange: MonthRange;
  monthsPerPage: number;
  selectionSet: selectionSetProp;
}

const DatePickers = ({
  dateRange,
  selectionSet,
  monthsPerPage,
}: DatePickersProps) => {
  const [activeSelection, setActiveSelection] = useState<DateSelection>(
    new DateSelection({
      selectionSetIndex: selectionSet.getFocusedId,
    }),
  );
  const [hoverSelection, setHoverSelection] = useState<Date | null>(null);
  const [mouseOverListening, setMouseOverListening] = useState<boolean>(false);
  const [datePickerScroll, setDatePickerScroll] = useState<number>(0);
  const [calendarData, setCalendarData] = useState<number[][]>([]); // [ num_of_month, num_of_year ]

  // if the activeSelection has been completed - add the selection to schedule
  useEffect(() => {
    if (activeSelection.isComplete())
      selectionSet.addSelection(activeSelection);
  }, [activeSelection]);

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
      setCalendarData(months);

      // update scroll
      // setDatePickerScroll(dateRange.getNumberOfMonths());
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

  // calendarData
  //   .map(([month, year]) => (
  //     <DatePicker
  //       key={month.toString() + year.toString()}
  //       month={[month, year]}
  //       dateRange={dateRange}
  //       hoverSelection={{ value: hoverSelection, set: setHoverSelection }}
  //       activeSelection={{ value: activeSelection, set: setActiveSelection }}
  //       mouseOverListening={{
  //         value: mouseOverListening,
  //         set: setMouseOverListening,
  //       }}
  //       selectionSet={selectionSet}
  //     />
  //   ))
  // .slice(datePickerScroll, datePickerScroll + monthsPerPage);

  const scrollForward = () => {
    setDatePickerScroll((prev) =>
      prev + monthsPerPage < dateRange.getNumberOfMonths() ? prev + 1 : prev,
    );
  };

  const scrollBackward = () => {
    setDatePickerScroll((prev) => (prev > 0 ? prev - 1 : prev));
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
              hoverSelection={{ value: hoverSelection, set: setHoverSelection }}
              activeSelection={{
                value: activeSelection,
                set: setActiveSelection,
              }}
              mouseOverListening={{
                value: mouseOverListening,
                set: setMouseOverListening,
              }}
              selectionSet={selectionSet}
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
