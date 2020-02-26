import React from "react";
import "../Home.css";
import { Button, Row, Col } from "reactstrap";
import ReactCodeMirror from "react-codemirror";
import CodeMirror from "codemirror";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/mode/clike/clike";

interface props {
  Result: {
    resultcode: string;
    sql: string;
  };
}

export class Result extends React.Component<props> {
  constructor(props: props) {
    super(props);
  }

  render() {

    let options = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-csharp",
      readOnly: true,
      value: this.props.Result.resultcode+"\n\n\n"+this.props.Result.sql
    };
    console.log(this.props.Result);
    
    return (
      <ReactCodeMirror
        className="ResultCode"
        options={options}
      ></ReactCodeMirror>
    );
  }
}
