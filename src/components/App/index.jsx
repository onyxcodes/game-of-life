import React, { Component } from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import GridManagement from "../../utils/gridManagement/index.tsx";
import Grid from "../Grid";
import ActionBar from "../ActionBar";

const View = ({ prevPopulation, population, fileFn, calcFn, preview }) => {
  console.log("View - got preview", preview);
  return (
    <div>
      <Grid id="prev" population={prevPopulation} />
      <hr />
      <Grid id="current" population={population} />
      <ActionBar
        textPreview={preview}
        uploadFile={fileFn}
        calcNextGen={calcFn}
      />
    </div>
  );
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      population: [],
      prevPopulation: [],
      textPreview: "test",
    };
  }
  grid = new GridManagement(
    [4, 8],
    "********" + "**##****" + "*###****" + "********",
    "*",
    "#"
  );
  //grid.calcNextGeneration();

  componentDidMount() {
    console.log("Called componentDidMount");
    var population = [...this.grid.getPopulation()];
    var prevPopulation = JSON.parse(JSON.stringify(population));
    this.setState({
      population: population,
      prevPopulation: prevPopulation,
    });
  }

  calculateNextGen() {
    console.log("App - calling calculate next gen");
    var prevPopulation = JSON.parse(JSON.stringify(this.state.population));
    console.log("App - Got prev population", prevPopulation);
    this.grid.calcNextGeneration();
    var population = [...this.grid.getPopulation()];
    console.log("App - Got next population", population);
    this.setState((state) => ({
      prevPopulation: prevPopulation,
      population: population,
    }));
  }

  readFile(e) {
    console.log("Got text", e.target.result);
    if (e.target.result) {
      this.setState({ textPreview: e.target.result });
    }
  }

  uploadFile(value) {
    console.log("App - Uploading file..", value);
    if (value) {
      var fileR = new FileReader();
      fileR.addEventListener("load", (e) => this.readFile(e));
      fileR.readAsText(value.files[0]);
    }
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <View
                calcFn={() => this.calculateNextGen()}
                fileFn={(value) => this.uploadFile(value)}
                prevPopulation={this.state.prevPopulation}
                population={this.state.population}
                preview={this.state.textPreview}
              />
            }
          />
          ;
        </Routes>
      </Router>
    );
  }
}

export default App;
