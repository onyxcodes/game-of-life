import React, { Component } from "react";

class Cell extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div style={{ backgroundColor: this.props.status ? "green" : "grey" }}>#</div>
    )
  }
}

export default Cell;