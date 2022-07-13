import React, { Component } from "react";
import Row from "../Row"

class Grid extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if ( this.props.population?.length ) {
      const population = this.props.population.map( (rowPopulation, index) =>
        <Row key={index} style={{ border: "1px", borderColor: "black"}} value={rowPopulation}/> 
      );
      return ( 
	      <div>
	      	<h4>{"Generation "+this.props.number+":"}</h4>
	      	<div className="grid">
	      		{population}
	      	</div>
	      </div> )
   } else {
      return (<div>Got nothing to show</div>)
    }
  }
}

export default Grid;