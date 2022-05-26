import DatePicker from './DatePicker';
import React, { useState, useEffect } from 'react';
import DateSelection from '../utils/DateSelection';
import DateSelectionSet from '../utils/DateSelectionSet';
import { selectionSetProp } from '../types/types';
import Day from '../utils/Day';

{
  /* <DatePickers 
dateRange={props.dateRange}
newSelectionSet={newSelectionSet}
focusedSelectionSetIndex={focusedSelectionSetIndex}
selectionSet={{
    getColor: getSelectionSetColor,
    getIndex: getSelectionSetIndex,
    addSelection: addDateSelection,
    switch: switchSelectionSets
}} */
}

export interface DatePickersProps {
  dateRange: [Date, Date];
  newSelectionSet: (selectionSet: DateSelectionSet) => void;
  focusedSelectionSetIndex: number;
  selectionSet: selectionSetProp;
}

const DatePickers: React.FC<DatePickersProps> = (props) => {
  const [activeSelection, setActiveSelection] = useState<DateSelection>(
    new DateSelection({
      selectionSetIndex: props.focusedSelectionSetIndex,
    }),
  );

  const [hoverSelection, setHoverSelection] = useState<Date | null>(null);
  const [mouseOverListening, setMouseOverListening] = useState<boolean>(false);

  // if the activeSelection has been completed - add the selection to schedule
  useEffect(() => {
    if (activeSelection.isComplete())
      props.selectionSet.addSelection(activeSelection);
  }, [activeSelection]);

  // const recordActiveSelection = (): void =>
  //   props.selectionSet.addSelection(activeSelection);

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
      // recordActiveSelection={recordActiveSelection}
      hoverSelection={{ value: hoverSelection, set: setHoverSelection }}
      activeSelection={{ value: activeSelection, set: setActiveSelection }}
      mouseOverListening={{
        value: mouseOverListening,
        set: setMouseOverListening,
      }}
      selectionSet={props.selectionSet}
    />
  ));

  return <div className="date-picker-list">{datePickers}</div>;
};

export default DatePickers;
