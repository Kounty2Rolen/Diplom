import React from "react";
import "../Home.css";


interface props {
  codeResult: string;
}

export class Result extends React.Component<props> {
  constructor(props: props) {
    super(props);
  }

  render() {
    return (
      <textarea
        className="txtArea"
        rows={20}
        cols={70}
        value={this.props.codeResult}
        placeholder="result"
      ></textarea>
    );
  }
}
