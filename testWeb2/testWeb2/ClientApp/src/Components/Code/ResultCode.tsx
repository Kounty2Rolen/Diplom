import React from "react";
import ReactCodeMirror from "react-codemirror";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/mode/clike/clike";
import "../Home.css";
import { Container, Col, Row } from "reactstrap";
interface props {
  Result: {
    resultcode: string;
    sql: string;
  };
}

export class Result extends React.Component<props> {
  constructor(props: props) {
    super(props);
  }

  componentDidMount() {}

  public render() {
    const optionsResult = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-csharp",
      autoScroll: true,
      autoSize: true,
      readOnly: true,
      value: this.props.Result.resultcode
    };
    const optionsSQL = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-csharp",
      autoScroll: true,
      autoSize: true,
      readOnly: true,
      value: this.props.Result.sql
    };
    return (
      <Container>
        <Row>
          <Col>
            <div className="ResizeBox" style={{ resize: "both" }}>
              <ReactCodeMirror
                className="ResultCode"
                options={optionsResult}
              ></ReactCodeMirror>
            </div>
          </Col>
          <Col>
            <ReactCodeMirror
              className="ResultCode SQL"
              options={optionsSQL}
            ></ReactCodeMirror>
          </Col>
        </Row>
      </Container>
    );
  }
}
