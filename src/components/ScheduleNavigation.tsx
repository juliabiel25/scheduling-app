import { useDatePickerState } from '../state/StateContext';
import ScheduleTile from './ScheduleTile';
import styled from 'styled-components';
import { createNewSelectionSet } from '../state/actions';

const StyledScheduleNavigation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 20em;
  max-height: min-content;
`;

const StyledAddSelectionBtn = styled.button`
  align-self: flex-end;
  margin: 0 0 0.3em 0;
  padding: 0.4em;
  border-radius: 50%;
  aspect-ratio: 1/1;
  font-size: xx-large;
  border: none;
  color: darkgray;
  transition: box-shadow 0.2s ease-out;

  &:hover {
    box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
      rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
    color: #222222;
  }
`;

const ScheduleNavigation = ({}) => {
  const {
    state: { schedule },
    dispatch,
  } = useDatePickerState();

  const handleAddSelectionSetClick = () => {
    dispatch(createNewSelectionSet());
  };

  const selectionSets = Object.keys(schedule.selectionSetsStore).map(
    (selectionSetId) => (
      <ScheduleTile key={selectionSetId} selectionSetId={selectionSetId} />
    ),
  );

  return (
    <StyledScheduleNavigation>
      <StyledAddSelectionBtn onClick={handleAddSelectionSetClick}>
        +
      </StyledAddSelectionBtn>
      {selectionSets}
    </StyledScheduleNavigation>
  );
};

export default ScheduleNavigation;
