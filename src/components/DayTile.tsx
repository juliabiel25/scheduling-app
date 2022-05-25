import { useState, useEffect, useRef } from 'react';
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
}

const DayTile: React.FC<DayTileProps> = (props) => {
  let day = props.day.value;
  const setDay = props.day.set;

  const [prevColor, setPrevColor] = useState<RGBAColor | undefined>();
  const [color, setColor] = useState<RGBAColor | undefined>(
    props.selectionSet.getColor(),
  );
  const [selectionSetIndex, setSelectionSetIndex] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    console.log('selectionSetIndex changed:', selectionSetIndex);
  }, [selectionSetIndex]);

  useEffect(() => {
    console.log('color changed!', {});
  }, [color]);

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
            // return props.selectionSet.getColor();
            return new RGBAColor({red:100, green: 210, blue: 99, alpha: 1.});
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
      let newDay = day;
      newDay.isSelected = true;
      newDay.isHovered = false;
      setColor(props.selectionSet.getColor());
      setSelectionSetIndex(props.selectionSet.getIndex());
      setDay(newDay);
    }
  }, [props.activeSelection.value]);

  function dayTileClicked() {
    // if the active selection is not incomplete - make a new selection
    if (
      props.activeSelection.value.blank() ||
      props.activeSelection.value.complete()
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
    else if (props.activeSelection.value.incomplete()) {
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
                ${day.isHovered && !day.color ? 'tile-hovered' : ''}`}
      onClick={day.isEnabled ? dayTileClicked : undefined}
      onMouseOver={
        props.activeSelection.value.incomplete()
          ? () => dayTileHovered(day.date)
          : undefined
      }
      style={
        day.isHovered
          ? {
              backgroundColor: new RGBAColor({
                ...color,
                alpha: 0.4,
              }).toString(),
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
