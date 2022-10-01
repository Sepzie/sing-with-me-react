import logo from './logo.svg';

import './style_sheets/App.css';
import React, { useState } from 'react';
import BasicTabs from './TabPanel';
import SingWithMe from './SingWithMe';
import LyricsEditor from './LyricsEditor';
import DatabaseView from './DatabaseView';
import SoundWaveView from './helper-modules/SoundWaveView';




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
      {/* <div>
        <LyricsEditor className="LyricsEditor" setSyncedLyrics={setSyncedLyrics} />
        <DatabaseView className="DatabaseView" syncedLyrics={syncedLyrics} collection="songs" />
        <SingWithMe className="SingWithMe" syncedLyrics={syncedLyrics} />
      </div> */}
      <SoundWaveView />
      {/* <BasicTabs
        tab1={
          <div>
            <LyricsEditor className="LyricsEditor" setSyncedLyrics={setSyncedLyrics} />
            <DatabaseView className="DatabaseView" syncedLyrics={syncedLyrics} collection="songs" />
            <SingWithMe className="SingWithMe" syncedLyrics={syncedLyrics} />
          </div>
        }
        tab2={<SoundWaveView />}
      /> */}


    </div>
  );
}

export default App;
