import DatePickers from './DatePickers';
import React, { useState, useEffect } from 'react';
import '../styles/SchedulePicker.css';
import DateSelectionSet from '../utils/DateSelectionSet';
import SelectionSetNav from './SelectionSetNav';
import RGBAColor from '../utils/RGBAColor';
import { addDays, subtractDays } from '../utils/functions';
import DateSelection, { CompleteDateSelection } from '../utils/DateSelection';

export interface SchedulePickerProps {
  dateRange: [Date, Date];
}

const SchedulePicker: React.FC<SchedulePickerProps> = (props) => {
  const [schedule, setSchedule] = useState<DateSelectionSet[]>([
    new DateSelectionSet({ index: 0 }),
  ]);
  const [focusedSelectionSetIndex, setFocusedSelectionSetIndex] =
    useState<number>(0);

  //   useEffect(() => {
  //     console.log(
  //       'schedule has changed:',
  //       schedule.map((selectionSet) => ({
  //         selectionSetIndex: selectionSet.index,
  //         color: selectionSet.color,
  //       })),
  //     );
  //   }, [schedule]);

  useEffect(() => {
    console.log('focused selection set:', focusedSelectionSetIndex);
  }, [focusedSelectionSetIndex]);

  /**
   * Return the assigned color of the date selection set specified by given index.
   * By default index is set to focusedSelectionSetIndex.
   * @param {number | undefined} index - the index of a date selection set within schedule.dates[].
   * @returns {RGBAColor | undefined} - the color of the date selection set.
   */
  const getSelectionSetColor = (
    index: number = focusedSelectionSetIndex,
  ): RGBAColor | undefined => {
    if (typeof schedule[index] !== undefined) {
      return schedule[index].color;
    }
  };

  const getSelectionSetIndex = (): number => {
    if (typeof schedule[focusedSelectionSetIndex] !== undefined) {
      return schedule[focusedSelectionSetIndex].index;
    }
    return 0;
  };

  // add a new date selection to the selection set currently in focus
  const addDateSelection = (dateSelection: DateSelection): void => {
    const index = focusedSelectionSetIndex;
    if (dateSelection.openingDate && dateSelection.closingDate) {
      const newDateSelection = new CompleteDateSelection({
        openingDate: dateSelection.openingDate,
        closingDate: dateSelection.closingDate,
        selectionSetIndex: index,
      });

      setSchedule((prevSchedule) => [
        ...prevSchedule.slice(0, index),
        new DateSelectionSet({
          index: index,
          dates: [...prevSchedule[index].dates, newDateSelection],
          color: prevSchedule[index].color,
        }),
        ...prevSchedule.slice(index + 1),
      ]);
    }
  };

  // if a day tile was assigned to a new selection set - switch selection sets in the schedule state
  const switchSelectionSets = (from: number, to: number, date: Date): void => {
    console.log(`switch selection sets
        day: ${date.toLocaleDateString('en-US')}
        from: ${from}
        to: ${to}`);

    // find and remove the date form the original date selection set
    const datesIndex = schedule[from].dates.findIndex((dateSelection) =>
      dateSelection.includesDay(date),
    );
    console.log(`   selection index of selectionSet.dates[]: `, datesIndex);
    console.log(
      `   splitting to: 
            ${schedule[from].dates[datesIndex].openingDate.toLocaleDateString(
              'en-US',
            )} - ${subtractDays(date, 1).toLocaleDateString('en-US')}
          and
            ${addDays(date, 1).toLocaleDateString('en-US')} - ${
        schedule[from].dates[datesIndex].closingDate.toLocaleDateString("en-US")
      }`,
    );
    const newDates = [
      ...schedule[from].dates.slice(0, datesIndex),
      // new selection of dates predating the removed date
      new CompleteDateSelection({
        openingDate: schedule[from].dates[datesIndex].openingDate,
        closingDate: subtractDays(date, 1),
        selectionSetIndex: schedule[from].index,
      }),
      // new selection of dates post the removed date
      new CompleteDateSelection({
        openingDate: addDays(date, 1),
        closingDate: schedule[from].dates[datesIndex].closingDate,
        selectionSetIndex: schedule[from].index,
      }),
      ...schedule[from].dates.slice(datesIndex + 1),
    ];

    // apply the date removal
    setSchedule((prevSchedule) => [
      ...prevSchedule.slice(0, from),
      new DateSelectionSet({
        index: prevSchedule[from].index,
        dates: newDates,
        color: prevSchedule[from].color,
      }),
      ...prevSchedule.slice(from + 1),
    ]);
    /*
    removeDate(date: Date): void {
    let index = this.dates.findIndex((dateSelection) =>
      dateSelection.includesDay(date),
    );
    console.log(`removeDate(${date.toLocaleDateString('en-US')})::
      dateSelection index:`, index);
    
    this.dates = 
    }
    */
  };

  // if a new selection set was added, put it in focus
  useEffect(() => {
    setFocusedSelectionSetIndex(schedule.length - 1);
  }, [schedule.length]);

  // create a new selection set and return it's index in the schedule array
  const newSelectionSet = (): number => {
    const prevScheduleLen = schedule.length;
    setSchedule((prevSchedule) => [
      ...prevSchedule,
      new DateSelectionSet({ index: prevSchedule.length }),
    ]);
    return prevScheduleLen - 1;
  };

  const selectionSets = schedule.map((selectionSet, i) => (
    <SelectionSetNav
      key={selectionSet.index}
      selectionSet={selectionSet}
      focusedSelectionSetIndex={focusedSelectionSetIndex}
      setFocusedSelectionSetIndex={setFocusedSelectionSetIndex}
    />
  ));

  return (
    <div className="schedule-picker">
      <DatePickers
        dateRange={props.dateRange}
        newSelectionSet={newSelectionSet}
        focusedSelectionSetIndex={focusedSelectionSetIndex}
        selectionSet={{
          getColor: getSelectionSetColor,
          getIndex: getSelectionSetIndex,
          addSelection: addDateSelection,
          switch: switchSelectionSets,
        }}
      />
      <div className="date-selection-sets">
        Selections so far: <br />
        {selectionSets}
        <button onClick={newSelectionSet}>New Selection Set</button>
      </div>
    </div>
  );
};

export default SchedulePicker;
