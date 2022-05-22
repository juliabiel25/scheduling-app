import "./styles/index.css";
import "./styles/App.css";
import SchedulePicker from './components/SchedulePicker';

function App() {

  // months starting with 0
  let initDate = new Date(2022, 0, 3) //current
  let finalDate = new Date(2022, 0, 30)


  return (
    <div className="App">
      
      {/* <header>
        <p>Starting date: {initDate.getDate()}.{initDate.getMonth()}.{initDate.getYear()}</p>
        <p>Final date: {finalDate.getDate()}.{finalDate.getMonth()}.{finalDate.getYear()}</p>
      </header> */}

      <SchedulePicker 
        dateRange={[initDate, finalDate]} 
      />
    </div>
  );
}

export default App;
