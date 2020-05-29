import React from 'react';
import './App.css';
import { fuzzyMatch } from './search'

export default class App extends React.Component {

  state = {
    text: '',
    results: [],
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  search() {
    const results = fuzzyMatch(this.state.text);
    this.setState({ results: results });
  }

  renderResults() {
    return this.state.results.map((res, i) => {
      const r = res;
      return <div style={{ marginVertical: 16 }}>
        <h3># {i + 1}</h3>
        <h4>{r.Chapter}:{r.Section} {r.Desc}</h4>
        <p>1st Off: {r["1st Of. Fine"]}</p>
        <p>2nd Off: {r["2nd Of. Fine"]}</p>
        <p>3rd Off: {r["3rd Of. Fine"]}</p>
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
