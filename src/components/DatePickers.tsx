import DatePicker from './DatePicker';
import styled from 'styled-components';
import { useDatePickerState } from '../state/StateContext';
import { setDatePickerScroll } from '../state/actions';

const NavigationButton = styled.button<{}>`
  border: none;
  width: 100%;
  border-radius: 0.6em;
  padding: 0.3em;
  transition: box-shadow 0.2s ease-out;

  &:hover {
    box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
      rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
    color: #222222;
  }
  &:disabled {
    visibility: hidden;
  }
`;

const DatePickersGroup = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

export interface DatePickersProps {}

const DatePickers = ({}: DatePickersProps) => {
  const {
    state: {
      dateRange,
      calendarMonths,
      datePickerScroll,
      calendars,
      monthsPerPage,
    },
    dispatch,
  } = useDatePickerState();

  const paginationFilteredMonths = calendarMonths.slice(
    datePickerScroll,
    datePickerScroll + monthsPerPage,
  );

  const scrollForward = () => {
    dispatch(
      setDatePickerScroll(
        datePickerScroll + monthsPerPage < dateRange.getNumberOfMonths()
          ? datePickerScroll + 1
          : datePickerScroll,
      ),
    );
  };

  const scrollBackward = () => {
    dispatch(
      setDatePickerScroll(
        datePickerScroll > 0 ? datePickerScroll - 1 : datePickerScroll,
      ),
    );
  };

  return (
    <div className="date-picker-list">
      <NavigationButton
        onClick={scrollBackward}
        disabled={datePickerScroll > 0 ? false : true}
      >
        previous month
      </NavigationButton>

      <DatePickersGroup>
        {dateRange.getNumberOfMonths() > 0 ? (
          paginationFilteredMonths.map((monthIndex) => {
            const calendar = calendars[monthIndex.getString()];
            if (!calendar) {
              throw new Error(
                'No calendars were generated for the requested month index: ' +
                  monthIndex,
              );
            }
            return (
              <DatePicker
                key={`${monthIndex.month}-${monthIndex.year}`}
                calendar={calendar}
              />
            );
          })
        ) : (
          <p>Select the date range to display calendars</p>
        )}
      </DatePickersGroup>

      <NavigationButton
        onClick={scrollForward}
        disabled={
          datePickerScroll + monthsPerPage < dateRange.getNumberOfMonths()
            ? false
            : true
        }
      >
        next month
      </NavigationButton>
    </div>
  );
};

export default DatePickers;
