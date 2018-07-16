import * as React from "react";
import * as ReactDOM from "react-dom";

const ModeQuestion = 0;
const ModeAnswer = 1;

const styleContainer = {
  color: "#666",
  fontFamily: "arial, sans-serif",
  fontSize: "2rem",
  margin: "auto",
  textAlign: "center"
};

const styleInput = {
  border: "solid 1px #ccc",
  padding: "1rem",
  margin: "1rem 0"
};

const styleButton = {
  backgroundColor: "#2ecc71",
  border: "none",
  color: "#fff",
  margin: "1rem 0",
  padding: "1rem"
};

class MMathPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mode: ModeQuestion,
      value: 0,
      min: 0,
      max: 0,
      op1: 0,
      op2: 0
    };
    this.genNum = this.genNum.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onChangeMin = this.onChangeMin.bind(this);
    this.onChangeMax = this.onChangeMax.bind(this);
    this.setState({ op1: this.genNum(), op2: this.genNum() });
  }

  genNum() {
    return Math.floor(
      this.state.min + Math.random() * (this.state.max - this.state.min),
      10
    );
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
      op2: this.genNum()
    });
  }

  onChangeMin(event) {
    this.setState({ min: Number(event.target.value) });
  }

  onChangeMax(event) {
    this.setState({ max: Number(event.target.value) });
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
          <div>Answer: {this.state.op1 + this.state.op2}</div>
        </div>
      ) : (
        ""
      );
    return (
      <div style={styleContainer}>
        <h3>{`${this.state.op1} + ${this.state.op2}`}</h3>
        <div>
          <input
            placeholder="min"
            style={styleInput}
            value={this.state.min}
            onChange={this.onChangeMin}
          />
          <input
            placeholder="max"
            style={styleInput}
            value={this.state.max}
            onChange={this.onChangeMax}
          />
        </div>
        <div>
          <input
            style={styleInput}
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
