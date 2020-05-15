import React from 'react';
import './App.css';
import { filterSearchResults } from './search'
import Fuse from 'fuse.js'
const laws = require('./search/laws.json')

const options = {
  includeScore: true,
  isCaseSensitive: false,
  // threshold: 0.5,
  keys: ['Desc'],
}

const fuse = new Fuse(laws, options)

class App extends React.Component {

  state = {
    text: '',
    maxDelta: '0.25',
    results: [],
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  handleDeltaChange(event) {
    this.setState({ maxDelta: event.target.value });
  }

  search() {
    const results = fuse.search(this.state.text)
    this.setState({ results: filterSearchResults(results, Number(this.state.maxDelta)) })
  }

  renderResults() {
    return this.state.results.map((res, i) => {
      const r = res.item;
      return <div style={{ marginVertical: 16 }}>
        <h4>{r.Chapter}:{r.Section} {r.Desc}</h4>
        <p>1st Off: {r["1ST Of."]}</p>
        <p>2nd Off: {r["2ND Of."]}</p>
        <p>3rd Off: {r["3RD Of."]}</p>
        <p>Percent Match: {Math.round((1 - res.score) * 100 * 100) / 100}%</p>
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
          <label style={{ marginLeft: 16 }}>
            Maximum Delta between results:{' '}
            <input type="text" value={this.state.maxDelta} onChange={this.handleDeltaChange.bind(this)} />
          </label>
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

export default App;
