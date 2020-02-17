import React, { Props } from "react";
import "./ProjectInfo.css";
import { Row, Col } from "reactstrap";

interface props {
  match: {
    params: { ProjectId: string };
  };
}
interface state{
  Project:{
  name:string,
  connectionString:string,
  context:string
  }
}
class ProjectInfo extends React.Component<props,state> {
  constructor(props: props) {
    super(props);
    this.state={
      Project:{
      name:"",
      connectionString:"",
      context:""
      }
    }
  }

  componentDidMount() {
    fetch('/Project/GetProjectInfo',{
      method:'POST',
      headers:{
        "Content-type": "application/json",
        Authorization: "Bearer "+sessionStorage.getItem("Token")
      },
      body: JSON.stringify(this.props.match.params.ProjectId)
    }).then(Response=>Response.json()).then(data=>this.setState({Project:data},()=>{console.log(data)}));
    console.log(this.state.Project);
  }
  render() {
  return (
    <div>
      <div className="ModelCode">

      </div>
    </div>);
  }
}
export default ProjectInfo;