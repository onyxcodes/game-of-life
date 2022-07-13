import React, { Component } from "react";
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { connect } from "react-redux";
import GridManagement from "../../utils/gridManagement/index.tsx";
import Grid from "../Grid"
import ActionBar from "../ActionBar"

  const View = ({population, calcFn}) => {
    
    return <div>
      <Grid population={population} />
      <ActionBar calcNextGen={calcFn} />
    </div>
      
  }
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      population: [
    [0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0]
  ]
    }
  }
grid = new GridManagement([4,8], "********"+
                                                    "**##****"+
                                                    "*###****"+
                                                    "********",'*', '#')
    //grid.calcNextGeneration();

  componentDidMount()   {
    var population = this.grid.getPopulation();
    this.setState({ population: population })
  }

  calculateNextGen() {
    console.log("App - calling calculate next gen")
    this.grid.calcNextGeneration();
    var population = this.grid.getPopulation();
    this.setState({ population: population })
  }


  
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" 
            element={<View calcFn={() => this.calculateNextGen()} population={this.state.population} />}
          />;
        </Routes>
      </Router>
    );
  }
}

export default App;
