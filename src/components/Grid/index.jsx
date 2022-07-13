import React, { Component } from "react";
import Row from "../Row"

class Grid extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("Grid - Got props", this.props.population);
    if ( this.props.population.length ) {
      const population = this.props.population.map( (rowPopulation, index) =>
        <Row key={index} style={{ border: "1px", borderColor: "black"}} value={rowPopulation}/> 
      );
      return ( <div id="grid">{population}</div> )
   } else {
      return (<div>Got nothing to show</div>)
    }
  }
}

export default Grid;