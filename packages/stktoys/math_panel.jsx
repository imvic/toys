import * as React from "react";
import * as ReactDOM from "react-dom";

const ModeQuestion = 0;
const ModeAnswer = 1;

const styleContainer = {
  color: "#666",
  display: "inline-block",
  fontFamily: "arial, sans-serif",
  fontSize: "2.5rem",
  margin: "auto",
  textAlign: "center"
};

const styleTitle = {
  textAlign: "middle",
  lineHeight: "5rem"
};

const styleNum = {
  textAlign: "middle",
  letterSpacing: "1rem"
};

export const styleInput = {
  backgroundColor: "wihte",
  border: "solid 1px #ccc",
  color: "#666",
  fontSize: "2.5rem",
  padding: "1rem",
  margin: "1rem 0",
  width: "60%"
};

const styleButton = {
  backgroundColor: "#333",
  border: "none",
  color: "#fff",
  fontSize: "2.5rem",
  margin: "1rem 0",
  padding: "1rem"
};

export class MathPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      mode: ModeQuestion,
      min: 10000,
      max: 99999,
      nums: [],
      numCount: 2,
      op: 0,
      value: ""
    };

    this.calAnswer = this.calAnswer.bind(this);
    this.onChangeOp = this.onChangeOp.bind(this);
    this.genNums = this.genNums.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onChangeMin = this.onChangeMin.bind(this);
    this.onChangeMax = this.onChangeMax.bind(this);
    this.onChangeNumCount = this.onChangeNumCount.bind(this);
  }

  componentWillMount() {
    this.setState({ nums: this.genNums() });
  }

  genNums() {
    const min = Math.floor(Number(this.state.min));
    const max = Math.floor(Number(this.state.max));
    const numCount = Math.floor(Number(this.state.numCount));
    return Array.from(Array(numCount).keys()).map(num =>
      Math.floor(min + Math.random() * (max - min), 10)
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
      nums: this.genNums(),
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
        return this.state.nums.reduce((acc, value) => acc + value);
      case 1:
        return this.state.nums.reduce((acc, value) => acc - value);
      case 2:
        return this.state.nums.reduce((acc, value) => acc * value);
      default:
        return this.state.nums.reduce((acc, value) => acc / value);
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

    const numbers = this.state.nums.map((num, id) => {
      return (
        <div key={`num-${id}`} style={styleNum}>
          {num}
        </div>
      );
    });

    const operator =
      this.state.op === 0
        ? "+"
        : this.state.op === 1
          ? "-"
          : this.state.op === 2
            ? "*"
            : "/";

    return (
      <div style={{ ...styleContainer, ...this.props.style }}>
        <div style={styleTitle}>
          Count: {this.state.count} | Operator: {operator}
        </div>
        {numbers}
        <div>
          {opButtons}
          <div>
            <input
              placeholder="number count"
              style={styleInput}
              type="number"
              value={this.state.numCount}
              onChange={this.onChangeNumCount}
            />
          </div>
          <div>
            <input
              placeholder="min"
              style={styleInput}
              type="number"
              value={this.state.min}
              onChange={this.onChangeMin}
            />
          </div>
          <div>
            <input
              placeholder="max"
              style={styleInput}
              type="number"
              value={this.state.max}
              onChange={this.onChangeMax}
            />
          </div>
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

MathPanel.defaultProps = {
  style: {}
};
