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
    const options = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-csharp",
      autoScroll: true,
      autoSize: true,
      readOnly: true,
      value: this.props.Result.resultcode + "\n" + this.props.Result.sql
    };

    return (
      <Container>
        <Row>
          <Col>
            <div className="ResizeBox" style={{ resize: "both" }}>
              <ReactCodeMirror
                className="ResultCode"
                options={options}
              ></ReactCodeMirror>
            </div>
          </Col>
          <Col>
            <ReactCodeMirror
              className="ResultCode SQL"
              options={options}
            ></ReactCodeMirror>
          </Col>
        </Row>
      </Container>
    );
  }
}
