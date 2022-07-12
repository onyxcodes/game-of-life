import React, { Component } from "react";
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { connect } from "react-redux";
import GridManagement from "../../utils/gridManagement/index.tsx";

var grid = new GridManagement([4,8], "********"+
                                                    "**##****"+
                                                    "*###****"+
                                                    "********",'*', '#')
grid.calcNextGeneration();
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
