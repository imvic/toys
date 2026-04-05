import * as React from "react";
import * as ReactDOM from "react-dom";
import { MathPanel, styleInput } from "./math_panel";

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      txs: [{ price: 0, count: 0 }],
      exit: {
        price: 0,
        count: 0,
      },
    };

    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeCount = this.onChangeCount.bind(this);
    this.onAddTx = this.onAddTx.bind(this);
    this.onDelTx = this.onDelTx.bind(this);
    this.onChangeExitPrice = this.onChangeExitPrice.bind(this);
    this.onChangeExitCount = this.onChangeExitCount.bind(this);
  }

  onChangePrice(id, strVal) {
    let val = 0.0;
    try {
      val = parseFloat(strVal).toFixed(2);
    } catch (e) {
      val = 0.0;
    }

    const newTx = { count: this.state.txs[id].count, price: val };
    const newTxs = [
      ...this.state.txs.slice(0, id),
      newTx,
      ...this.state.txs.slice(id + 1),
    ];

    this.setState({ txs: newTxs });
  }

  onChangeCount(id, strVal) {
    const val = parseInt(strVal);
    const newTx = { price: this.state.txs[id].price, count: val };
    const newTxs = [
      ...this.state.txs.slice(0, id),
      newTx,
      ...this.state.txs.slice(id + 1),
    ];

    this.setState({ txs: newTxs });
  }

  onAddTx() {
    this.setState({
      txs: [...this.state.txs, { price: 0, count: 0 }],
    });
  }

  onDelTx() {
    this.setState({
      txs: this.state.txs.slice(0, this.state.txs.length - 1),
    });
  }

  onChangeExitPrice(e) {
    let price = 0.0;
    try {
      price = parseFloat(e.target.value).toFixed(2);
    } catch (e) {
      price = 0;
    }

    this.setState({
      exit: {
        price,
        count: this.state.exit.count,
      },
    });
  }

  onChangeExitCount(e) {
    const count = parseInt(e.target.value);
    this.setState({
      exit: {
        price: this.state.exit.price,
        count,
      },
    });
  }

  render() {
    const txRows = this.state.txs.map((tx, id) => (
      <div
        key={`panel-${id}`}
        // style={{ width: `${Math.floor(100 / txCount)}%` }}
      >
        <input
          placeholder="Price"
          type="text"
          onChange={(e) => {
            this.onChangePrice(id, e.target.value);
          }}
        ></input>
        <input
          placeholder="Count"
          type="text"
          onChange={(e) => {
            this.onChangeCount(id, e.target.value);
          }}
        ></input>
      </div>
    ));

    let hold = 0;
    let totalCount = 0;
    this.state.txs.forEach((tx) => {
      hold += tx.price * tx.count;
      totalCount += tx.count;
    });
    hold = hold.toFixed(2);

    const priceAvg = (hold / totalCount).toFixed(2);
    const sold = (this.state.exit.price * this.state.exit.count).toFixed(2);
    const loss = (
      (this.state.exit.price - priceAvg) *
      this.state.exit.count
    ).toFixed(2);
    const leftCount = totalCount - this.state.exit.count;
    const leftValue = (priceAvg * leftCount).toFixed(2);

    return (
      <div>
        {txRows}
        <div>
          <button onClick={this.onAddTx}>AddTx</button>
          <button onClick={this.onDelTx}>DelTx</button>
        </div>
        <div>
          <input
            onChange={this.onChangeExitPrice}
            placeholder={"ExitPrice"}
            type="text"
          ></input>
          <input
            onChange={this.onChangeExitCount}
            placeholder={"ExitCount"}
            type="text"
          ></input>
        </div>
        <div>
          <div>{`Pre: ${hold} = ${priceAvg} x ${totalCount}`}</div>
          <div>{`Sold: ${sold} (${((sold / hold) * 100).toFixed(2)}%) = ${this.state.exit.price} x ${this.state.exit.count}`}</div>
          <div>{`Loss: ${loss} (${((loss / sold) * 100).toFixed(2)}%) = ${(priceAvg - this.state.exit.price).toFixed(2)} x ${this.state.exit.count}`}</div>
          <div>{`Post: ${leftValue} (${((leftValue / hold) * 100).toFixed(2)}%) = ${priceAvg} x  ${leftCount}`}</div>
        </div>
      </div>
    );
  }
}

App.defaultProps = {};

ReactDOM.render(<App />, document.getElementById("app"));
