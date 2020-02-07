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
        className="txtArea resultArea"
        rows={20}
        cols={70}
        defaultValue={this.props.codeResult}
        placeholder="result"
      ></textarea>
    );
  }
}
