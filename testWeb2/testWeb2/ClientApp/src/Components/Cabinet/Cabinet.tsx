import React from "react";
import "./Cabinet.css";
import { Link, Redirect } from "react-router-dom";
import { DataEditModul } from "./DataEditModul";
import {ProjectModul} from './Projects/ProjectModul'
import { CreateProjectModul } from "./CreateProjModul";


export class Cabinet extends React.Component{

  render() {
    if (sessionStorage.getItem("Token") == null) {
      return <Redirect to="/Home" />;
    }
    return (
      <div className="Main">
        <DataEditModul />
        <ProjectModul/>
        <CreateProjectModul/>

      </div>
    );
  }
}
