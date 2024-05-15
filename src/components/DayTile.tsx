import { useEffect, useState } from 'react';

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
  setDay?: (day: Day) => void;
  updateDay: (props: UpdatedDayProps) => void;
  hoverSelection: {
    value: Date | null;
    set: (date: Date | null) => void;
  };
  activeSelection: {
    value: DateSelection;
    set: (selection: DateSelection) => void;
  };
  mouseOverListening: {
    value: boolean;
    set: (listen: boolean) => void;
  };
  selectionSet: selectionSetProp;
}

const DayTile = ({
  day,
  setDay,
  updateDay,
  hoverSelection,
  activeSelection,
  mouseOverListening,
  selectionSet,
}: DayTileProps) => {
  const [selectionSetId, setSelectionSetId] = useState<number | undefined>();
  const [prevSelectionSetId, setPrevSelectionSetId] = useState<
    number | undefined
  >();

  // on selectionSetId change remove the date from the previous selection set
  // and check whether the tile is on the selection edge
  useEffect(() => {
    if (
      prevSelectionSetId !== undefined &&
      selectionSetId !== undefined &&
      prevSelectionSetId !== selectionSetId
    ) {
      selectionSet.removeDate(prevSelectionSetId, day.date);
      // setSelectionEdge(props.isSelectionEdge(day.date, selectionSetId));
    }
  }, [selectionSetId]);

  // mark day as hovered or not on hoverSelection change
  useEffect(() => {
    if (hoverSelection.value && day.isEnabled) {
      // if a selection was started and the day falls between the opening of the active selection and the hovered date (or the other way aroung)
      if (
        activeSelection.value.openingDate &&
        ((day.date <= hoverSelection.value &&
          day.date >= activeSelection.value.openingDate) ||
          (day.date >= hoverSelection.value &&
            day.date <= activeSelection.value.openingDate))
      ) {
        // record that the 'day' is hovered (if it's not marked as hovered already)
        if (!day.isHovered) {
          updateDay({ isHovered: true, hoverColor: selectionSet.getColor() });
        }
      } else {
        // if 'day' was previously hovered but no longer falls between the current hover selection - unhover it
        if (day.isHovered) {
          updateDay({ isHovered: false, hoverColor: null });
        }
      }
    }
  }, [hoverSelection.value]);

  // mark day as selected on activeSelection change
  useEffect(() => {
    if (
      day.isEnabled &&
      activeSelection.value.openingDate &&
      activeSelection.value.closingDate &&
      ((day.date <= activeSelection.value.closingDate &&
        day.date >= activeSelection.value.openingDate) ||
        (day.date >= activeSelection.value.openingDate &&
          day.date <= activeSelection.value.closingDate))
    ) {
      setSelectionSetId((prevId) => {
        setPrevSelectionSetId(prevId);
        return selectionSet.getFocusedId;
      });

      updateDay({
        isSelected: true,
        isHovered: false,
        hoverColor: null,
        color: selectionSet.getColor() ?? null,
        selectionSetIndex: selectionSet.getFocusedId,
      });
    }
  }, [activeSelection.value]);

  function dayTileClicked() {
    // if the active selection is already closed - make a new selection
    if (activeSelection.value.isBlank() || activeSelection.value.isComplete()) {
      let newSelection = new DateSelection({
        openingDate: day.date,
      });
      activeSelection.set(newSelection);

      // mark the first tile of the hover selection as hovered immediately

      updateDay({
        isHovered: true,
        hoverColor: selectionSet.getColor() ?? null,
      });

      // toggle on the onmouse event listener
      mouseOverListening.set(true);
    }

    // complete the active selection if it's been incomplete
    else if (activeSelection.value.isIncomplete()) {
      let prevOpeningDate = activeSelection.value.openingDate;
      let newSelection = new DateSelection({});

      // make sure the selection works both ways (later date -> earlier date and the reverse)
      if (prevOpeningDate && prevOpeningDate > day.date) {
        newSelection.openingDate = day.date;
        newSelection.closingDate = prevOpeningDate;
      } else if (prevOpeningDate && prevOpeningDate <= day.date) {
        newSelection.openingDate = prevOpeningDate;
        newSelection.closingDate = day.date;
      }

      activeSelection.set(newSelection);
      hoverSelection.set(null);

      // toggle off the onmouse event listener
      mouseOverListening.set(false);
    }
  }

  // if tile is hovered --> set hover selection state
  function dayTileHovered(date: Date) {
    hoverSelection.set(date);
  }

  return (
    <StyledDayTile
      className="no-select"
      tileColor={day.hoverColor ?? day.color}
      isEnabled={day.isEnabled}
      isHovered={day.isHovered}
      onClick={day.isEnabled ? dayTileClicked : undefined}
      onMouseOver={
        activeSelection.value.isIncomplete()
          ? () => dayTileHovered(day.date)
          : undefined
      }
    >
      {day.date.getDate()}
    </StyledDayTile>
  );
};

export default DayTile;
