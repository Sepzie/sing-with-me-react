import React from 'react';
import { getNewFileHandle, writeFile, readFile } from './helper-modules/FileSystem.js'


function processLyrics(rawLyrics = '') {
  const regex = /^\[(?<minutes>0?[0-9]|[1-5][0-9]):(?<seconds>(0?[0-9]|[1-5][0-9])\.[0-9]*)\](?<text>.*)/
  let linesData = []

  rawLyrics
    .split('\n')
    .forEach((line) => {
      if (regex.test(line)) {
        const match = regex.exec(line)
        const minutes = parseInt(match.groups.minutes)
        const seconds = parseFloat(match.groups.seconds)
        const startTime = minutes * 60000 + seconds * 1000
        const text = match.groups.text
        linesData.push({
          startTime: startTime,
          text: text
        })
      }
    });

  return linesData
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
    let linesData = processLyrics(this.state.value)
    this.props.setLinesData(linesData)
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