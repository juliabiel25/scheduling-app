import { useState } from 'react';
import Calendar from '../utils/Calendar';
import DayTile from './DayTile';
import '../styles/DatePicker.css';
import DateSelection from '../utils/DateSelection';
import { selectionSetProp } from '../types/types';
import Day from '../utils/Day';

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
    <div key={wd} className="weekday-label">
      {wd}
    </div>
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
    <div className="date-picker">
      <div className="month-label">
        {cal.getMonthName()} {cal.year}
      </div>
      <div className="day-tiles">
        {weekdayLabels}
        {dayTiles}
      </div>
    </div>
  );
};

export default DatePicker;
