import "./styles/index.css";
import "./styles/App.css";
import React from 'react'
import SchedulePicker from './components/SchedulePicker';

const App: React.FC = () => {

  let initDate = new Date(2022, 0, 3) 
  let finalDate = new Date(2022, 3, 30)

  return (
    <div className="App">
      {/* <header>
        <p>Starting date: {initDate.getDate()}.{initDate.getMonth()}.{initDate.getYear()}</p>
        <p>Final date: {finalDate.getDate()}.{finalDate.getMonth()}.{finalDate.getYear()}</p>
      </header> */}

      <SchedulePicker monthsPerPage={2} dateRange={[initDate, finalDate]} />
    </div>
  );
};

export default App;
