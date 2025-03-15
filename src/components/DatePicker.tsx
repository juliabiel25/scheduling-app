import Calendar from '../utils/Calendar';
import DayTile from './DayTile';
import styled from 'styled-components';
import { useDatePickerState } from '../state/StateContext';

const StyledWeekdayLabel = styled.div`
  color: rgb(191, 191, 191);
`;

const StyledDatePicker = styled.div`
  border: 1px solid lightgrey;
  padding: 1em;
  border-radius: 0.6em;
`;

const StyledDateTiles = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
`;

export interface DatePickerProps {
  calendar: Calendar;
}

const DatePicker = ({ calendar }: DatePickerProps) => {
  const {
    state: { dateRange },
    dispatch,
  } = useDatePickerState();

  // if the date range is not selected -- no calendars are shown
  if (!dateRange.initDate || !dateRange.finalDate) {
    return (
      <div>
        Select the date range for the schedule
        <p>
          Current range: {dateRange.initDate?.toString()} -{' '}
          {dateRange.finalDate?.toString()}
        </p>
      </div>
    );
  }

  const weekdayLabels: React.ReactNode = calendar.weekdayNames.map((wd) => (
    <StyledWeekdayLabel key={wd}>{wd}</StyledWeekdayLabel>
  ));

  return (
    <StyledDatePicker>
      {calendar.getMonthName()} {calendar.year}
      <StyledDateTiles>
        {weekdayLabels}
        {calendar.days.map((day) => {
          return <DayTile key={day.date.toString()} day={day} />;
        })}
      </StyledDateTiles>
    </StyledDatePicker>
  );
};

export default DatePicker;
