import React, { MouseEvent, EventHandler } from "react";
import { Link } from "react-router-dom";
import GetInfo from "../../../Services/AccountServicesGetInfo";
import ProjectInfo from "./ProjectInfo";
import { Button } from "reactstrap";
import "./ProjectModul.css";
import projsevice from "../../../Services/ProjectService";

interface state {
  projects: [
    {
      id: 0;
      name: string;
    }
  ];
}
export class ProjectModul extends React.Component<{}, state> {
  constructor(props: state) {
    super(props);
    this.state = {
      projects: [
        {
          id: 0,
          name: ""
        }
      ]
    };
  }

  public btnClick(item: any) {
    console.log(typeof item);
    console.log(typeof item.id);

    if (confirm("Are you sure you want to delete this project?")) {
      projsevice.RemoveProj(item.id);
      let project = this.state.projects;
      project.splice(project.indexOf(item), 1);
      this.setState({projects:project})
    }
  }
  public componentDidMount() {
    GetInfo.getProjects().then((projects: any) => this.setState({ projects }));
  }
  public render() {
    console.log(this.state.projects);
    return (
      <div className="ProjectsModul">
        <div className="ProjectSelect">
          <h2>Your projects</h2>
          <div className="Projects">
            <ul>
              {this.state.projects.map(item => (
                <li key={item.id}>
                  <Link to={"/Account/Project/" + item.id}>{item.name}</Link>
                  <Button
                    className="CloseBtn"
                    onClick={() => {
                      this.btnClick(item);
                    }}
                    close
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
