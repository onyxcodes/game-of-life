import React, { Component } from "react";

class Cell extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log("Cell - Got this props (status)", this.props.status);
    return(
      <div style={{ backgroundColor: this.props.status ? "green" : "grey" }}>#</div>
    )
  }
}

export default Cell;