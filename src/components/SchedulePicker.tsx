import DatePickers from './DatePickers';
import React, { useState, useEffect } from 'react';
import '../styles/SchedulePicker.css';
import DateSelectionSet from '../utils/DateSelectionSet';
import RGBAColor from '../utils/RGBAColor';
import {
  generateDatesInRange,
} from '../utils/functions';
import DateSelection from '../utils/DateSelection';
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
   * Returns the assigned color of the date selection set specified by given index.
   * By default index is set to focusedSelectionSetIndex.
   * @param {number | undefined} index - the index of a date selection set within schedule.dates[].
   * @returns {RGBAColor | undefined} - the color of the date selection set.
   */
  const getSelectionSetColor = (
    index: number = focusedSelectionSetIndex,
  ): RGBAColor | undefined => {
    if (typeof schedule[index] !== 'undefined') {
      return schedule[index].color;
    }
  };

  const getSelectionSetIndex = (): number => {
    if (typeof schedule[focusedSelectionSetIndex] !== 'undefined') {
      return schedule[focusedSelectionSetIndex].index;
    }
    return 0;
  };

  /**
   * Adds the given dateSelection to the currently focused selection set
   * @param {DateSelection} dateSelection -
   */
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
  const removeFromSelectionSet = (setIndex: number, date: Date): void => {
    setSchedule((prevSchedule) => [
      ...prevSchedule.slice(0, setIndex),

      new DateSelectionSet({
        index: prevSchedule[setIndex].index,
        dates: prevSchedule[setIndex].dates.filter(
          (dateInSelection) => dateInSelection.getTime() !== date.getTime(),
        ),
        color: prevSchedule[setIndex].color,
      }),
      ...prevSchedule.slice(setIndex + 1),
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
          removeDate: removeFromSelectionSet,
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
