import Calendar from '../utils/Calendar';
import DateSelectionSet from '../utils/DateSelectionSet';
import DateSelection from '../utils/DateSelection';
import MonthRange from '../utils/MonthRange';
import RGBAColor from '../utils/RGBAColor';
import { replaceValueAtIndex } from '../utils/functions';
import { MonthIndex } from '../types/types';
import { Action } from './actions';
import { UpdatedDayProps } from '../components/DayTile';
import Day from '../utils/Day';
import { CompleteDateSelection } from '../utils/DateSelection';
import Schedule from '../utils/Schedule';

export type Calendars = { [key: string]: Calendar };

export class DatePickerState {
  dateRange = new MonthRange(null, null);
  calendars: Calendars = {};
  schedule: Schedule = new Schedule();
  // TODO assign the first created selection set as the focused one here:
  focusedSelectionSetId = Object.keys(this.schedule.selectionSetsStore)[0];
  hoverSelection = new DateSelection();
  currentlyHoveredDate: Date | null = null;
  mouseOverListening = false;
  datePickerScroll = 0;
  calendarMonths: MonthIndex[] = []; // [month, year]
  monthsPerPage = 1;

  constructor(state: Partial<DatePickerState> = {}) {
    // if some state properties are provided, overwrite the default values
    this.dateRange = state?.dateRange || this.dateRange;
    this.calendars = state?.calendars || this.calendars;
    this.schedule = state?.schedule || this.schedule;
    this.focusedSelectionSetId =
      state?.focusedSelectionSetId || this.focusedSelectionSetId;
    this.hoverSelection = state?.hoverSelection || this.hoverSelection;
    this.currentlyHoveredDate =
      state?.currentlyHoveredDate || this.currentlyHoveredDate;
    this.mouseOverListening =
      state?.mouseOverListening || this.mouseOverListening;
    this.datePickerScroll = state?.datePickerScroll || this.datePickerScroll;
    this.calendarMonths = state?.calendarMonths || this.calendarMonths;
    this.monthsPerPage = state?.monthsPerPage || this.monthsPerPage;
  }

  /**
   * Returns the assigned color of the date selection set specified by given index.
   * By default index is set to focusedSelectionSetId.
   * @param {number | undefined} id - the index of a date selection set within schedule.dates[].
   * @returns {RGBAColor | undefined} - the color of the date selection set.
   */
  getSelectionSetColor = (
    id: string = this.focusedSelectionSetId,
  ): RGBAColor | undefined => {
    return this.schedule.selectionSetsStore[id].color;
  };

  /**
   * Returns a new calendars map with changes applied to specified day
   * @param {Date} date - the date of the to-be-updated day
   * @param {UpdatedDayProps} updatedDayProps - the updated properties of the day
   * @returns {Map<MonthIndex, Calendar>} - the updated calendars map
   */
  getCalendarsWithUpdatedDay(
    date: Date,
    updatedDayProps: UpdatedDayProps,
  ): Calendars {
    // create a copy of the calendars map
    const updatedCalendars = { ...this.calendars };
    const monthIndex = new MonthIndex(date.getMonth(), date.getFullYear());
    const calendar = updatedCalendars[monthIndex.getString()];

    if (calendar) {
      const dayIndex = calendar.days.findIndex(
        (day) => day.date.getTime() === date.getTime(),
      );
      const updatedDay = calendar.days[dayIndex].copy(updatedDayProps);
      const updatedDays = replaceValueAtIndex<Day>(
        calendar.days,
        dayIndex,
        updatedDay,
      );

      const updatedCalendar = calendar.copy({
        dateRange: this.dateRange,
        overwriteDays: updatedDays,
      });

      updatedCalendars[monthIndex.getString()] = updatedCalendar;
    }

    return updatedCalendars;
  }

  getSelectionSetIdOfDate = (date: Date): string | null => {
    const selectionSets = Object.keys(this.schedule.selectionSetsStore);
    for (let id of selectionSets) {
      if (this.schedule.selectionSetsStore[id].includesDate(date)) {
        return id;
      }
    }
    return null;
  };
}

export const initialDatePickerState = new DatePickerState();

export function stateReducerWrapper(
  state: DatePickerState,
  action: Action,
): DatePickerState {
  const reducerResult = stateReducer(state, action);
  console.log(`[[ ${action.type} ]]`, {
    payload: action.payload,
    oldState: state,
    newState: reducerResult,
  });
  return reducerResult;
}

