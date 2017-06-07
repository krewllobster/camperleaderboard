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
      results: {recent: [], all: []},
      selected: 'recent',
      sort: 'recent',
    }

    this.recentPromise = this.recentPromise.bind(this);
    this.allPromise = this.allPromise.bind(this);
    this.setResults = this.setResults.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
    this.onClick = this.onClick.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
  }

  recentPromise = () => fetch(`${BASE_URL}/recent`);
  allPromise = () => fetch(`${BASE_URL}/alltime`);

  setResults(values) {
    this.setState({
      selected: 'recent',
      sort: 'recent',
      results: {recent: values[0], alltime: values[1]},
    })
  }

  fetchResults() {
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

  toggleSort(event) {
    this.setState({
      sort: event.target.value
    })
  }

  componentDidMount() {
    this.fetchResults();
  }

  render() {

    const {selected, results, sort} = this.state;

    return (
      <div className = "container">
        <Buttons onClick = {this.onClick} selected = {selected}/>
        <Table
          results = {results[selected]}
          sort = {sort}
          toggleSort = {this.toggleSort} />
      </div>
    );
  }
}

const Button = ({selected, onClick, value, children, cName}) => {

  const butClass = classNames(
    cName,
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
        cName = "button"
      >
        View top FCC'ers from last 30 days
      </Button>
      <Button
        selected = {selected}
        onClick = {onClick}
        value = "alltime"
        cName = "button"
      >
        View all time top FCC'ers
      </Button>
    </div>
  )
}

const Table = ({results, sort, toggleSort}) => {

  return (
    <div className = 'table'>
      <div className = 'table-header'>
        <span className='smCol'>#</span>
        <span className='lgCol'>Username</span>
        <span className='mdCol'>
          <Button
            selected = {sort}
            onClick = {toggleSort}
            value = "recent"
            cName = "button-inline"
          >
            Recent
          </Button>
        </span>
        <span className='mdCol'>
          <Button
            selected = {sort}
            onClick = {toggleSort}
            value = "alltime"
            cName = "button-inline"
          >
            All Time
          </Button>
        </span>
      </div>
      {sortBy(results, [sort]).reverse().map((item, index) =>
        <div key={item.username} className = 'table-row'>
          <span className='smCol'>{index + 1}</span>
          <span className='lgCol'>
            <img src={item.img} alt={`${item.username}'s avatar`}/>
            <span className = 'username' >
              <a
                href={`${FCC_URL}/${item.username}`}
                target="_blank"
                rel="noopener noreferrer"
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
