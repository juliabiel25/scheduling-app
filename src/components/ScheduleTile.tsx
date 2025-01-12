import React, { useEffect, useState } from 'react';
import { useDatePickerState } from '../state/StateContext';

import { CompleteDateSelection } from '../utils/DateSelection';
import DateSelectionSet from '../utils/DateSelectionSet';
import RGBAColor from '../utils/RGBAColor';
import { generateDateSelections } from '../utils/functions';
import styled from 'styled-components';

interface StyledDateSelectionSetProps {
  isFocused: boolean;
  selectionColor: RGBAColor;
}

const StyledDateSelectionSet = styled.div<StyledDateSelectionSetProps>`
  /* style-dependant properties */
  background-color: ${(props) => props.selectionColor.opacity(0.3).toString()};

  left: ${(props) => (props.isFocused ? '1em' : '0')};

  outline: ${(props) =>
    props.isFocused ? `3px solid ${props.selectionColor.toString()}` : null};

  outline-offset: ${(props) => (props.isFocused ? '-3px' : null)};

  ${(props) => (!props.isFocused ? '&:hover { left: 1em; }' : null)}

  /* static properties */
  position: relative;
  padding: 0.7rem;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
  transition: left 0.15s ease-in;
`;

export interface ScheduleTileProps {
  selectionSet: DateSelectionSet;
}

const ScheduleTile = (props: ScheduleTileProps) => {
  const [dateSelections, setDateSelections] = useState<CompleteDateSelection[]>(
    [],
  );

  const { state, dispatch } = useDatePickerState();

  const selectionSetClicked = (): void => {
    dispatch({
      type: 'SET_FOCUSED_SELECTION_SET',
      payload: props.selectionSet.id,
    });
  };

  useEffect(() => {
    setDateSelections(
      generateDateSelections(
        props.selectionSet.dates,

        state.getSelectionSetIndex(props.selectionSet.id),
      ),
    );
  }, [props.selectionSet]);

  const dateSelectionJSX =
    dateSelections.length === 0 ? (
      <div className="date-selection">...</div>
    ) : (
      dateSelections.map((selection) => (
        <div className="date-selection" key={selection.toString()}>
          {selection.openingDate.toLocaleDateString() +
            ' - ' +
            selection.closingDate.toLocaleDateString()}
        </div>
      ))
    );

  return (
    <StyledDateSelectionSet
      onClick={selectionSetClicked}
      isFocused={state.focusedSelectionSet === props.selectionSet.id}
      selectionColor={props.selectionSet.color}
    >
      {dateSelectionJSX}
    </StyledDateSelectionSet>
  );
};

export default ScheduleTile;
