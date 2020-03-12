import React, { Props } from "react";
import GetInfo from "../../../Services/AccountServicesGetInfo";
import { InpCode } from "../../Code/InputCode";
import "./ProjectInfo.css";
import ProjectTree from "./ProjectTree";
import ProjService from "../../../Services/ProjectService";
import { Button, UncontrolledCollapse, Card, CardBody } from "reactstrap";

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
      }
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
    console.log(this.state.Project);

    return (
      <div>
        <div className="ModelCode">
          <div>
            <Button
              color="success"
              id="toggler"
              style={{ marginBottom: "1rem",marginLeft:"-92%",position:"inherit",alignSelf:"left"}}

            >
              Model
            </Button>
            <UncontrolledCollapse toggler="#toggler">
              <Card>
                <CardBody>
                  <ProjectTree>

                  </ProjectTree>
                </CardBody>
              </Card>
            <br></br>
            </UncontrolledCollapse>
          </div>
        </div>
        <InpCode></InpCode>
      </div>
    );
  }
}
export default ProjectInfo;
