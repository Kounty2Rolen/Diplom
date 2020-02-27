import React from "react";
import { Link } from "react-router-dom";
import GetInfo from "../../../Services/AccountServicesGetInfo";
import ProjectInfo from "./ProjectInfo";

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
                    name: "",
                },
            ],
        };
    }

    public componentDidMount() {
        GetInfo.getProjects().then((projects: any) =>
            this.setState({ projects }),
        );
    }
    public render() {
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
