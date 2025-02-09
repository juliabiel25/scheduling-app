import { useDatePickerState } from '../state/StateContext';

import Day from '../utils/Day';
import RGBAColor from '../utils/RGBAColor';
import styled from 'styled-components';
import {
  startHoverSelection,
  updateHoverSelection,
  saveHoverSelection,
} from '../state/actions';
interface StyledDayTileProps {
  tileColor?: RGBAColor;
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
  // selectionSetIndex?: number | null;
  color?: RGBAColor | null;
  hoverColor?: RGBAColor | null;
};

export interface DayTileProps {
  day: Day;
}

const DayTile = ({ day }: DayTileProps) => {
  const {
    state: {
      hoverSelection,
      mouseOverListening,
      getSelectionSetColor,
      focusedSelectionSetId,
      getSelectionSetIdOfDate,
    },
    dispatch,
  } = useDatePickerState();

  function handleDayTileClick() {
    // if the hover selection has already been started, add the now complete selection to the selection set and reset the hover selection
    if (hoverSelection.isBlank()) {
      dispatch(startHoverSelection(day.date));
    }

    if (hoverSelection.isComplete()) {
      dispatch(saveHoverSelection());
    }
  }

  // if tile is hovered --> set hover selection state
  function handleDayTileHover() {
    dispatch(updateHoverSelection(day.date));
  }

  function getTileColor() {
    const selectionSetId = getSelectionSetIdOfDate(day.date);
    if (hoverSelection.includesDate(day.date)) {
      return getSelectionSetColor(focusedSelectionSetId);
    }
    if (selectionSetId) {
      return getSelectionSetColor(selectionSetId);
    }
  }

  return (
    <StyledDayTile
      className="no-select"
      tileColor={getTileColor()}
      isEnabled={day.isEnabled}
      isHovered={hoverSelection.includesDate(day.date)}
      onClick={day.isEnabled ? handleDayTileClick : undefined}
      onMouseOver={
        mouseOverListening && day.isEnabled ? handleDayTileHover : undefined
      }
    >
      {day.date.getDate()}
    </StyledDayTile>
  );
};

export default DayTile;
