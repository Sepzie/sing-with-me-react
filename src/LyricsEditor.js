import React, { useState } from 'react';


async function getNewFileHandle() {
  const options = {
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.txt'],
        },
      },
      {
        description: 'Lyrics Files',
        accept: {
          'application/octet-stream': ['.lrc']
        }
      },
    ],
  };
  const handle = await window.showSaveFilePicker(options);
  return handle
}

async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}

async function readFile() {
  var [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  return [fileHandle, contents]
}


function processLyrics(rawLyrics) {
  let regex = /((?<start>^\[)|\[)(?<minutes>0?[0-9]|[1-5][0-9]):(?<seconds>0?[0-9]|[1-5][0-9])(\.(?<fraction>[0-9]*))\]/gm;
  console.log(regex.exec(rawLyrics));
  let match = regex.exec(rawLyrics);
  while (match != null) {
    // matched text: match[0]
    // match start: match.index
    // capturing group n: match[n]
    let result = ""
    if (match.groups.start) {
      result += 'start: ';
    } else {
      result += 'end: ';
    }
    result += match.groups.minutes + " " + match.groups.seconds + ' ' + match.groups.fraction;
    console.log(result)
    match = regex.exec(rawLyrics);
  }
}



class EditText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'prefilled text',
      fileHandle: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.saveAs = this.saveAs.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });

  }

  handleSubmit(event) {
    processLyrics(this.state.value)
    event.preventDefault();
  }

  async load() {
    var [fileHandle, contents] = await readFile()
    console.log(contents)
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
    var handle = getNewFileHandle()
    handle.then((result) => {
      writeFile(result, this.state.value)
      this.setState({
        fileHandle: result
      })
    })
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


class LyricsEditor extends React.Component {
  render() {
    return <EditText className='EditText' />
  }
}

export default LyricsEditor