export function stateReducer(
  state: DatePickerState,
  action: Action,
): DatePickerState {
  switch (action.type) {
    case 'SET_DATE_RANGE_START': {
      // if existing final date is before the new start date, reset the final date
      if (
        state.dateRange.finalDate &&
        state.dateRange.finalDate < action.payload
      ) {
        return new DatePickerState({
          ...state,
          dateRange: new MonthRange(action.payload, null),
        });
      }
      // else, update the start date without altering the final date
      return new DatePickerState({
        ...state,
        dateRange: new MonthRange(action.payload, state.dateRange.finalDate),
      });
    }
    case 'SET_DATE_RANGE_END': {
      // if existing start date is after the new end date, reset the start date
      if (
        state.dateRange.initDate &&
        state.dateRange.initDate > action.payload
      ) {
        return new DatePickerState({
          ...state,
          dateRange: new MonthRange(null, action.payload),
        });
      }
      // else, update the end date without altering the start date
      return new DatePickerState({
        ...state,
        dateRange: new MonthRange(state.dateRange.initDate, action.payload),
      });
    }
    case 'GENERATE_CALENDARS': {
      const months: MonthIndex[] = [];
      if (state.dateRange.initDate && state.dateRange.finalDate) {
        // generate calendar data based on the date range limits
        let month = state.dateRange.initDate.getMonth();
        let year = state.dateRange.initDate.getFullYear();

        // always include the first month by default
        months.push(new MonthIndex(month, year));

        while (
          month !== state.dateRange.finalDate.getMonth() ||
          year !== state.dateRange.finalDate.getFullYear()
        ) {
          if (month === 11) {
            month = 0;
            year += 1;
          } else {
            month += 1;
          }
          months.push(new MonthIndex(month, year));
        }
      } else {
        throw new Error(
          'Cannot generate calendars before specifying the date range limits',
        );
      }

      // build the calendars map: monthIndex --> Calendar
      const calendars: Calendars = {};
      months.forEach((monthIndex) => {
        calendars[monthIndex.getString()] = new Calendar(
          monthIndex,
          state.dateRange,
        );
      });
      return new DatePickerState({
        ...state,
        calendarMonths: months,
        calendars,
      });
    }
    case 'SET_CALENDAR':
      return new DatePickerState({ ...state, calendars: action.payload });
    case 'SET_DATE_PICKER_SCROLL':
      return new DatePickerState({
        ...state,
        datePickerScroll: action.payload,
      });

    case 'SET_HOVER_SELECTION': {
      return new DatePickerState({
        ...state,
        hoverSelection:
          state.hoverSelection.edgeDates.length < 2
            ? state.hoverSelection.pushEdgeDate(action.payload)
            : new DateSelection([action.payload]),
      });
    }
    case 'START_HOVER_SELECTION': {
      return new DatePickerState({
        ...state,
        hoverSelection: new DateSelection([action.payload]),
        mouseOverListening: true,
      });
    }
    case 'SET_MOUSE_OVER_LISTENING':
      return new DatePickerState({
        ...state,
        mouseOverListening: action.payload,
      });
    case 'SET_FOCUSED_SELECTION_SET_ID':
      return new DatePickerState({
        ...state,
        focusedSelectionSetId: action.payload,
      });
    case 'ADD_NEW_SELECTION_SET_TO_SCHEDULE':
      const newSelectionSet = new DateSelectionSet();
      return new DatePickerState({
        ...state,
        schedule: state.schedule.addNewSelectionSet(newSelectionSet),
        focusedSelectionSetId: newSelectionSet.id,
      });
    case 'MARK_DAY_AS_SELECTED': {
      return new DatePickerState({
        ...state,
        calendars: state.getCalendarsWithUpdatedDay(action.payload.date, {
          isSelected: true,
          isHovered: false,
          hoverColor: null,
          color: state.getSelectionSetColor() ?? null,
        }),
      });
    }
    case 'CLEAR_DAY_SELECTION_MARKERS': {
      return new DatePickerState({
        ...state,
        calendars: state.getCalendarsWithUpdatedDay(action.payload.date, {
          isSelected: false,
          isHovered: false,
          hoverColor: null,
          color: null,
        }),
      });
    }
    case 'UPDATE_HOVER_SELECTION': {
      const hoveredDate: Date = action.payload;
      const clickedDate = state.hoverSelection.edgeDates[0];

      if (!clickedDate) return state;

      const newHoverSelection = new DateSelection([clickedDate, hoveredDate]);

      return new DatePickerState({
        ...state,
        hoverSelection: newHoverSelection,
      });
    }
    case 'SAVE_HOVER_SELECTION':
      if (state.hoverSelection.isComplete()) {
        // a copy of current state...
        return new DatePickerState({
          ...state,
          schedule: new Schedule({
            selectionSetsStore: {
              ...state.schedule.selectionSetsStore,
              //... but the hover selection is added to the focused selection set of the schedule
              [state.schedule.focusedSelectionSetId]: new DateSelectionSet({
                ...state.schedule.selectionSetsStore[
                  state.schedule.focusedSelectionSetId
                ],
              }).addDateSelectionToSet(
                state.hoverSelection as CompleteDateSelection,
              ),
            },
            focusedSelectionSetId: state.schedule.focusedSelectionSetId,
          }),
          hoverSelection: new DateSelection(),
          mouseOverListening: false,
        });
      }
      return state;

    default:
      return state;
  }
}
