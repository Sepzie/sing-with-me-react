import logo from './logo.svg';

import './App.css';
import React, { useState } from 'react';
import BasicTabs from './TabPanel';
import Lines from './SingWithMe';
import LyricsEditor from './LyricsEditor';


/**
 * App
 */
function App() {
  let [linesData, setLinesData] = useState([]);

  function processSubmit(newLinesData) {
    setLinesData(newLinesData)
  }

  

  return (
    <div className="App">
        <LyricsEditor className="LyricsEditor" setLinesData={setLinesData}/>
        <Lines className="Lines" linesData={linesData} />
      {/* <BasicTabs
        // tab1={<Lines className="Lines" linesData={linesData}/>}
        // tab2={<LyricsEditor className="LyricsEditor" setLinesData={setLinesData}/>}
      /> */}
    </div>
  );
}

export default App;
