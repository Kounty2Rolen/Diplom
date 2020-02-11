import React, { Props } from "react";
import "./ProjectInfo.css";
import { Row, Col } from "reactstrap";

interface props {
  match: {
    params: { ProjectId: string };
  };
}

class ProjectInfo extends React.Component<props> {
  constructor(props: props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    console.log(this.props.match.params.ProjectId);
    return <div></div>;
  }
}
export default ProjectInfo;
