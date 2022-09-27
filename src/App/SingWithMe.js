import './style_sheets/SingWithMe.css';
import React, { useState } from 'react';
import { Howl } from 'howler';
import { useReactMediaRecorder } from "react-media-recorder";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


/**
 * Generates Howler sprites for each section of the song based on the lyrics timestamp
 * @returns Howler sprite object
 */
function generateSprites(syncedLyrics) {
  let sprites = {};
  if (syncedLyrics.length !== 0) {
    for (const [index, line] of syncedLyrics.slice(0, -1).entries()) {
      sprites['section' + index] = [
        line.startTime,
        syncedLyrics[index + 1].startTime - line.startTime
      ];
    }
    sprites['section' + (syncedLyrics.length - 1)] = [syncedLyrics[syncedLyrics.length - 1].startTime];
  }
  return sprites;
}


const RecordView = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  const [recording, setRecording] = useState(false);

  const processClick = () => {
    recording ? stopRecording() : startRecording();
    setRecording(!recording);
  }
  

  /* Render */
  let recordButtonClassName = 'record-button';
  recordButtonClassName +=  recording ? ' recording' : ' not-recording'

  return (
    <div className='RecordView'>
      {/* <p>{status}</p>  */}
      <button 
      className={recordButtonClassName}
      onClick={processClick}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <audio src={mediaBlobUrl} controls autoPlay />
    </div>
  );
};


/**
 * One line of the lyrics
 * Each line has text, and plays the audio for the line when clicked.
 */
class Line extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      color: 'black'
    };
  }

  /**
   * Handle what happens when a line is clicked
   * Plays the Howler sprite that corresponds to this line and changes the line color for a second.
   */
  processClick = () => {
    var sound = this.props.sound
    if (!sound) {
      toast("No Sound Loaded")
      return;
    }
    // var section = 'section' + this.props.lineNumber
    // sound.play(section)
    this.props.playSound();
    setTimeout(() => this.setState({ color: 'black' }), 1000);
    this.setState({
      color: 'green'
    });
  }

  render() {
    return (
      <div
        className='sing-with-me-line'
      >
        <p
          className="sound-sprite-button"
          style={{ color: this.state.color }}
          onClick={this.processClick}
        >
          {this.props.text}
        </p>
        <RecordView />
      </div>
    )
  }
}

var soundSource;

/**
 * The lines of the lyrics.
 * Contains all the lines and the sound object that is shared between them as a state.
 */
class Lines extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sound: null,
    }

    this.loadSound = this.loadSound.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  loadSound() {
    if (!soundSource) {
      toast("No File Chosen")
    }
    const sprites = generateSprites(this.props.syncedLyrics)
    const sound = new Howl({
      src: [soundSource],
      sprite: sprites
    });
    this.setState({sound: sound})
  }

  handleInput(event) {
    const file = event.target.files[0]
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      soundSource = e.target.result;
    };
    reader.readAsDataURL(file)
  }

  playSound = (lineNumber) => {
    if (!this.state.sound) {
      toast("No Sound Loaded")
      return;
    }
    this.state.sound.play('section' + lineNumber)
  }

  render() {
    const syncedLyrics = this.props.syncedLyrics
    let lines = []

    syncedLyrics.forEach((line, lineNumber) => {
      lines.push(
        <Line
          text={line.text}
          key={lineNumber}
          playSound={() => this.playSound(lineNumber)}
          sound={this.state.sound}
          lineNumber={lineNumber}
        />
      )
    });

    return (
      <div>
        <input id="file-upload" type="file" onChange={this.handleInput} />
        <button onClick={this.loadSound}>Load Sound</button>
        {lines}
        <ToastContainer />
      </div>
    )
  }
}


export default Lines

