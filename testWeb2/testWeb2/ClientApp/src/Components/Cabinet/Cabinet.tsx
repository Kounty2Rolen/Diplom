import React from "react";
import "./Cabinet.css";
import { Button, Label, Input } from "reactstrap";
import { ContextInput } from "../Context";
import { Link } from "react-router-dom";

interface state {
  projects: string[];
  Person: {
    Fname: string;
    Mname: string;
    LoginName: string;
  };
}
export class Cabinet extends React.Component<{}, state> {
  constructor(props: state) {
    super(props);
    this.state = {
      projects: [],
      Person: {
        Fname: "",
        Mname: "",
        LoginName: ""
      }
    };
  }
  getPersonInfo() {
    fetch("AccountInfo/getInfo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      }
    })
      .then(Response => Response.json())
      .then(data => {
        this.setState({ Person: data });
      });
  }
  componentDidMount() {
    this.getProjects();
    this.getPersonInfo();
  }

  getProjects() {
    fetch("AccountInfo/GetProjects", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      }
    })
      .then(Response => Response.json())
      .then(data => this.setState({ projects: data }));
  }
  onChangeOldPassword(){

  }
  onChangeNewPassword(){

  }
  buttonOnClick(){
  }
  render() {
    return (
      <div className="Main">
        <div className="dataEditModul">
          <h2>Edit Profile</h2>
          <div className="FieldsModul">
            <div className="Fields">
              {console.log(this.state.Person)}
              <Label className="Label">FName</Label>
              <Input
                className="Input inputFname"
                value={this.state.Person.Fname}
              ></Input>
              <Label className="Label">MName</Label>
              <Input
                className="Input inputMname"
                value={this.state.Person.Mname}
              ></Input>
              <Label className="Label">Old password</Label>
              <Input className="Input inputOldPass" type="password"></Input>
              <Label className="Label">New password</Label>
              <Input className="Input inputNewPass" type="password"></Input>
            </div>
            <Button color="success" className="btn" onClick={this.buttonOnClick}>
              Confirm
            </Button>
          </div>
        </div>

        <div className="createProjectModul">
          <h2>Create project</h2>
          <div className="createProjectModulBody">
            <div className="createProjectFields">
              <input
                placeholder="Project name"
                className="ProjectNameInput"
              ></input>
            </div>
            <div className="contextGenerate">
              <ContextInput />
            </div>
          </div>
        </div>
        <div className="ProjectsModul">
          <div className="ProjectSelect">
            <h2>Your projects</h2>
            <div className="Projects">
              <ul>
                {this.state.projects.map((item, key) => (
                  <li>
                    <Link to="/Project">{item}</Link>
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
