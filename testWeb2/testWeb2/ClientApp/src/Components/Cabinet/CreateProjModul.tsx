import React from "react";
import { ContextInput } from "../Context";



export class CreateProjectModul extends React.Component{

    render(){
        return(
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
        )
    }
}