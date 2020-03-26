import React from "react";
import { InpCode } from "./Code/InputCode";
import "./Home.css";
import {
  Button,
  UncontrolledCollapse,
  Card,
  CardBody,
  Container,
  Row,
  Col
} from "reactstrap";

export class Home extends React.Component {
  public render() {
    return (
      <div className="homeContainer">
        <br />
        <Container className={"homeConnectionContainer"}>
          <Row>
            <InpCode model="" />
          </Row>
        </Container>
      </div>
    );
  }
}
