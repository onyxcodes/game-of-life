import React, { Component } from "react";
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { connect } from "react-redux";
import gridManagement from "../../utils/gridManagement/index.js";

var population = gridManagement.calcInitPopulation('*', '#', [4,8], "********"+
                                                    "**##****"+
                                                    "*###****"+
                                                    "********");
console.log("Got population",population);
gridManagement.calcNextGeneration(population, [4,8])

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