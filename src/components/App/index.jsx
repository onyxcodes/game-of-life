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

  const View = ({prevPopulation, population, fileFn, calcFn}) => {
    
    return <div>
      <Grid id="prev" population={prevPopulation} />
      <hr/>
      <Grid id="current" population={population} />
      <ActionBar uploadFile={fileFn} calcNextGen={calcFn} />
    </div>
      
  }
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      population: [],
      prevPopulation: []
    }
  }
grid = new GridManagement([4,8], "********"+
                                                    "**##****"+
                                                    "*###****"+
                                                    "********",'*', '#')
    //grid.calcNextGeneration();

  componentDidMount()   {
    console.log("Called componentDidMount");
    var population = [... this.grid.getPopulation()];
    var prevPopulation = JSON.parse(JSON.stringify(population));
    this.setState({ 
      population: population,
      prevPopulation: prevPopulation
    })
  }

  calculateNextGen() {
    console.log("App - calling calculate next gen");
    var prevPopulation  = JSON.parse(JSON.stringify(this.state.population));
    console.log("App - Got prev population", prevPopulation);
    this.grid.calcNextGeneration();
    var population = [... this.grid.getPopulation()];
    console.log("App - Got next population", population);
    this.setState( (state) => ({ 
        prevPopulation: prevPopulation,
        population: population
      })
    );
   
  }

  uploadFile() {
    console.log("App - Uploading file..");
  }
  
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" 
            element={
              <View 
                calcFn={() => this.calculateNextGen()} 
                fileFn={() => this.uploadFile()}
                prevPopulation={this.state.prevPopulation} 
                population={this.state.population} />}
          />;
        </Routes>
      </Router>
    );
  }
}

export default App;
