import DatePicker from './DatePicker';
import React, { useState, useEffect } from 'react';
import DateSelection from '../utils/DateSelection';
import { selectionSetProp } from '../types/types';
import '../styles/DatePickers.css';


export interface DatePickersProps {
  dateRange: [Date, Date];
  monthsPerPage: number;
  selectionSet: selectionSetProp;
}

const DatePickers: React.FC<DatePickersProps> = (props) => {
  const [activeSelection, setActiveSelection] = useState<DateSelection>(
    new DateSelection({
      selectionSetIndex: props.selectionSet.getFocusedId,
    }),
  );
  const [hoverSelection, setHoverSelection] = useState<Date | null>(null);
  const [mouseOverListening, setMouseOverListening] = useState<boolean>(false);
  const [datePickerScroll, setDatePickerScroll] = useState<number>(0);

  // if the activeSelection has been completed - add the selection to schedule
  useEffect(() => {
    if (activeSelection.isComplete())
      props.selectionSet.addSelection(activeSelection);
  }, [activeSelection]);

  let month = props.dateRange[0].getMonth();
  let year = props.dateRange[0].getFullYear();
  let months = [[month, year]];
  while (
    month !== props.dateRange[1].getMonth() ||
    year !== props.dateRange[1].getFullYear()
  ) {
    if (month === 11) {
      month = 0;
      year += 1;
    } else {
      month += 1;
    }
    months.push([month, year]);
  }

  let datePickers = months.map(([month, year]) => (
    <DatePicker
      key={month.toString() + year.toString()}
      month={[month, year]}
      dateRange={props.dateRange}
      hoverSelection={{ value: hoverSelection, set: setHoverSelection }}
      activeSelection={{ value: activeSelection, set: setActiveSelection }}
      mouseOverListening={{
        value: mouseOverListening,
        set: setMouseOverListening,
      }}
      selectionSet={props.selectionSet}
    />
  ));

  const scrollForward = () => {
    setDatePickerScroll((prev) =>
      prev + props.monthsPerPage < datePickers.length ? prev + 1 : prev,
    );
  };

  const scrollBackward = () => {
    setDatePickerScroll((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="date-picker-list">
      <button className="datepickers-nav-btn" onClick={scrollBackward}>
        previous month
      </button>
      {datePickers.slice(
        datePickerScroll,
        datePickerScroll + props.monthsPerPage,
      )}
      <button className="datepickers-nav-btn" onClick={scrollForward}>
        next month
      </button>
    </div>
  );
};

export default DatePickers;
