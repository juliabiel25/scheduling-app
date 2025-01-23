import { useEffect } from 'react';
import { useDatePickerState } from '../state/StateContext';

import Day from '../utils/Day';
import RGBAColor from '../utils/RGBAColor';
import styled from 'styled-components';
import {
  disableMouseOverListening,
  enableMouseOverListening,
  markDayAsHovered,
  markDayAsNotHovered,
  setCurrentlyHoveredDate,
  markDayAsSelected,
  setHoverSelection,
} from '../state/actions';

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
}

const DayTile = ({ day }: DayTileProps) => {
  const {
    state: { currentlyHoveredDate, hoverSelection },
    dispatch,
  } = useDatePickerState();

  // mark day as hovered or not on hoverSelection change
  useEffect(() => {
    if (currentlyHoveredDate && day.isEnabled) {
      // if a selection was started and the day falls between the opening of the hover selection and the hovered date (or the other way aroung)
      if (
        hoverSelection.openingDate &&
        ((day.date <= currentlyHoveredDate &&
          day.date >= hoverSelection.openingDate) ||
          (day.date >= currentlyHoveredDate &&
            day.date <= hoverSelection.openingDate))
      ) {
        // record that the 'day' is hovered (if it's not marked as hovered already)
        if (!day.isHovered) {
          dispatch(markDayAsHovered(day.date));
        }
      } else {
        // if 'day' was previously hovered but no longer falls between the current hover selection - unhover it
        if (day.isHovered) {
          dispatch(markDayAsNotHovered(day.date));
        }
      }
    }
  }, [
    currentlyHoveredDate,
    hoverSelection.openingDate,
    hoverSelection.closingDate,
  ]);

  // mark day as selected on hoverSelection change
  useEffect(() => {
    if (
      day.isEnabled &&
      hoverSelection.openingDate &&
      hoverSelection.closingDate &&
      ((day.date <= hoverSelection.closingDate &&
        day.date >= hoverSelection.openingDate) ||
        (day.date >= hoverSelection.openingDate &&
          day.date <= hoverSelection.closingDate))
    ) {
      dispatch(markDayAsSelected(day.date));
    }
  }, [hoverSelection]);

  function dayTileClicked() {
    // if the hover selection is already closed - make a new selection
    if (hoverSelection.isBlank() || hoverSelection.isComplete()) {
      // mark the first tile of the hover selection as hovered immediately
      dispatch(markDayAsHovered(day.date));

      // toggle on the onmouse event listener
      dispatch(enableMouseOverListening());
    } else if (hoverSelection.isIncomplete()) {
      // matk the last tile of the hover selection as not hovered immediately after click
      dispatch(markDayAsNotHovered(day.date));

      // toggle off the onmouse event listener
      dispatch(disableMouseOverListening());
    }
    dispatch(setHoverSelection(day.date));
  }

  // if tile is hovered --> set hover selection state
  function dayTileHovered(date: Date) {
    dispatch(setCurrentlyHoveredDate(date));
    dispatch(setHoverSelection(date));
  }

  return (
    <StyledDayTile
      className="no-select"
      tileColor={day.hoverColor ?? day.color}
      isEnabled={day.isEnabled}
      isHovered={day.isHovered}
      onClick={day.isEnabled ? dayTileClicked : undefined}
      onMouseOver={
        hoverSelection.isIncomplete()
          ? () => dayTileHovered(day.date)
          : undefined
      }
    >
      {day.date.getDate()}
    </StyledDayTile>
  );
};

export default DayTile;
