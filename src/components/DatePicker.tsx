import { useState } from 'react';
import styled from 'styled-components';
import Calendar from '../utils/Calendar';
import DayTile from './DayTile';
import DateSelection from '../utils/DateSelection';
import { selectionSetProp } from '../types/types';
import Day from '../utils/Day';

const StyledWeekdayLabel = styled.div`
  color: rgb(191, 191, 191);
`;

const StyledDatePicker = styled.div`
  border: 1px solid lightgrey;
  padding: 1em;
  border-radius: .6em;
`;

const StyledDateTiles = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
`;

export interface DatePickerProps {
  month: [number, number];
  dateRange: [Date, Date];
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

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const [cal, setCal] = useState(new Calendar(props.month, props.dateRange));

  const replaceDay = (newDay: Day, index: number): void =>
    setCal({
      ...cal,
      days: [...cal.days.slice(0, index), newDay, ...cal.days.slice(index + 1)],
    });

  const weekdayLabels = cal.weekdayNames.map((wd) => (
    <StyledWeekdayLabel key={wd}>{wd}</StyledWeekdayLabel>
  ));

  const dayTiles = cal.days.map((day, index) => (
    <DayTile
      key={day.date.toString()}
      day={{
        value: day,
        set: (newDay: Day) => replaceDay(newDay, index),
      }}
      hoverSelection={props.hoverSelection}
      activeSelection={props.activeSelection}
      mouseOverListening={props.mouseOverListening}
      selectionSet={props.selectionSet}
    />
  ));

  return (
    <StyledDatePicker>      
      {cal.getMonthName()} {cal.year}
      <StyledDateTiles>
        {weekdayLabels}
        {dayTiles}
      </StyledDateTiles>
    </StyledDatePicker>
  );
};

export default DatePicker;
