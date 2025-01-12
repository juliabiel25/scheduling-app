import {
  createContext,
  useReducer,
  ReactNode,
  useContext,
  Dispatch,
} from 'react';
import {
  DatePickerState,
  initialDatePickerState,
  stateReducer,
} from './StateReducer';

interface DatePickerContextValue {
  state: DatePickerState;
  dispatch: Dispatch<{ type: string; payload?: any }>;
}

export const DatePickerStateContext =
  createContext<DatePickerContextValue | null>(null);

export const useDatePickerState = () => {
  const context = useContext(DatePickerStateContext);
  if (context === null) {
    throw new Error(
      'useDatePickerState must be used within a DatePickerStateProvider',
    );
  }
  return context;
};

export function DatePickerStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stateReducer, initialDatePickerState);
  return (
    <DatePickerStateContext.Provider value={{ state, dispatch }}>
      {children}
    </DatePickerStateContext.Provider>
  );
}
