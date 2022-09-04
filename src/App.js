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

  return (
    <div className="App">
      <LyricsEditor className="LyricsEditor" />
      {/* <BasicTabs
        // tab1={<Lines className="Lines" />}
        tab2={<LyricsEditor className="LyricsEditor" />}
      /> */}
    </div>
  );
}

export default App;
