import { useState, useEffect } from 'react';
import { selectionSetProp } from '../types/types';
import DateSelection from '../utils/DateSelection';
import Day from '../utils/Day';
import RGBAColor from '../utils/RGBAColor';

export interface DayTileProps {
  day: {
    value: Day;
    set: (day: Day) => void;
  };
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
  // isSelectionEdge: (date: Date, selectionSetId: number) => string | boolean;
}

const DayTile: React.FC<DayTileProps> = (props) => {
  let day = props.day.value;
  const setDay = props.day.set;

  const [color, setColor] = useState<RGBAColor | undefined>();
  const [prevColor, setPrevColor] = useState<RGBAColor | undefined>();
  const [selectionSetId, setSelectionSetId] = useState<number | undefined>();
  const [prevSelectionSetId, setPrevSelectionSetId] = useState<
    number | undefined
  >();
  const [selectionEdge, setSelectionEdge] = useState<string | boolean>(false);

  // on selectionSetId change remove the date from the previous selection set
  // and check whether the tile is on the selection edge
  useEffect(() => {
    if (
      prevSelectionSetId !== undefined &&
      selectionSetId !== undefined &&
      prevSelectionSetId !== selectionSetId
    ) {
      props.selectionSet.removeDate(prevSelectionSetId, day.date);
      // setSelectionEdge(props.isSelectionEdge(day.date, selectionSetId));
    }
  }, [selectionSetId]);

  // mark day as hovered or not on hoverSelection change
  useEffect(() => {
    if (props.hoverSelection.value && day.isEnabled) {
      if (
        props.activeSelection.value.openingDate &&
        ((day.date <= props.hoverSelection.value &&
          day.date >= props.activeSelection.value.openingDate) ||
          (day.date >= props.hoverSelection.value &&
            day.date <= props.activeSelection.value.openingDate))
      ) {
        if (!day.isHovered) {
          let newDay = day;
          newDay.isHovered = true;
          setDay(newDay);
          setColor((prevColor) => {
            setPrevColor(prevColor);
            return props.selectionSet.getColor();
          });
        }
      } else {
        // if day is outside the current hover selection
        if (day.isHovered) {
          let newDay = day;
          newDay.isHovered = false;
          setDay(newDay);
          setColor(prevColor);
        }
      }
    }
  }, [props.hoverSelection.value]);

  // mark day as selected on activeSelection change
  useEffect(() => {
    if (
      day.isEnabled &&
      props.activeSelection.value.openingDate &&
      props.activeSelection.value.closingDate &&
      ((day.date <= props.activeSelection.value.closingDate &&
        day.date >= props.activeSelection.value.openingDate) ||
        (day.date >= props.activeSelection.value.openingDate &&
          day.date <= props.activeSelection.value.closingDate))
    ) {
      setColor(props.selectionSet.getColor());
      setSelectionSetId(prevId => {
        setPrevSelectionSetId(prevId);
        return props.selectionSet.getFocusedId;
      });

      let newDay = day;
      newDay.isSelected = true;
      newDay.isHovered = false;
      setDay(newDay);
    }
  }, [props.activeSelection.value]);

  function dayTileClicked() {
    setColor((prevColor) => {
      setPrevColor(prevColor);
      return props.selectionSet.getColor();
    });

    // if the active selection is not incomplete - make a new selection
    if (
      props.activeSelection.value.isBlank() ||
      props.activeSelection.value.isComplete()
    ) {
      let newSelection = new DateSelection({
        openingDate: day.date,
      });
      props.activeSelection.set(newSelection);

      // mark the first tile of the hover selection as hovered immediately
      setDay({ ...day, isHovered: true });

      // toggle on the onmouse event listener
      props.mouseOverListening.set(true);
    }

    // complete the active selection if it's been incomplete
    else if (props.activeSelection.value.isIncomplete()) {
      let prevOpeningDate = props.activeSelection.value.openingDate;
      let newSelection = new DateSelection({});

      // make sure the selection works both ways (later date -> earlier date and the reverse)
      if (prevOpeningDate && prevOpeningDate > day.date) {
        newSelection.openingDate = day.date;
        newSelection.closingDate = prevOpeningDate;
      } else if (prevOpeningDate && prevOpeningDate <= day.date) {
        newSelection.openingDate = prevOpeningDate;
        newSelection.closingDate = day.date;
      }

      props.activeSelection.set(newSelection);
      props.hoverSelection.set(null);

      // toggle off the onmouse event listener
      props.mouseOverListening.set(false);
    }
  }

  // if tile is hovered --> set hover selection state
  function dayTileHovered(date: Date) {
    props.hoverSelection.set(date);
  }

  return (
    <div
      key={`${day.isCurrentMonth.toString()}-${day.date.toString()}`}
      className={`day-tile 
                ${day.isEnabled ? 'tile-enabled' : 'tile-disabled'} 
                ${
                  day.isCurrentMonth
                    ? 'current-month-tile'
                    : 'previousMonthTile'
                }
                ${day.isHovered && !day.color ? 'tile-hovered' : ''}
                ${
                  selectionEdge === 'left'
                    ? 'selection-edge-left'
                    : selectionEdge === 'right'
                    ? 'selection-edge-right'
                    : ''
                }`}
      onClick={day.isEnabled ? dayTileClicked : undefined}
      onMouseOver={
        props.activeSelection.value.isIncomplete()
          ? () => dayTileHovered(day.date)
          : undefined
      }
      style={
        day.isHovered
          ? {
              // backgroundColor: new RGBAColor({
              //   ...color,
              //   alpha: 0.4,
              // }).toString(),
              backgroundColor: color?.opacity(0.4).toString(),
            }
          : day.isSelected
          ? { backgroundColor: color?.toString() }
          : {}
      }
    >
      {day.date.getDate()}
    </div>
  );
};

export default DayTile;
