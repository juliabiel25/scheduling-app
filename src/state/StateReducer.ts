import Calendar from '../utils/Calendar';
import DateSelectionSet from '../utils/DateSelectionSet';
import DateSelection from '../utils/DateSelection';
import MonthRange from '../utils/MonthRange';
import RGBAColor from '../utils/RGBAColor';
import { generateDatesInRange, replaceValueAtIndex } from '../utils/functions';

export class DatePickerState {
  dateRange = new MonthRange(null, null);
  calendar: Calendar | null = null;
  schedule = [new DateSelectionSet({ id: 1 })];
  focusedSelectionSet = 1;
  activeSelection = new DateSelection({
    selectionSetIndex: this.focusedSelectionSet,
  });
  hoverSelection: Date | null = null;
  mouseOverListening = false;
  datePickerScroll = 0;
  calendarData: [number, number][] = []; // [month, year]

  selectionSetId: number | null = null;
  previousSelectionSetId: number | null = null;

  constructor(state: Partial<DatePickerState> = {}) {
    // if some state properties are provided, overwrite the default values
    this.dateRange = state?.dateRange || this.dateRange;
    this.calendar = state?.calendar || this.calendar;
    this.schedule = state?.schedule || this.schedule;
    this.focusedSelectionSet =
      state?.focusedSelectionSet || this.focusedSelectionSet;
    this.activeSelection = state?.activeSelection || this.activeSelection;
    this.hoverSelection = state?.hoverSelection || this.hoverSelection;
    this.mouseOverListening =
      state?.mouseOverListening || this.mouseOverListening;
    this.datePickerScroll = state?.datePickerScroll || this.datePickerScroll;
    this.calendarData = state?.calendarData || this.calendarData;
  }

  getSelectionSetIndex = (id: number): number => {
    return this.schedule.findIndex((selectionSet) => selectionSet.id === id);
  };

  /**
   * Returns the assigned color of the date selection set specified by given index.
   * By default index is set to focusedSelectionSet.
   * @param {number | undefined} id - the index of a date selection set within schedule.dates[].
   * @returns {RGBAColor | undefined} - the color of the date selection set.
   */
  getSelectionSetColor = (
    id: number = this.focusedSelectionSet,
  ): RGBAColor | undefined => {
    const index = this.getSelectionSetIndex(id);
    if (typeof this.schedule[index] !== 'undefined') {
      return this.schedule[index].color;
    }
  };

  /**
   * Adds the given dateSelection to the currently focused selection set
   * @param {DateSelection} dateSelection
   */
  addDateSelection(dateSelection: DateSelection): void {
    const id = this.focusedSelectionSet;
    if (dateSelection.openingDate && dateSelection.closingDate) {
      const dates = generateDatesInRange(
        dateSelection.openingDate,
        dateSelection.closingDate,
      );

      const index = this.getSelectionSetIndex(id);
      this.schedule = [
        ...this.schedule.slice(0, index),
        new DateSelectionSet({
          id: this.schedule[index].id,
          dates: [...this.schedule[index].dates, ...dates],
          color: this.schedule[index].color,
        }),
        ...this.schedule.slice(index + 1),
      ];
    }
  }

  // if a day tile was assigned to a new selection set - switch selection sets in the schedule state
  removeFromSelectionSet(id: number, date: Date): void {
    const index = this.getSelectionSetIndex(id);
    this.schedule = [
      ...this.schedule.slice(0, index),

      new DateSelectionSet({
        id: this.schedule[index].id,
        dates: this.schedule[index].dates.filter(
          (dateInSelection) => dateInSelection.getTime() !== date.getTime(),
        ),
        color: this.schedule[index].color,
      }),
      ...this.schedule.slice(index + 1),
    ];
  }
}

export const initialDatePickerState = new DatePickerState();

export function stateReducer(
  state: DatePickerState,
  action?: any,
): DatePickerState {
  console.log(`[[ ${action.type} ]]`, action.payload);

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
    case 'SET_CALENDAR':
      return new DatePickerState({ ...state, calendar: action.payload });
    case 'SET_CALENDAR_DATA':
      return new DatePickerState({ ...state, calendarData: action.payload });
    case 'SET_DATE_PICKER_SCROLL':
      return new DatePickerState({
        ...state,
        datePickerScroll: action.payload,
      });
    case 'SET_ACTIVE_SELECTION': {
      const newActiveSelection = action.payload;
      let updatedSchedule = state.schedule;

      // is the new avtive selection is complete - add it to the currently in-focus selection set
      if (newActiveSelection.isComplete()) {
        const { focusedSelectionSet } = state;
        const dates = generateDatesInRange(
          newActiveSelection.openingDate,
          newActiveSelection.closingDate,
        );

        const index = state.getSelectionSetIndex(focusedSelectionSet);
        updatedSchedule = replaceValueAtIndex(
          state.schedule,
          index,
          new DateSelectionSet({
            id: state.schedule[index].id,
            dates: [...state.schedule[index].dates, ...dates],
            color: state.schedule[index].color,
          }),
        );
      }

      return new DatePickerState({
        ...state,
        activeSelection: action.payload,
        schedule: updatedSchedule,
      });
    }
    case 'SET_HOVER_SELECTION':
      return new DatePickerState({
        ...state,
        hoverSelection: action.payload,
      });
    case 'CLEAR_HOVER_SELECTION':
      return new DatePickerState({
        ...state,
        hoverSelection: null,
      });
    case 'SET_MOUSE_OVER_LISTENING':
      return new DatePickerState({
        ...state,
        mouseOverListening: action.payload,
      });
    case 'SET_FOCUSED_SELECTION_SET':
      return new DatePickerState({
        ...state,
        focusedSelectionSet: action.payload,
      });
    case 'UPDATE_DAY': {
      const newDay = action.payload.day;
      const dayIndex = action.payload.index;
      return new DatePickerState({
        ...state,
        calendar: state.calendar?.copy({
          dateRange: state.dateRange,
          overwriteDays: replaceValueAtIndex(
            state.calendar.days,
            dayIndex,
            newDay,
          ),
        }),
      });
    }
    case 'ADD_SELECTION_TO_FOCUSED_SELECTION_SET': {
      const dateSelection = action.payload;
      const id = state.focusedSelectionSet;
      if (dateSelection.openingDate && dateSelection.closingDate) {
        const dates = generateDatesInRange(
          dateSelection.openingDate,
          dateSelection.closingDate,
        );

        const index = state.getSelectionSetIndex(id);
        return new DatePickerState({
          ...state,
          schedule: replaceValueAtIndex(
            state.schedule,
            index,
            new DateSelectionSet({
              id: state.schedule[index].id,
              dates: [...state.schedule[index].dates, ...dates],
              color: state.schedule[index].color,
            }),
          ),
        });
      }
      return state;
    }
    case 'REMOVE_DATE_FROM_SELECTION_SET': {
      const { id, date } = action.payload;
      const index = state.getSelectionSetIndex(id);

      return new DatePickerState({
        ...state,
        schedule: replaceValueAtIndex(
          state.schedule,
          index,
          new DateSelectionSet({
            id: state.schedule[index].id,
            dates: state.schedule[index].dates.filter(
              (dateInSelection) => dateInSelection.getTime() !== date.getTime(),
            ),
            color: state.schedule[index].color,
          }),
        ),
      });
    }

    case 'UPDATE_SELECTION_SET_SEQUENCE': {
      return new DatePickerState({
        ...state,
        previousSelectionSetId: state.selectionSetId,
        selectionSetId: state.focusedSelectionSet,
      });
    }

    default:
      return state;
  }
}
