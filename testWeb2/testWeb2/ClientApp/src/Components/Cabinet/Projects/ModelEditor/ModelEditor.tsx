import React from "react";
import { InpCode } from "../../../Code/InputCode";
import { ListGroupItemHeading, Container, Row, Col } from "reactstrap";

interface props {
  match: {
    params: { File: string };
  };
}

class ModelEditor extends React.Component<props, {}> {
  constructor(props: props) {
    super(props);
  }
  proj = JSON.parse(localStorage?.getItem("Object") ?? "");

  render() {
    let Files = Array.from(this.proj.fileNames);
    let id = Files.indexOf(this.props.match.params.File + ".cs");
    let models = Array.from(this.proj.models);
    let model = models[id] as string;
    console.log(models, id);

    return (
      <Container>
        <br></br>
        <InpCode model={model}></InpCode>
      </Container>
    );
  }
}
export default ModelEditor;
