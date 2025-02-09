import { useDatePickerState } from '../state/StateContext';

import RGBAColor from '../utils/RGBAColor';
import styled from 'styled-components';
import { setFocusedSelectionSetId } from '../state/actions';

interface StyledDateSelectionSetProps {
  isFocused: boolean;
  selectionColor?: RGBAColor;
}

const StyledDateSelectionSet = styled.div<StyledDateSelectionSetProps>`
  /* style-dependant properties */
  background-color: ${(props) => props.selectionColor?.opacity(0.3).toString()};

  left: ${(props) => (props.isFocused ? '1em' : '0')};

  outline: ${(props) =>
    props.isFocused ? `3px solid ${props.selectionColor?.toString()}` : null};

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
  selectionSetId: string;
}

const ScheduleTile = ({ selectionSetId }: ScheduleTileProps) => {
  const {
    state: {
      focusedSelectionSetId,
      getSelectionSetColor,
      schedule: { selectionSetsStore },
    },
    dispatch,
  } = useDatePickerState();

  const dateSelections = selectionSetsStore[selectionSetId].dateSelections;

  const selectionSetClicked = (): void => {
    dispatch(setFocusedSelectionSetId(selectionSetId));
  };

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
      isFocused={focusedSelectionSetId === selectionSetId}
      selectionColor={getSelectionSetColor(selectionSetId)}
    >
      {dateSelectionJSX}
    </StyledDateSelectionSet>
  );
};

export default ScheduleTile;
