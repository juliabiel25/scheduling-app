import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePickers from './DatePickers';
import DateSelectionSet from '../utils/DateSelectionSet';
import RGBAColor from '../utils/RGBAColor';
import { generateDatesInRange } from '../utils/functions';
import DateSelection from '../utils/DateSelection';
import ScheduleNavigation from './ScheduleNavigation';

const StyledSchedulePicker = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export interface SchedulePickerProps {
  dateRange: [Date, Date];
  monthsPerPage: number;
}

const SchedulePicker: React.FC<SchedulePickerProps> = (props) => {
  const [schedule, setSchedule] = useState<DateSelectionSet[]>([
    new DateSelectionSet({ id: 1 }),
  ]);
  const [focusedSelectionSet, setFocusedSelectionSet] = useState<number>(1);

  useEffect(() => {
    console.log('focused selection set:', focusedSelectionSet);
  }, [focusedSelectionSet]);

  /**
   * Returns the assigned color of the date selection set specified by given index.
   * By default index is set to focusedSelectionSet.
   * @param {number | undefined} id - the index of a date selection set within schedule.dates[].
   * @returns {RGBAColor | undefined} - the color of the date selection set.
   */
  const getSelectionSetColor = (
    id: number = focusedSelectionSet,
  ): RGBAColor | undefined => {
    const index = getSelectionSetIndex(id);
    if (typeof schedule[index] !== 'undefined') {
      return schedule[index].color;
    }
  };

  const getSelectionSetIndex = (id: number): number => {
    return schedule.findIndex((selectionSet) => selectionSet.id === id);
  };

  /**
   * Adds the given dateSelection to the currently focused selection set
   * @param {DateSelection} dateSelection -
   */
  const addDateSelection = (dateSelection: DateSelection): void => {
    const id = focusedSelectionSet;
    if (dateSelection.openingDate && dateSelection.closingDate) {
      const dates = generateDatesInRange(
        dateSelection.openingDate,
        dateSelection.closingDate,
      );

      const index = getSelectionSetIndex(id);
      setSchedule((prevSchedule) => [
        ...prevSchedule.slice(0, index),
        new DateSelectionSet({
          id: prevSchedule[index].id,
          dates: [...prevSchedule[index].dates, ...dates],
          color: prevSchedule[index].color,
        }),
        ...prevSchedule.slice(index + 1),
      ]);
    }
  };

  // if a day tile was assigned to a new selection set - switch selection sets in the schedule state
  const removeFromSelectionSet = (id: number, date: Date): void => {
    const index = getSelectionSetIndex(id);
    setSchedule((prevSchedule) => [
      ...prevSchedule.slice(0, index),

      new DateSelectionSet({
        id: prevSchedule[index].id,
        dates: prevSchedule[index].dates.filter(
          (dateInSelection) => dateInSelection.getTime() !== date.getTime(),
        ),
        color: prevSchedule[index].color,
      }),
      ...prevSchedule.slice(index + 1),
    ]);
  };

  // if a new selection set was added, put it in focus
  useEffect(() => {
    const id = schedule[schedule.length - 1].id;
    setFocusedSelectionSet(id);
  }, [schedule.length]);

  // create a new selection set and return it's index in the schedule array
  const newSelectionSet = (): number => {
    const prevScheduleLen = schedule.length;
    setSchedule((prevSchedule) => [
      ...prevSchedule,
      new DateSelectionSet({
        id: prevSchedule[prevSchedule.length - 1].id + 1,
      }),
    ]);
    return prevScheduleLen - 1;
  };

  return (
    <StyledSchedulePicker>
      <DatePickers
        monthsPerPage={props.monthsPerPage}
        dateRange={props.dateRange}
        selectionSet={{
          getColor: getSelectionSetColor,
          getFocusedId: focusedSelectionSet,
          addSelection: addDateSelection,
          removeDate: removeFromSelectionSet,
        }}
      />
      <ScheduleNavigation
        schedule={schedule}
        newSelectionSet={newSelectionSet}
        getSelectionSetIndex={getSelectionSetIndex}
        focusedSelectionSet={focusedSelectionSet}
        setFocusedSelectionSet={setFocusedSelectionSet}
      />
    </StyledSchedulePicker>
  );
};

export default SchedulePicker;
