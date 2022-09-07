import React, { useState } from 'react';
import song from './res/bones_in_the_ocean.mp3'
import { Howl, Howler } from 'howler';
import { ReactMediaRecorder } from "react-media-recorder";
import { useReactMediaRecorder } from "react-media-recorder";



/**
 * Generates Howler sprites for each section of the song based on the lyrics timestamp
 * @returns Howler sprite object
 */
function generateSprites(linesData) {
  let sprites = {};
  if (linesData.length !== 0) {
    for (const [index, line] of linesData.slice(0, -1).entries()) {
      sprites['section' + index] = [
        line.startTime,
        linesData[index + 1].startTime - line.startTime
      ];
    }
    sprites['section' + (linesData.length - 1)] = [linesData[linesData.length - 1].startTime];
  }
  return sprites;
}


const RecordView = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  const [recording, setRecording] = useState(false);

  function processClick() {
    recording ? stopRecording() : startRecording();
    setRecording(!recording);
  }

  return (
    <div>
      <p>{status}</p>
      <button onClick={processClick}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <audio src={mediaBlobUrl} controls autoPlay />
    </div>
  );
};


/**
 * One line of the lyrics
 * Each line has text, and plays the audio for the line when clicked.
 * TO DO: Add a voice recorder next to the lyrics in each song
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
    var section = 'section' + this.props.lineNumber
    sound.play(section)
    setTimeout(() => this.setState({ color: 'black' }), 1000);
    this.setState({
      color: 'green'
    });
  }

  render() {
    return (
      <div>
        <p
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

/**
 * The lines of the lyrics.
 * Contains all the lines and the sound state that is shared between the lines.
 */
class Lines extends React.Component {
  constructor(props) {
    super(props)
    const sprites = generateSprites(this.props.linesData);
    const sound = new Howl({
      src: [song],
      sprite: sprites
    });

    this.state = {
      sound: sound,
    }

    this.makeSound = this.makeSound.bind(this)
  }

  makeSound() {
    const sprites = generateSprites(this.props.linesData);
    const sound = new Howl({
      src: [song],
      sprite: sprites
    });
    this.setState({
      sound: sound
    })
  }

  render() {
    const linesData = this.props.linesData
    let lines = []

    linesData.forEach((line, lineNumber) => {
      lines.push(
        <Line
          text={line.text}
          key={lineNumber}
          onClick={() => this.state.sound.play('section' + lineNumber)}
          sound={this.state.sound}
          lineNumber={lineNumber}
        />
      )
    });

    return (
      <div>
        <button onClick={this.makeSound}>Make Sound</button>
        {lines}
      </div>
    )
  }
}


export default Lines

