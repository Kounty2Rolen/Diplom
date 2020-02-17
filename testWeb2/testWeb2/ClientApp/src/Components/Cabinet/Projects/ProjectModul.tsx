import React from "react";
import GetInfo from "../../../Services/AccountServicesGetInfo";
import { Link } from "react-router-dom";
import ProjectInfo from "./ProjectInfo";

interface state {
  projects: [
    {
      id: 0;
      name: "";
    }
  ];
}
export class ProjectModul extends React.Component<{}, state> {
  constructor(props: state) {
    super(props);
    this.state={
    projects: [
        {
          id: 0,
          name: ""
        }
      ]};
  }

  componentDidMount() {
    GetInfo.getProjects().then((projects: any) =>
      this.setState({ projects: projects })
    );
  }
  render() {
      console.log(this.state.projects);
    return (
      <div className="ProjectsModul">
        <div className="ProjectSelect">
          <h2>Your projects</h2>
          <div className="Projects">
            <ul>
              {this.state.projects.map((item, key) => (
                <li>
                  <Link to={"/Account/Project/" + item.id}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}