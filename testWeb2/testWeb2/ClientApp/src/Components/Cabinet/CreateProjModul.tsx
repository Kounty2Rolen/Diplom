import React from "react";
import { ContextInput } from "../Context";
import { Input, Container, Row, Col } from "reactstrap";
import "../Cabinet/Cabinet.css";

interface state {
    ProjectName: string;
}

export class CreateProjectModul extends React.Component<{}, state> {
    constructor(props: state) {
        super(props);
        this.state = {
            ProjectName: ""
        };
    }
    public inpOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ProjectName: e.target.value });
    };
    public render() {
        return (
            <Container className="createProjectModul">
                <Row>
                    <Col>
                        <h2>Create project</h2>
                    </Col>
                </Row>
                <Row className="createProjectModulBody">
                    <Col xs="auto">

                        <Input
                            placeholder="Project name"
                            className="ProjectNameInput"
                            onChange={this.inpOnChange}
                            value={this.state.ProjectName}
                        ></Input>
                        <Row>
                            <ContextInput ProjName={this.state.ProjectName} />
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}