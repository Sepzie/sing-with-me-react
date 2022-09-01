import logo from './logo.svg';
import song from './res/bones_in_the_ocean.mp3'
import './App.css';
import React from 'react';
import { Howl, Howler } from 'howler';
import { Recorder } from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css'

/**
 * Converts a timetag to miliseconds.
 * @param {*} timeTag timetag in MM:SS:CS format as a string
 * @returns miliseconds as a number
 */
function timeTagToMs(timeTag) {
  let minutes = parseInt(timeTag.slice(0, 2));
  let seconds = parseInt(timeTag.slice(3, 5));
  let centiSeconds = parseInt(timeTag.slice(6, 8));
  return minutes * 60000 + seconds * 1000 + centiSeconds * 10;
}

/**
 * Generates Howler sprites for each section of the song based on the lyrics timestamp
 * @returns Howler sprite object
 */
function generateSprites() {
  let sprites = {};
  for (const [index, line] of LYRICS.slice(0, -1).entries()) {
    sprites['section' + index] = [
      timeTagToMs(line.timeTag),
      timeTagToMs(LYRICS[index + 1].timeTag) - timeTagToMs(line.timeTag)];
  }
  sprites['section' + (LYRICS.length - 1)] = [timeTagToMs(LYRICS[LYRICS.length - 1].timeTag)];
  return sprites;
}

/**
 * Voice recorder - work in progress... plz help
 */
class VoiceRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: null,
          m: null,
          s: null,
        }
      }
    }
  }

  handleAudioStop(data) {
    console.log(data)
    this.setState({ audioDetails: data });
  }

  handleAudioUpload(file) {
    console.log(file);
  }

  handleReset() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: null,
        m: null,
        s: null,
      }
    }
    this.setState({ audioDetails: reset });
  }

  render() {
    return <Recorder
      record={true}
      title={"New recording"}
      audioURL={this.state.audioDetails.url}
      showUIAudio
      handleAudioStop={data => this.handleAudioStop(data)}
      handleOnChange={(value) => this.handleOnChange(value, 'firstname')}
      handleAudioUpload={data => this.handleAudioUpload(data)}
      handleReset={() => this.handleReset()}
    />
  }
}


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
  processClick() {
    var sound = this.props.sound
    var section = 'section' + this.props.lineNumber
    sound.play(section)
    setTimeout(() => this.setState({ color: 'black' }), 1000);
    // console.log(sound.duration(this.props.lineNumber));
    this.setState({
      color: 'green'
    });
  }

  render() {
    return (
      <div>
        <p
          style={{ color: this.state.color }}
          onClick={this.processClick.bind(this)}
        >
          {this.props.text}
        </p>
        {/* <Recorder /> */}
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
    var sprites = generateSprites();
    console.log(sprites);
    var sound = new Howl({
      src: [song],
      sprite: sprites
    });

    this.state = {
      sound: sound,
      section: 0,
    }
  }

  render() {
    const lyrics = LYRICS
    var lines = []

    lyrics.forEach((lyric, lineNumber) => {
      lines.push(
        <Line
          text={lyric.text}
          key={lineNumber}
          onClick={() => this.state.sound.play('section' + lineNumber)}
          sound={this.state.sound}
          lineNumber={lineNumber}
        />
      )
    });

    return <div>{lines}</div>
  }
}

/**
 * App
 */
function App() {
  return (
    <div className="App">
      <Lines className="Lines" lyrics={LYRICS} />
      {/* <VoiceRecorder /> */}
    </div>
  );
}



const LYRICS = [
  { timeTag: "00:00.00", text: "Oh, I bid farewell to the port and the land" },
  { timeTag: "00:03.29", text: "And I paddle away from brave England's white sands" },
  { timeTag: "00:08.21", text: "To search for my long ago forgotten friends" },
  { timeTag: "00:12.37", text: "To search for the place I hear all sailers end" },
  { timeTag: "00:16.87", text: "As the souls of the dead fill the space of my mind" },
  { timeTag: "00:21.37", text: "I'll search without sleeping 'til peace I can find" },
  { timeTag: "00:25.87", text: "I fear not the weather, I fear not the sea" },
  { timeTag: "00:30.12", text: "I remember the fallen, do they think of me?" },
  { timeTag: "00:34.88", text: "When their bones in the ocean forever will be" },
  { timeTag: "00:39.37", text: "Plot a course to the night to a place I once knew" },
  { timeTag: "00:43.89", text: "To a place where my hope died along with my crew" },
  { timeTag: "00:48.40", text: "So I swallow my grief and face life's final test" },
  { timeTag: "00:52.87", text: "To find promise of peace and the solace of rest" },
  { timeTag: "00:57.29", text: "As the songs of the dead fill the space of my ears" },
  { timeTag: "01:01.81", text: "Their laughter like children, their beckoning cheers" },
  { timeTag: "01:06.28", text: "My heart longs to join them, sing songs of the sea" },
  { timeTag: "01:10.78", text: "I remember the fallen, do they think of me?" },
  { timeTag: "01:15.28", text: "When their bones in the ocean forever will be" },
  { timeTag: "01:19.81", text: "When at last before my ghostly shipmates I stand" },
  { timeTag: "01:24.29", text: "I shed a small tear for my home upon land" },
  { timeTag: "01:29.06", text: "Though their eyes speak of depths filled with struggle and strife" },
  { timeTag: "01:33.28", text: "Their smiles below say I don't owe them my life" },
  { timeTag: "01:37.81", text: "As the souls of the dead fill the space of my eyes" },
  { timeTag: "01:42.23", text: "And my boat listed over and tried to capsize" },
  { timeTag: "01:46.73", text: "I'm this far from drowning, this far from the sea," },
  { timeTag: "01:51.48", text: "I remember the living do they think of me?" },
  { timeTag: "01:55.99", text: "When my bones in the ocean forever will be" },
  { timeTag: "02:00.65", text: "Now that I'm staring down at the darkest abyss" },
  { timeTag: "02:07.32", text: "I'm not sure what I want but I don't think it's this" },
  { timeTag: "02:12.56", text: "As my comrades call to stand fast and forge on" },
  { timeTag: "02:20.05", text: "I make sail for the dawn 'til the darkness has gone" },
  { timeTag: "02:27.14", text: "As the souls of the dead live for'er in my mind" },
  { timeTag: "02:35.14", text: "As I live all the years that they left me behind" },
  { timeTag: "02:39.65", text: "I'll stay on the shore but still gaze at the sea" },
  { timeTag: "02:44.16", text: "I remember the fallen and they think of me" },
  { timeTag: "02:48.64", text: "For our souls in the ocean together will be" },
  { timeTag: "02:54.06", text: "I remember the fallen and they think of me," },
]

export default App;
