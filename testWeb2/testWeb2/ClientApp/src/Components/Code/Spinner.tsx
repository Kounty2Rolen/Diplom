import React from "react";
import { Spinner } from "reactstrap";

interface props {
  Spin: boolean;
}

export class Spin extends React.Component<props> {
    constructor (props:props)
    {
        super(props);
    }
  render() {
      debugger;
      console.log(this.props.Spin);
    if (this.props.Spin) {
      return <Spinner color="Primary"></Spinner>;
    }else
    return<span></span>;

  }
}
