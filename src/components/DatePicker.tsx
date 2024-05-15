import { useEffect, useRef, useState } from 'react';

import Calendar from '../utils/Calendar';
import DateSelection from '../utils/DateSelection';
import Day from '../utils/Day';
import DayTile, { UpdatedDayProps } from './DayTile';
import MonthRange from '../utils/MonthRange';
import { selectionSetProp } from '../types/types';
import styled from 'styled-components';

const StyledWeekdayLabel = styled.div`
  color: rgb(191, 191, 191);
`;

const StyledDatePicker = styled.div`
  border: 1px solid lightgrey;
  padding: 1em;
  border-radius: 0.6em;
`;

const StyledDateTiles = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
`;

export interface DatePickerProps {
  month: [number, number];
  dateRange: MonthRange;
  activeSelection: {
    value: DateSelection;
    set: (selection: DateSelection) => void;
  };
  hoverSelection: {
    value: Date | null;
    set: (selection: Date | null) => void;
  };
  mouseOverListening: {
    value: boolean;
    set: (listen: boolean) => void;
  };
  selectionSet: selectionSetProp;
}

const DatePicker = ({
  month,
  dateRange,
  hoverSelection,
  activeSelection,
  mouseOverListening,
  selectionSet,
}: DatePickerProps) => {
  // const [cal, setCal] = useState<Calendar>();
  const cal = useRef<Calendar>();
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    console.log('Days changed to: ', days);
  }, [days]);

  useEffect(() => {
    if (month && dateRange.initDate && dateRange.finalDate && !cal.current)
      try {
        // setCal(new Calendar(month, dateRange));
        cal.current = new Calendar(month, dateRange);
        console.log('setting days to cal.current.days: ', cal.current.days);
        setDays(cal.current.days);
      } catch (e) {
        console.error('Generating a new calendar error: ', e);
      }
  }, [month, dateRange]);

  // if the date range is not selected -- no calendars are shown
  if (!dateRange.initDate || !dateRange.finalDate) {
    return (
      <div>
        Select the date range for the schedule
        <p>
          Current range: {dateRange.initDate?.toString()} -{' '}
          {dateRange.finalDate?.toString()}
        </p>
      </div>
    );
  }

  const updateDay = (updatedDayProps: UpdatedDayProps, index: number): void => {
    // setCal((prevCal) => {
    //   if (!prevCal) {
    //     console.error('Tried to update a day but there is no calendar object');
    //     return undefined;
    //   } else
    //     console.log(
    //       'updating cal to: ',
    //       { updatedDayProps },
    //       { ...prevCal.days[index], ...updatedDayProps },
    //     );
    //   return {
    //     ...prevCal,
    //     days: [
    //       ...prevCal.days.slice(0, index),
    //       { ...prevCal.days[index], ...updatedDayProps },
    //       ...prevCal.days.slice(index + 1),
    //     ],
    //   };
    // });
    console.log('updating days with: ', { updatedDayProps });
    setDays((prevDays) => {
      return [
        ...prevDays.slice(0, index),
        { ...prevDays[index], ...updatedDayProps },
        ...prevDays.slice(index + 1),
      ];
    });
  };

  const weekdayLabels: React.ReactNode = cal.current?.weekdayNames.map((wd) => (
    <StyledWeekdayLabel key={wd}>{wd}</StyledWeekdayLabel>
  ));

  return (
    <StyledDatePicker>
      {cal.current?.getMonthName()} {cal.current?.year}
      <StyledDateTiles>
        {weekdayLabels}
        {days.map((day, index) => (
          <DayTile
            key={day.date.toString()}
            // day={{
            //   value: day,
            //   set: (newDay: Day) => {
            //     console.log('setting day to: ', newDay);
            //     replaceDay(newDay, index);
            //   },
            // }}
            day={day}
            // setDay={(newDay: Day) => {
            //   replaceDay(newDay, index);
            // }}
            updateDay={(updatedDayProps: UpdatedDayProps) => {
              updateDay(updatedDayProps, index);
            }}
            hoverSelection={hoverSelection}
            activeSelection={activeSelection}
            mouseOverListening={mouseOverListening}
            selectionSet={selectionSet}
          />
        ))}
      </StyledDateTiles>
    </StyledDatePicker>
  );
};

export default DatePicker;
