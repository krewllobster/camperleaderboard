import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import './App.css';

const BASE_URL = 'https://fcctop100.herokuapp.com/api/fccusers/top'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      results: {recent: [], all: []},
    }

    this.recentPromise = this.recentPromise.bind(this);
    this.allPromise = this.allPromise.bind(this);
    this.setResults = this.setResults.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
  }

  recentPromise = () => fetch(`${BASE_URL}/recent`);
  allPromise = () => fetch(`${BASE_URL}/alltime`);

  setResults(values) {
    this.setState({
      loading: false,
      sort: 'recent',
      results: {recent: values[0], all: values[1]}
    })
  }

  fetchResults() {
    this.setState({loading: true});

    Promise.all([this.recentPromise(), this.allPromise()])
      .then(responses =>
        Promise.all(responses.map(res => res.json()))
      ).then(texts => this.setResults(texts))
  }


  componentDidMount() {
    this.fetchResults();
  }

  render() {

    const {loading, results} = this.state;

    return (

      <Table results = {results} />
    );
  }
}

const Table = ({results}) => {

  return (
    <div className = 'table'>
      <div className = 'table-header'>
        <span className='smCol'>#</span>
        <span className='lgCol'>Username</span>
        <span className='mdCol'>Recent</span>
        <span className='mdCol'>All Time</span>
      </div>
      {results.recent.map((item, index) =>
        <div key={item.username} className = 'table-row'>
          <span className='smCol'>{index + 1}</span>
          <span className='lgCol'>
            <img src={item.img}/>
            <span className = 'username' > {item.username} </span>
          </span>
          <span className='mdCol'>{item.recent}</span>
          <span className='mdCol'>{item.alltime}</span>
        </div>
      )}
    </div>
  )
}

export default App;
