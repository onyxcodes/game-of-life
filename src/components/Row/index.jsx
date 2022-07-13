import React, { Component } from "react";
import Cell from "../Cell"

class Row extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log("Row - Got props (value)", this.props.value);
    if ( this.props.value ) {
      const cells = this.props.value.map( (cellState, index) => <Cell key={index} status={cellState}/>
      )
      return (<div className="row">{cells}</div>)
    }
  }
}

export default Row;