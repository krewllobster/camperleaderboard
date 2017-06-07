import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './App.css';

const BASE_URL = 'https://fcctop100.herokuapp.com/api/fccusers/top';
const FCC_URL = 'https://www.freecodecamp.com'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      results: {recent: [], all: []},
      selected: 'recent',
    }

    this.recentPromise = this.recentPromise.bind(this);
    this.allPromise = this.allPromise.bind(this);
    this.setResults = this.setResults.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  recentPromise = () => fetch(`${BASE_URL}/recent`);
  allPromise = () => fetch(`${BASE_URL}/alltime`);

  setResults(values) {
    this.setState({
      loading: false,
      selected: 'recent',
      results: {recent: values[0], alltime: values[1]},
    })
  }

  fetchResults() {
    this.setState({loading: true});

    Promise.all([this.recentPromise(), this.allPromise()])
      .then(responses =>
        Promise.all(responses.map(res => res.json()))
      ).then(texts => this.setResults(texts))
  }

  onClick(event) {
    this.setState({
      selected: event.target.value
    })
  }

  componentDidMount() {
    this.fetchResults();
  }

  render() {

    const {loading, selected, results} = this.state;

    return (
      <div className = "container">
        <Buttons onClick = {this.onClick} selected = {selected}/>
        <Table results = {results[selected]} />
      </div>
    );
  }
}

const Button = ({selected, onClick, value, children}) => {
  const butClass = classNames(
    'button',
    {'button-active': selected === value}
  )
  return (
    <button
      className = {butClass}
      onClick = {onClick}
      value = {value}
    >{children}</button>
  )
}

const Buttons = ({selected, onClick}) => {
  return (
    <div className = 'header'>
      <Button
        selected = {selected}
        onClick = {onClick}
        value = "recent"
      >
        View top FCC'ers from last 30 days
      </Button>
      <Button
        selected = {selected}
        onClick = {onClick}
        value = "alltime"
      >
        View all time top FCC'ers
      </Button>
    </div>
  )
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
      {results.map((item, index) =>
        <div key={item.username} className = 'table-row'>
          <span className='smCol'>{index + 1}</span>
          <span className='lgCol'>
            <img src={item.img}/>
            <span className = 'username' >
              <a
                href={`${FCC_URL}/${item.username}`}
                target="_blank"
              >
                {item.username}
              </a>
            </span>
          </span>
          <span className='mdCol'>{item.recent}</span>
          <span className='mdCol'>{item.alltime}</span>
        </div>)}
    </div>
  )
}

export default App;
