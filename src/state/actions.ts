import { UpdatedDayProps } from '../components/DayTile';
import DateSelection from '../utils/DateSelection';

export type Action = { type: string; payload?: any };

export const setDateRangeStart = (date: Date): Action => ({
  type: 'SET_DATE_RANGE_START',
  payload: date,
});

export const setDateRangeEnd = (date: Date): Action => ({
  type: 'SET_DATE_RANGE_END',
  payload: date,
});

export const generateCalendars = (): Action => ({
  type: 'GENERATE_CALENDARS',
});

export const updateDay = (
  updatedDayProps: UpdatedDayProps,
  index: number,
): Action => ({
  type: 'UPDATE_DAY',
  payload: { updatedDayProps, index },
});

export const markDayAsHovered = (date: Date): Action => {
  return { type: 'MARK_DAY_AS_HOVERED', payload: { date } };
};

export const markDayAsNotHovered = (date: Date): Action => {
  return { type: 'MARK_DAY_AS_NOT_HOVERED', payload: date };
};

export const markDayAsSelected = (date: Date): Action => {
  return { type: 'MARK_DAY_AS_SELECTED', payload: date };
};

export const clearDaySelectionMarkers = (date: Date): Action => {
  return { type: 'CLEAR_DAY_SELECTION_MARKERS', payload: date };
};

//========================================================
export const setDatePickerScroll = (index: number): Action => ({
  type: 'SET_DATE_PICKER_SCROLL',
  payload: index,
});

export const removeDateFromSelectionSet = (
  previousSelectionSetId: number,
  date: Date,
): Action => ({
  type: 'REMOVE_DATE_FROM_SELECTION_SET',
  payload: { previousSelectionSetId, date },
});

export const enableMouseOverListening = (): Action => ({
  type: 'SET_MOUSE_OVER_LISTENING',
  payload: true,
});

export const disableMouseOverListening = (): Action => ({
  type: 'SET_MOUSE_OVER_LISTENING',
  payload: false,
});

export const clearCurrentlyHoveredDate = (): Action => ({
  type: 'CLEAR_CURRENTLY_HOVERED_DATE',
});

export const setHoverSelection = (newEdgeDate?: Date): Action => ({
  type: 'SET_HOVER_SELECTION',
  payload: newEdgeDate,
});

export const startHoverSelection = (newEdgeDate?: Date): Action => ({
  type: 'START_HOVER_SELECTION',
  payload: newEdgeDate,
});

export const updateHoverSelection = (hoveredDate?: Date): Action => ({
  type: 'UPDATE_HOVER_SELECTION',
  payload: hoveredDate,
});

export const setFocusedSelectionSetId = (id: string): Action => ({
  type: 'SET_FOCUSED_SELECTION_SET_ID',
  payload: id,
});

export const createNewSelectionSet = (): Action => {
  return { type: 'ADD_NEW_SELECTION_SET_TO_SCHEDULE' };
};

export const saveHoverSelection = (): Action => {
  return {
    type: 'SAVE_HOVER_SELECTION',
  };
};
