import * as React from "react";
import * as ReactDOM from "react-dom";

const ModeQuestion = 0;
const ModeAnswer = 1;

const styleTitle = {
  textAlign: "middle",
  letterSpacing: "1rem"
};

const styleContainer = {
  color: "#666",
  fontFamily: "arial, sans-serif",
  fontSize: "4rem",
  margin: "auto",
  textAlign: "center"
};

const styleInput = {
  backgroundColor: "wihte",
  border: "solid 1px #ccc",
  color: "#666",
  fontSize: "3rem",
  padding: "1rem",
  margin: "1rem 0"
};

const styleSelect = {
  backgroundColor: "wihte",
  border: "solid 1px #ccc",
  color: "#666",
  fontSize: "3rem",
  padding: "1rem",
  margin: "1rem 0",
  display: "block"
};

const styleButton = {
  backgroundColor: "#2ecc71",
  border: "none",
  color: "#fff",
  fontSize: "3rem",
  margin: "1rem 0",
  padding: "1rem"
};

class MMathPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mode: ModeQuestion,
      value: "",
      min: 10000,
      max: 99999,
      op1: 0,
      op2: 0,
      nums: [],
      numCount: 2,
      op: 0,
      count: 0
    };

    this.calAnswer = this.calAnswer.bind(this);
    this.onChangeOp = this.onChangeOp.bind(this);
    this.genNum = this.genNum.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onChangeMin = this.onChangeMin.bind(this);
    this.onChangeMax = this.onChangeMax.bind(this);
    this.onChangeNumCount = this.onChangeNumCount.bind(this);
  }

  componentWillMount() {
    const nums = Array.from(Array(this.state.numCount).keys()).map(num => num);
    this.setState({ nums });
  }

  genNum() {
    const min = Number(this.state.min);
    const max = Number(this.state.max);
    return Math.floor(min + Math.random() * (max - min), 10);
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onSubmit(event) {
    this.setState({ mode: ModeAnswer });
  }

  onRefresh() {
    this.setState({
      mode: ModeQuestion,
      op1: this.genNum(),
      op2: this.genNum(),
      value: "",
      count: this.state.count + 1
    });
  }

  onChangeMin(event) {
    this.setState({ min: event.target.value });
  }

  onChangeMax(event) {
    this.setState({ max: event.target.value });
  }

  onChangeOp(op) {
    this.setState({ op });
  }

  onChangeNumCount(event) {
    this.setState({ numCount: event.target.value });
  }

  calAnswer() {
    switch (this.state.op) {
      case 0:
        return this.state.op1 + this.state.op2;
      case 1:
        return this.state.op1 - this.state.op2;
      case 2:
        return this.state.op1 * this.state.op2;
      default:
        return this.state.op1 / this.state.op2;
    }
  }

  render() {
    const button =
      this.state.mode === ModeQuestion ? (
        <button style={styleButton} onClick={this.onSubmit}>
          Submit
        </button>
      ) : (
        <button style={styleButton} onClick={this.onRefresh}>
          Refresh
        </button>
      );

    const answer =
      this.state.mode === ModeAnswer ? (
        <div>
          <div>Yours: {this.state.value}</div>
          <div>Answer: {this.calAnswer()}</div>
        </div>
      ) : (
        ""
      );

    const opButtons = (
      <div>
        <button style={styleButton} onClick={() => this.onChangeOp(0)}>
          plus
        </button>
        <button style={styleButton} onClick={() => this.onChangeOp(1)}>
          minus
        </button>
        <button style={styleButton} onClick={() => this.onChangeOp(2)}>
          multiply
        </button>
        <button style={styleButton} onClick={() => this.onChangeOp(3)}>
          divide
        </button>
      </div>
    );

    const numbers = this.state.return(
      <div style={styleContainer}>
        <h3 style={styleTitle}>
          {this.state.count} {this.state.op}
        </h3>
        <h3 style={styleTitle}>{this.state.op1}</h3>
        <h3 style={styleTitle}>{this.state.op2}</h3>
        <div>
          {opButtons}
          <input
            placeholder="number count"
            style={styleInput}
            type="number"
            value={this.state.numCount}
            onChange={this.onChangeNumCount}
          />
          <input
            placeholder="min"
            style={styleInput}
            type="number"
            value={this.state.min}
            onChange={this.onChangeMin}
          />
          <input
            placeholder="max"
            style={styleInput}
            type="number"
            value={this.state.max}
            onChange={this.onChangeMax}
          />
        </div>
        <div>
          <input
            style={styleInput}
            type="number"
            value={this.state.value}
            onChange={this.onChange}
          />
        </div>
        {button}
        {answer}
      </div>
    );
  }
}

MMathPanel.defaultProps = {};

ReactDOM.render(<MMathPanel />, document.getElementById("app"));
