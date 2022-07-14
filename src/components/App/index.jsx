import React, { Component } from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import GridManagement from "../../utils/gridManagement/index.tsx";
import Grid from "../Grid";
import ActionBar from "../ActionBar";

const ErrorView = ({ errorMessages }) => {
  const logs = errorMessages.map((error, index) => (
    <li key={index}>{error}</li>
  ));
  return <ul>{logs}</ul>;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      population: [],
      prevPopulation: [],
      generationNum: null || 0,
      textPreview: null,
      errorMessages: [],
    };
  }
  grid = new GridManagement(
    [4, 8],
    "********" + "**##****" + "*###****" + "********",
    "*",
    "#"
  );
  
  updateGridPopulation(prevPopulation) {
    if (this.state.grid) {
      var population = [...this.state.grid.getPopulation()];
      this.setState((state) => ({
        prevPopulation: prevPopulation,
        population: population,
      }));
    }
  }

  componentDidMount() {
    console.log("Called componentDidMount");
    this.updateGridPopulation();
  }

  calculateNextGen() {
    var prevPopulation = JSON.parse(JSON.stringify(this.state.population));
    this.state.grid.calcNextGeneration();
    this.updateGridPopulation(prevPopulation);
    this.setState((state) => {
      state.generationNum++;
    });
  }

  readFile(e) {
    console.log("Got text", e.target.result);
    if (e.target.result) {
      this.setState({ textPreview: e.target.result });
      this.parseText(e.target.result);
    }
  }

  parseText(text) {
    var errorMessages = [];
    if (text) {
      var textParsing = text.split("\n");

      // First line should have the generation number
      var generationNumVal = textParsing[0];
      // Check if it has correct format
      var genNumberCheck = new RegExp("^Generation [0-9]{0,}:$", "g");
      if (!generationNumVal.match(genNumberCheck)) {
        errorMessages.push(
          "`" +
            generationNumVal +
            "` is not a valid generation number. Accepted format: `Generation [n]:`. i.e. `Generation 3:`"
        );
      }
      // Second line should define the grid size
      var gridSizeVal = textParsing[1];
      var gridSizeCheck = new RegExp("^[0-9]{0,} [0-9]{0,}$", "g");
      if (!gridSizeVal.match(gridSizeCheck)) {
        errorMessages.push(
          "`" +
            gridSizeVal +
            "` is not a valid grid size. Accepted format: `<n> <n>`. i.e.: `4 8`"
        );
      }
      if (!errorMessages.length) {
        var getNum = new RegExp("[0-9]", "g");
        var generationNum = generationNumVal.match(getNum)[0],
          gridSize = gridSizeVal.match(getNum).map((x) => Number(x));
        textParsing.splice(0, 2);
        // removes the first two elements, the remaining should be the
        // population config
        var populationConfig = textParsing.join(" ");
        try {
          this.setState({ grid: new GridManagement(gridSize, populationConfig)});
          // this.grid = new GridManagement(gridSize, populationConfig);
          this.updateGridPopulation();
        } catch (e) {
          errorMessages.push(e);
        }
        if (!errorMessages.length)
          this.setState({ generationNum: generationNum });
      }
    } else errorMessages.push("Uploaded file has no text.");
    this.setState({ errorMessages: errorMessages });
  }

  uploadFile(value) {
    if (value) {
      var fileR = new FileReader();
      fileR.addEventListener("load", (e) => this.readFile(e));
      fileR.readAsText(value.files[0]);
    }
  }

  render() {
    return (
      <div>
        <ActionBar
          textPreview={this.state.textPreview}
          uploadFile={(value) => this.uploadFile(value)}
          calcNextGen={() => this.calculateNextGen()}
        />
        {!this.state.errorMessages?.length ? (
          <div>
            <Grid
              number={
                this.state.prevPopulation?.length
                  ? this.state.generationNum - 1
                  : null
              }
              population={this.state.prevPopulation}
            />
            <hr />
            <Grid
              number={this.state.generationNum}
              population={this.state.population}
            />
          </div>
        ) : (
          <ErrorView errorMessages={this.state.errorMessages} />
        )}
      </div>
    );
  }
}

export default App;
