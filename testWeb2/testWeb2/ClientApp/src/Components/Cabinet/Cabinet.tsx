import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Button } from "reactstrap";
import "./Cabinet.css";
import { CreateProjectModul } from "./CreateProjModul";
import { DataEditModul } from "./DataEditModul";
import { ProjectModul } from "./Projects/ProjectModul";

export class Cabinet extends React.Component {
    public componentDidMount() {
    }

    public render() {
        if (sessionStorage.getItem("Token") == null) {
            return <Redirect to="/Home" />;
        }
        return (
            <div className="Main">
                <DataEditModul />
                <ProjectModul />
                <CreateProjectModul />
            </div>
        );
    }
}
