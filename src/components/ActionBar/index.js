import React, { Component } from "react";

class ActionBar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>
        <input type="file"/>
        <input type="submit" value="Upload"></input><br/>
        <input type="button" onClick={(e) => this.props.calcNextGen()} value="Calculate next gen"></input>
      </div>
    );
  }
}

export default ActionBar;