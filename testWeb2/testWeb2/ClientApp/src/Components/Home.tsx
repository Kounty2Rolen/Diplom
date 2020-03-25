import React from "react";
import { InpCode } from "./Code/InputCode";
import { ContextInput } from "./Context";
import "./Home.css";
import { Button, UncontrolledCollapse, Card, CardBody } from "reactstrap";

export class Home extends React.Component {
    public render() {
        return (
            <div className="homeContainer">
                <br />
                <div className={"homeConnectionContainer"}>
                    <Button
                        className="tglButton"
                        color="primary"
                        id="toggler"
                        style={{ marginBottom: "1rem" }}
                    >
                        Context
          </Button>
                    <UncontrolledCollapse toggler="#toggler">
                        <Card
                            style={{
                                backgroundColor: "#34475b",
                                boxShadow: " 0 0 10px rgba(0,0,0,0.5)"
                            }}
                        >
                            <CardBody>
                                <ContextInput ProjName=""></ContextInput>
                            </CardBody>
                        </Card>
                    </UncontrolledCollapse>
                </div>
                <br />
                <InpCode model="" />
            </div>
        );
    }
}