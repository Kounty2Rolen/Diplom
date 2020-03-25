import React from "react";
import GetInfo from "../../../Services/AccountServicesGetInfo";
import { InpCode } from "../../Code/InputCode";
import "./ProjectInfo.css";
import ProjService from "../../../Services/ProjectService";
import Sidebar from "./SideBar";

interface props {
  match: {
    params: { ProjectId: string };
  };
}
interface state {
  Project: {
    name: string;
    connectionString: string;
    context: string;
    Model: string;
  };
  sidebarState: boolean;
}
class ProjectInfo extends React.Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      Project: {
        name: "",
        connectionString: "",
        context: "",
        Model: ""
      },
      sidebarState: false
    };
  }

  public componentDidMount() {
    GetInfo.GetProjectInfo(this.props.match.params.ProjectId).then(
      (data: any) => {
        this.setState({ Project: data });
      }
    );
    ProjService.projectLoad(this.props.match.params.ProjectId).then(item =>
      localStorage.setItem("Object", item)
    );
  }
  public render() {
    if (
      localStorage.getItem("Object") === null ||
      localStorage.getItem("Object") === ""
    ) {
      this.componentDidMount();
    }
    return (
      <div>
        <div className="ModelCode">
          <div>
            <Sidebar></Sidebar>
          </div>
          <InpCode model=""></InpCode>
        </div>
      </div>
    );
  }
}
export default ProjectInfo;