import React, { Props } from "react";
import "./ProjectInfo.css";
import { Row, Col } from "reactstrap";
import { InpCode } from "../../Code/InputCode";
import ProjectTree from "./ProjectTree"
import GetInfo from "../../../Services/AccountServicesGetInfo"
interface props {
  match: {
    params: { ProjectId: string };
  };
}
interface state{
  Project:{
  name:string,
  connectionString:string,
  context:string,
  Model:string

  }
}
class ProjectInfo extends React.Component<props,state> {
  constructor(props: props) {
    super(props);
    this.state={
      Project:{
      name:"",
      connectionString:"",
      context:"",
      Model:""
      }
    }
  }

  componentDidMount() {
     GetInfo.GetProjectInfo(this.props.match.params.ProjectId).then((data:any)=>this.setState({Project:data},()=>{console.log(data)}));
    console.log(this.state.Project);
  }
  render() {
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