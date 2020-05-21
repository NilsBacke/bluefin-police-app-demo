import React from 'react';
import './App.css';
import { fuzzyMatch } from './search'

export default class App extends React.Component {

  state = {
    text: '',
    maxDelta: '0.25',
    location: '25',
    threshold: '0.6',
    distance: '100',
    results: [],
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  handleDeltaChange(event) {
    this.setState({ maxDelta: event.target.value });
  }

  handleLocationChange(event) {
    this.setState({ location: event.target.value });
  }

  handleThresholdChange(event) {
    this.setState({ threshold: event.target.value });
  }

  handleDistanceChange(event) {
    this.setState({ distance: event.target.value });
  }

  handleIndividualWordsChange(event) {
    this.setState({ individualWords: event.target.checked });
  }

  search() {
    const results = fuzzyMatch(this.state.text, {
      MAX_DELTA: Number(this.state.maxDelta),
      location: Number(this.state.location),
      threshold: Number(this.state.threshold),
      distance: Number(this.state.distance),
    });
    this.setState({ results: results });
  }

  renderResults() {
    return this.state.results.map((res, i) => {
      // const r = res.item;
      const r = res;
      return <div style={{ marginVertical: 16 }}>
        <h4>{r.Chapter}:{r.Section} {r.Desc}</h4>
        <p>1st Off: {r["1ST Of."]}</p>
        <p>2nd Off: {r["2ND Of."]}</p>
        <p>3rd Off: {r["3RD Of."]}</p>
        {/* <p>Percent Match: {Math.round((1 - res.score) * 100 * 100) / 100}%</p> */}
        <p>Percent Match: {Math.round(res.score * 100 * 100) / 100}%</p>
      </div>
    })
  }

  render() {
    return (
      <div style={{ margin: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label>
            Query Text:{' '}
            <input type="text" value={this.state.text} onChange={this.handleChange.bind(this)} style={{ width: 300 }} />
          </label>
          {/* <label style={{ marginLeft: 16 }}>
            Maximum Delta between results:{' '}
            <input type="text" value={this.state.maxDelta} onChange={this.handleDeltaChange.bind(this)} style={{ width: 50 }} />
          </label>
          <label style={{ marginLeft: 16 }}>
            Location:{' '}
            <input type="text" value={this.state.location} onChange={this.handleLocationChange.bind(this)} style={{ width: 50 }} />
          </label>
          <label style={{ marginLeft: 16 }}>
            Threshold:{' '}
            <input type="text" value={this.state.threshold} onChange={this.handleThresholdChange.bind(this)} style={{ width: 50 }} />
          </label>
          <label style={{ marginLeft: 16 }}>
            Distance:{' '}
            <input type="text" value={this.state.distance} onChange={this.handleDistanceChange.bind(this)} style={{ width: 50 }} />
          </label> */}
          <button style={{ marginLeft: 16 }} onClick={this.search.bind(this)}>
            Search
          </button>
        </div>
        <div>
          {this.renderResults()}
        </div>
      </div>
    );
  }
}
