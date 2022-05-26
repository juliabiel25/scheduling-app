import { useState, useEffect } from 'react';
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

  // const clearHover = (): void => {
  //   let newCal = cal;
  //   newCal.clearHover();
  //   setCal(newCal);
  // };

  // assign colors to tiles based on active selection state
  // useEffect(() => {
  //   // selection inclomplete - assign color to the day opening a new selection
  //   if (
  //     props.activeSelection.value.openingDate &&
  //     //props.activeSelection.value.incomplete()
  //     cal.includesDate(props.activeSelection.value.openingDate)
  //   ) {
  //     let dayIndex = cal.days.findIndex(
  //       (day) =>
  //         day.date.getTime() ===
  //         props.activeSelection.value.openingDate?.getTime(),
  //     );

  //     let modDay = cal.days[dayIndex];
  //     setCal({
  //       ...cal,
  //       days: [
  //         ...cal.days.slice(0, dayIndex),
  //         modDay,
  //         ...cal.days.slice(dayIndex + 1),
  //       ],
  //     });
  //   }

  //   // if selection is complete - assign color to all the days within the selection
  //   else if (
  //     // TODO: why does complete() not cover the others
  //     // props.activeSelection.value.complete()

  //     props.activeSelection.value.openingDate &&
  //     props.activeSelection.value.closingDate &&
  //     props.activeSelection.value.includesMonth(props.month)
  //   ) {
  //     let start = new Date(props.month[1], props.month[0], 1); // first day of the month
  //     let finish = new Date(props.month[1], props.month[0] + 1, 0); // last day of the month

  //     if (props.activeSelection.value.startsInMonth(props.month))
  //       start = props.activeSelection.value.openingDate;

  //     if (props.activeSelection.value.endsInMonth(props.month))
  //       finish = props.activeSelection.value.closingDate;

  //     for (let day = start; day <= finish; day.setDate(day.getDate() + 1)) {
  //       let dayIndex = cal.days.findIndex(
  //         (it) => it.date.getTime() === day.getTime(),
  //       );

  //       if (dayIndex !== -1) {
  //         let modDay = cal.days[dayIndex];
  //         setCal({
  //           ...cal,
  //           days: [
  //             ...cal.days.slice(0, dayIndex),
  //             modDay,
  //             ...cal.days.slice(dayIndex + 1),
  //           ],
  //         });
  //       }
  //     }
  //   }
  // }, [props.activeSelection, cal, props.month[0], props.month[1]]);

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
