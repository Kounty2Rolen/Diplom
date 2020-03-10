import React, { Props } from "react";
import GetInfo from "../../../Services/AccountServicesGetInfo";
import { InpCode } from "../../Code/InputCode";
import "./ProjectInfo.css";
import ProjectTree from "./ProjectTree";
interface props {
  match: {
    params: { ProjectId: string };
  };
}
interface state {
  Project: {
  name: string,
  connectionString: string,
  context: string,
  Model: string,
  };
}
class ProjectInfo extends React.Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      Project: {
      name: "",
      connectionString: "",
      context: "",
      Model: "",
      },
    };
  }

  public componentDidMount() {
     GetInfo.GetProjectInfo(this.props.match.params.ProjectId).then((data: any) => this.setState({Project: data}));

  }
  public render() {
  return (
    <div>
      <div className="ModelCode">
        <ProjectTree></ProjectTree>
      </div>
      <InpCode></InpCode>
    </div>);
  }
}
export default ProjectInfo;
