import React, { useRef, Component } from "react";

const defaultText =
  "Generation 3:\n" +
  "4 8\n" +
  "* * * * * * * *\n" +
  "* * * * # * * *\n" +
  "* * * # # * * *\n" +
  "* * * * * * * *\n";

class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePresent: false,
    };
  }

  checkFile(e) {
    var testFileExtension = new RegExp(".txt", "i");
    if (e.target.value && testFileExtension.exec(e.target.value)) {
      console.log("ActionBar - File is ok");
      this.setState({ filePresent: true });
    } else {
      this.setState({ filePresent: false });
      alert("File is not a .txt");
    }
  }

  render() {
    return (
      <div>
        <input
          type="file"
          ref="fileInput"
          onChange={(e) => this.checkFile(e)}
        />
        <input
          type="submit"
          disabled={!this.state.filePresent}
          value="Upload"
          onClick={(e) => this.props.uploadFile(this.refs.fileInput)}
        ></input>
        <br />
        <input
          type="button"
          onClick={(e) => this.props.calcNextGen()}
          value="Calculate next gen"
        ></input>
        <br />
        <textarea
          value={this.props.textPreview || defaultText}
          readOnly
        ></textarea>
      </div>
    );
  }
}

export default ActionBar;