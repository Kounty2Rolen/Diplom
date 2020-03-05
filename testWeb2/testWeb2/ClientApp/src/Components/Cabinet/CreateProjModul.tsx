import React from "react";
import { ContextInput } from "../Context";
import { Input } from "reactstrap";
import "../Cabinet/Cabinet.css"

interface state {
    ProjectName: string;
}

export class CreateProjectModul extends React.Component<{}, state> {
    constructor(props: state) {
        super(props);
        this.state = {
            ProjectName: "",
        };
    }
    public inpOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ProjectName: e.target.value });
    }
    public render() {
        return (
            <div className="createProjectModul">
                <h2>Create project</h2>
                <div className="createProjectModulBody">
                    <div className="createProjectFields">
                        <Input
                            placeholder="Project name"
                            className="ProjectNameInput"
                            onChange={this.inpOnChange}
                            value={this.state.ProjectName}
                        ></Input>
                    </div>
                    <div className="contextGenerate">
                        <ContextInput ProjName={this.state.ProjectName} />
                    </div>
                </div>
            </div>
        );
    }
}
