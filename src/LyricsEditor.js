import React, { useState } from 'react';





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
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });

  }

  handleSubmit(event) {
    processLyrics(this.state.value)
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Lyrics With Timestamp</label>
        <textarea type="text" value={this.state.value} onChange={this.handleChange} />
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


class LyricsEditor extends React.Component {
  render() {
    return <EditText className='EditText' />
  }
}

export default LyricsEditor