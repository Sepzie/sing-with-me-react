import './style_sheets/SingWithMe.css';
import React, { useState } from 'react';
import { Howl } from 'howler';
import { useReactMediaRecorder } from "react-media-recorder";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import soundRef from "./res/bones_in_the_ocean.mp3"


/**
 * Generates Howler sprites for each section of the song based on the lyrics timestamp
 * @returns Howler sprite object
 */
function generateSprites(syncedLyrics = []) {
  let sprites = {};
  if (syncedLyrics.length !== 0) {
    syncedLyrics.forEach((line, index) => {
      sprites['section' + index] = [
        line.startTime,
        line.duration
      ];
    })
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
  recordButtonClassName += recording ? ' recording' : ' not-recording'

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
      playing: false,
      color: 'black'
    };
  }

  /**
   * Handle what happens when a line is clicked
   * Plays the Howler sprite that corresponds to this line.
   */
  processClick = () => {
    this.props.playSound();
    setTimeout(() => this.setState({ playing: false }), this.props.duration);
    this.setState({
      playing: true
    });
  }

  render() {
    let soundButtonClass = "sound-sprite-button";
    if (this.state.playing) {
      soundButtonClass += " playing"
    }
    return (
      <div
        className='sing-with-me-line'
      >
        <p
          className={soundButtonClass}
          onClick={this.processClick}
        >
          {this.props.text}
        </p>
        <RecordView />
      </div>
    )
  }
}

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
  }

  loadSound() {
    const source = this.props.soundSourceRef.current
    if (!source) {
      toast("No File Chosen")
    }
    console.log(this.props.soundSourceRef.current)
    const sprites = generateSprites(this.props.syncedLyrics)
    const sound = new Howl({
      src: [source],
      sprite: sprites
    });
    console.log(sound)
    this.setState({ sound: sound })
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
          duration={line.duration}
          lineNumber={lineNumber}
        />
      )
    });

    return (
      <div>
        <button onClick={this.loadSound}>Load Sound</button>
        {lines}
        <ToastContainer />
      </div>
    )
  }
}


export default Lines

