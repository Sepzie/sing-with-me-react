import React from 'react';
import { getNewFileHandle, writeFile, readFile } from './helper-modules/FileSystem.js'


function processLyrics(rawLyrics = '') {
  const timeStampRegex = /^\[(?<minutes>0?[0-9]|[1-5][0-9]):(?<seconds>(0?[0-9]|[1-5][0-9])\.[0-9]*)\](?<text>.*)/
  const durationRegex = /\[length:(?<minutes>0?[0-9]|[1-5][0-9]):(?<seconds>(0?[0-9]|[1-5][0-9])\.[0-9]*)\]/
  let syncedLyrics = []

  rawLyrics
    .split('\n')
    .forEach((line) => {
      if (timeStampRegex.test(line)) {
        const match = timeStampRegex.exec(line)
        const minutes = parseInt(match.groups.minutes)
        const seconds = parseFloat(match.groups.seconds)
        const startTime = minutes * 60000 + seconds * 1000
        const text = match.groups.text
        syncedLyrics.push({
          startTime: startTime,
          text: text
        })
      }
    });

  for (let i = 0; i < syncedLyrics.length - 1; i++) {
    syncedLyrics[i].duration = syncedLyrics[i + 1].startTime - syncedLyrics[i].startTime
  }

  if (durationRegex.test(rawLyrics)) {
    const match = durationRegex.exec(rawLyrics)
    const minutes = parseInt(match.groups.minutes)
    const seconds = parseFloat(match.groups.seconds)
    const duration = minutes * 60000 + seconds * 1000
    syncedLyrics[syncedLyrics.length - 1].duration = duration - syncedLyrics[syncedLyrics.length - 1].startTime
    syncedLyrics.duration = duration
  }

  return syncedLyrics
}

class LyricsEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      fileHandle: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.saveAs = this.saveAs.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });

  }

  async load() {
    const [fileHandle, contents] = await readFile()
    this.setState({
      fileHandle: fileHandle,
      value: contents
    })
  }

  save() {
    const fileHandle = this.state.fileHandle
    const contents = this.state.value
    writeFile(fileHandle, contents)
  }


  saveAs() {
    getNewFileHandle().then((result) => {
      writeFile(result, this.state.value)
      this.setState({
        fileHandle: result
      })
    })
  }

  handleSubmit(event) {
    let syncedLyrics = processLyrics(this.state.value)
    this.props.setSyncedLyrics(syncedLyrics)
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <p><label>Lyrics With Timestamp</label></p>
          <textarea type="text" value={this.state.value} onChange={this.handleChange}>

          </textarea>
          <br />
          <input type="submit" value="Submit" />

        </form>
        <button onClick={this.load}>Load</button>
        <button onClick={this.save}>Save</button>
        <button onClick={this.saveAs}>Save As...</button>
      </div>
    );
  }
}

export default LyricsEditor