import React from "react";
import { Redirect } from "react-router-dom";
import "./Cabinet.css";
import { CreateProjectModul } from "./CreateProjModul";
import { DataEditModul } from "./DataEditModul";
import { ProjectModul } from "./Projects/ProjectModul";
import { Container, Row, Col } from "reactstrap";

export class Cabinet extends React.Component {
  public componentDidMount() {}

  public render() {
    if (sessionStorage.getItem("Token") == null) {
      return <Redirect to="/Home" />;
    }
    return (
      <Container className="Main">
        <Row xs="auto">
          <Col xs="auto">
            <CreateProjectModul />
          </Col>
          <Col xs="auto">
            <ProjectModul />
          </Col>
          <Col xs="auto">
            <DataEditModul />
          </Col>
        </Row>
      </Container>
    );
  }
}
