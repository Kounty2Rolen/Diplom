import React from "react";
import "./Cabinet.css";
import { Link, Redirect } from "react-router-dom";
import { DataEditModul } from "./DataEditModul";
import { addListener } from "cluster";


interface state {
  OldPassword: string;
  NewPassword: string;
  projects: string[];
  Person: {
    fname: string;
    mname: string;
    loginName: string;
  };
}
export class Cabinet extends React.Component<{}, state> {
  constructor(props: state) {
    super(props);
    this.state = {
      OldPassword: "",
      NewPassword: "",
      projects: [],
      Person: {
        fname: "",
        mname: "",
        loginName: ""
      }
    };
  }


  render() {
    if (sessionStorage.getItem("Token") == null) {
      return <Redirect to="/Home" />;
    }
    console.log(this.state.Person.fname);
    return (
      <div className="Main">
        <DataEditModul />

        <div className="ProjectsModul">
          <div className="ProjectSelect">
            <h2>Your projects</h2>
            <div className="Projects">
              <ul>
                {this.state.projects.map((item, key) => (
                  <li>
                    <Link to="/Account/Project">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
