import logo from './logo.svg';

import './style_sheets/App.css';
import React, { useState } from 'react';
import BasicTabs from './TabPanel';
import SingWithMe from './SingWithMe';
import LyricsEditor from './LyricsEditor';
import DatabaseView from './DatabaseView';




/**
 * App
 */
function App() {
  let [syncedLyrics, setSyncedLyrics] = useState([]);

  function processSubmit(newSyncedLyrics) {
    setSyncedLyrics(newSyncedLyrics)
  }



  return (
    <div className="App">
      <LyricsEditor className="LyricsEditor" setSyncedLyrics={setSyncedLyrics} />
      <DatabaseView className="DatabaseView" syncedLyrics={syncedLyrics} collection="songs" />
      <SingWithMe className="SingWithMe" syncedLyrics={syncedLyrics} />
      {/* <BasicTabs
        // tab1={<Lines className="Lines" linesData={linesData}/>}
        // tab2={<LyricsEditor className="LyricsEditor" setLinesData={setLinesData}/>}
      /> */}
    </div>
  );
}

export default App;
