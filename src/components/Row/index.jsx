import React, { Component } from "react";
import Cell from "../Cell"

class Row extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    if ( this.props.value ) {
      const cells = this.props.value.map( (cellState, index) => <Cell key={index} status={cellState}/>
      )
      return (<div className="row">{cells}</div>)
    }
  }
}

export default Row;