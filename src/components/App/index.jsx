import React, { Component } from "react";
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { connect } from "react-redux";
import gridManagement from "../../utils/gridManager";

var population = gridManagement.calcInitPopulation('*', '#', [4,8], "********"+
                                                    "***#****"+
                                                    "**##****"+
                                                    "********");
console.log("Got population",population);
gridManagement.cellUpdate(population, [4,8], [4,1], 1, null)

class App extends Component {

  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<div id ="app">Good to go</div>}/>
        </Routes>
      </Router>
    );
  }
}

export default App;