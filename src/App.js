import "./styles/index.css";
import "./styles/App.css";
import SchedulePicker from './components/SchedulePicker';

function App() {

  // months starting with 0
  let initDate = new Date(2022, 0, 23) //current
  let finalDate = new Date(2022, 2, 15)


  return (
    <div className="App">
      <header>
        <p>Starting date: {initDate.getDate()}.{initDate.getMonth()}.{initDate.getYear()}</p>
        <p>Final date: {finalDate.getDate()}.{finalDate.getMonth()}.{finalDate.getYear()}</p>
      </header>
      <SchedulePicker initDate={initDate} finalDate={finalDate} />
    </div>
  );
}

export default App;
