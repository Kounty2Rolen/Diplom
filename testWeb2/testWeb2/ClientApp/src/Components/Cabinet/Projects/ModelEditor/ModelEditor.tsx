import React from "react";
import ReactCodeMirror from "react-codemirror";
import { Container, Button } from "reactstrap";

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
    debugger;
    let toSend = {
      Id: this.proj.id,
      FileName: this.props.match.params.File + ".cs",
      Model: this.models[this.id]
    };
    let ser = JSON.stringify(this.proj);
    fetch("/Project/EditModel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      },
      body: JSON.stringify(toSend)
    });
    localStorage.setItem("Object", ser);
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
