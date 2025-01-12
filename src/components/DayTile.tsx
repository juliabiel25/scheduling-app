import { useEffect, useState } from 'react';
import { useDatePickerState } from '../state/StateContext';

import DateSelection from '../utils/DateSelection';
import Day from '../utils/Day';
import RGBAColor from '../utils/RGBAColor';
import { selectionSetProp } from '../types/types';
import styled from 'styled-components';

interface StyledDayTileProps {
  tileColor: RGBAColor | null;
  isEnabled: boolean;
  isHovered: boolean;
}

const StyledDayTile = styled.div<StyledDayTileProps>`
  /* state-dependant properties */
  background-color: ${(props) =>
    !props.isEnabled
      ? 'rgb(243, 242, 242)'
      : props.isHovered
      ? props.tileColor?.opacity(0.3).toString() || null
      : props.tileColor?.opacity(0.9).toString() || null};
  border: ${(props) => (props.isEnabled ? '1px solid lightgray' : null)};
  color: ${(props) => (!props.isEnabled ? 'rgb(163, 163, 163)' : null)};

  /* static properties */
  display: flex;
  align-content: center;
  justify-content: center;
  margin: 3px;
  padding: 0.5rem;
  border-radius: 50%;
  width: 1.4rem;
  height: 1.4rem;
  transition: background-color 0.4s ease-out, box-shadow 0.2s ease-out;
  &:hover {
    ${(props) =>
      props.isEnabled
        ? `box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
      rgba(60, 64, 67, 0.15) 0 4px 8px 3px;`
        : null}
  }
`;

export type UpdatedDayProps = {
  date?: Date;
  isSelected?: boolean;
  isEnabled?: boolean;
  isHovered?: boolean;
  isCurrentMonth?: boolean;
  selectionSetIndex?: number | null;
  color?: RGBAColor | null;
  hoverColor?: RGBAColor | null;
};

export interface DayTileProps {
  day: Day;
  updateDay: (props: UpdatedDayProps) => void;
}

const DayTile = ({ day, updateDay }: DayTileProps) => {
  const {
    state: {
      selectionSetId,
      previousSelectionSetId,
      hoverSelection,
      activeSelection,
      focusedSelectionSet,
      getSelectionSetColor,
    },
    dispatch,
  } = useDatePickerState();

  // on selectionSetId change remove the date from the previous selection set
  // and check whether the tile is on the selection edge
  useEffect(() => {
    if (
      previousSelectionSetId &&
      selectionSetId &&
      previousSelectionSetId !== selectionSetId
    ) {
      dispatch({
        type: 'REMOVE_DATE_FROM_SELECTION_SET',
        payload: { previousSelectionSetId, date: day.date },
      });
    }
  }, [selectionSetId]);

  // mark day as hovered or not on hoverSelection change
  useEffect(() => {
    if (hoverSelection && day.isEnabled) {
      // if a selection was started and the day falls between the opening of the active selection and the hovered date (or the other way aroung)
      if (
        activeSelection.openingDate &&
        ((day.date <= hoverSelection &&
          day.date >= activeSelection.openingDate) ||
          (day.date >= hoverSelection &&
            day.date <= activeSelection.openingDate))
      ) {
        // record that the 'day' is hovered (if it's not marked as hovered already)
        if (!day.isHovered) {
          updateDay({
            isHovered: true,
            hoverColor: getSelectionSetColor(),
          });
        }
      } else {
        // if 'day' was previously hovered but no longer falls between the current hover selection - unhover it
        if (day.isHovered) {
          updateDay({ isHovered: false, hoverColor: null });
        }
      }
    }
  }, [hoverSelection]);

  // mark day as selected on activeSelection change
  useEffect(() => {
    if (
      day.isEnabled &&
      activeSelection.openingDate &&
      activeSelection.closingDate &&
      ((day.date <= activeSelection.closingDate &&
        day.date >= activeSelection.openingDate) ||
        (day.date >= activeSelection.openingDate &&
          day.date <= activeSelection.closingDate))
    ) {
      dispatch({
        type: 'UPDATE_SELECTION_SET_SEQUENCE',
      });

      updateDay({
        isSelected: true,
        isHovered: false,
        hoverColor: null,
        color: getSelectionSetColor() ?? null,
        selectionSetIndex: focusedSelectionSet,
      });
    }
  }, [activeSelection]);

  function dayTileClicked() {
    // if the active selection is already closed - make a new selection
    if (activeSelection.isBlank() || activeSelection.isComplete()) {
      let newSelection = new DateSelection({
        openingDate: day.date,
      });
      dispatch({ type: 'SET_ACTIVE_SELECTION', payload: newSelection });

      // mark the first tile of the hover selection as hovered immediately
      updateDay({
        isHovered: true,
        hoverColor: getSelectionSetColor() ?? null,
      });

      // toggle on the onmouse event listener
      dispatch({ type: 'SET_MOUSE_OVER_LISTENING', payload: true });
    }

    // complete the active selection if it's been incomplete
    else if (activeSelection.isIncomplete()) {
      let prevOpeningDate = activeSelection.openingDate;
      let newSelection = new DateSelection({});

      // make sure the selection works both ways (later date -> earlier date and the reverse)
      if (prevOpeningDate && prevOpeningDate > day.date) {
        newSelection.openingDate = day.date;
        newSelection.closingDate = prevOpeningDate;
      } else if (prevOpeningDate && prevOpeningDate <= day.date) {
        newSelection.openingDate = prevOpeningDate;
        newSelection.closingDate = day.date;
      }

      dispatch({ type: 'SET_ACTIVE_SELECTION', payload: newSelection });
      // hoverSelection.set(null);
      dispatch({ type: 'CLEAR_HOVER_SELECTION' });

      // toggle off the onmouse event listener
      dispatch({ type: 'SET_MOUSE_OVER_LISTENING', payload: false });
    }
  }

  // if tile is hovered --> set hover selection state
  function dayTileHovered(date: Date) {
    dispatch({ type: 'SET_HOVER_SELECTION', payload: date });
  }

  return (
    <StyledDayTile
      className="no-select"
      tileColor={day.hoverColor ?? day.color}
      isEnabled={day.isEnabled}
      isHovered={day.isHovered}
      onClick={day.isEnabled ? dayTileClicked : undefined}
      onMouseOver={
        activeSelection.isIncomplete()
          ? () => dayTileHovered(day.date)
          : undefined
      }
    >
      {day.date.getDate()}
    </StyledDayTile>
  );
};

export default DayTile;
