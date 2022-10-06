import logo from './logo.svg';

import './style_sheets/App.css';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import BasicTabs from './TabPanel';
import SingWithMe from './SingWithMe';
import LyricsEditor from './LyricsEditor';
import DatabaseView from './DatabaseView';
import SoundWaveView from './helper-modules/SoundWaveView';
import SoundSyncActivity from './SoundSyncActivity';


/**
 * App
 */
function App() {
  const [,forceUpdate] = useState()
  const [syncedLyrics, setSyncedLyrics] = useState([]);
  const soundSourceRef = useRef(null);


  const handleInput = useCallback((event) => {
    const file = event.target.files[0]
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      soundSourceRef.current = e.target.result;
      forceUpdate()
    };
    reader.readAsDataURL(file)
  })

    

  return (
    <div className="App">
      {/* <div>
        <LyricsEditor className="LyricsEditor" setSyncedLyrics={setSyncedLyrics} />
        <DatabaseView className="DatabaseView" syncedLyrics={syncedLyrics} collection="songs" />
        <SingWithMe className="SingWithMe" syncedLyrics={syncedLyrics} />
      </div> */}
      {/* <SoundSyncActivity className="SoundSyncActivity" setSyncedLyrics={setSyncedLyrics} />
      <SingWithMe className="SingWithMe" syncedLyrics={syncedLyrics} /> */}

      <BasicTabs
        tab1={
          <div>
            <input id="file-upload" type="file" onChange={handleInput} />
            <SoundSyncActivity className="SoundSyncActivity" setSyncedLyrics={setSyncedLyrics} soundSourceRef={soundSourceRef} />
            <SingWithMe className="SingWithMe" syncedLyrics={syncedLyrics} soundSourceRef={soundSourceRef} />
          </div>
        }
        tab2={<DatabaseView className="DatabaseView" syncedLyrics={syncedLyrics} collection="songs" />}
      />


    </div>
  );
}

export default App;
