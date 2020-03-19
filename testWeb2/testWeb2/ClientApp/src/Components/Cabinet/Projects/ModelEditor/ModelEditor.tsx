import React, { EventHandler } from "react";
import { InpCode } from "../../../Code/InputCode";
import ReactCodeMirror from "react-codemirror";
import { ListGroupItemHeading, Container, Row, Col, Button } from "reactstrap";
import { serialize } from "v8";

interface props {
  match: {
    params: { File: string };
  };
}
interface state {
  model: string;
}
class ModelEditor extends React.Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      model: ""
    };
  }
  proj = JSON.parse(localStorage?.getItem("Object") ?? "");
  Files = Array.from(this.proj.fileNames);
  id = this.Files.indexOf(this.props.match.params.File + ".cs");
  models = Array.from(this.proj.models);

  txtAreaOnChange = (event: any) => {
    this.models[this.id] = event;
  };
  componentDidMount() {
    this.setState({ model: this.models[this.id] as string });
  }
  btnClick = () => {
    this.proj.models = this.models;
    console.log();
    let ser=JSON.stringify(this.proj);
    
    localStorage.setItem("Object",ser);
    alert("Saved");
  };
  render() {
    const options = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-csharp",
      value: this.state.model
    };
    return (
      <Container>
        <br></br>
        <ReactCodeMirror
          onChange={this.txtAreaOnChange}
          className="InputCode"
          options={options}
        ></ReactCodeMirror>
        <Button onClick={this.btnClick}>Save</Button>
      </Container>
    );
  }
}
export default ModelEditor;
