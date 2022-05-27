import DatePickers from './DatePickers';
import React, { useState, useEffect } from 'react';
import '../styles/SchedulePicker.css';
import DateSelectionSet from '../utils/DateSelectionSet';
import SelectionSetNav from './SelectionSetNavigation';
import RGBAColor from '../utils/RGBAColor';
import {
  addDays,
  subtractDays,
  generateDatesInRange,
} from '../utils/functions';
import DateSelection, { CompleteDateSelection } from '../utils/DateSelection';
import SelectionSetNavigation from './SelectionSetNavigation';

export interface SchedulePickerProps {
  dateRange: [Date, Date];
}

const SchedulePicker: React.FC<SchedulePickerProps> = (props) => {
  const [schedule, setSchedule] = useState<DateSelectionSet[]>([
    new DateSelectionSet({ index: 0 }),
  ]);
  const [focusedSelectionSetIndex, setFocusedSelectionSetIndex] =
    useState<number>(0);

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
      const dates = generateDatesInRange(
        dateSelection.openingDate,
        dateSelection.closingDate,
      );

      setSchedule((prevSchedule) => [
        ...prevSchedule.slice(0, index),
        new DateSelectionSet({
          index: index,
          dates: [...prevSchedule[index].dates, ...dates],
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

    // find and remove the date from the original date selection set
    // const newDates = schedule[from].dates.filter(
    //   (dateInSelection) => dateInSelection.getTime() !== date.getTime(),
    // );

    setSchedule((prevSchedule) => [
      ...prevSchedule.slice(0, from),

      new DateSelectionSet({
        index: prevSchedule[from].index,
        dates: prevSchedule[from].dates.filter(
          (dateInSelection) => dateInSelection.getTime() !== date.getTime(),
        ),
        color: prevSchedule[from].color,
      }),
      ...prevSchedule.slice(from + 1),
    ]);
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

  return (
    <div className="schedule-picker">
      <DatePickers
        dateRange={props.dateRange}
        focusedSelectionSetIndex={focusedSelectionSetIndex}
        selectionSet={{
          getColor: getSelectionSetColor,
          getIndex: getSelectionSetIndex,
          addSelection: addDateSelection,
          switch: switchSelectionSets,
        }}
      />
      <SelectionSetNavigation
        schedule={schedule}
        newSelectionSet={newSelectionSet}
        focusedSelectionSetIndex={focusedSelectionSetIndex}
        setFocusedSelectionSetIndex={setFocusedSelectionSetIndex}
      />
    </div>
  );
};

export default SchedulePicker;
