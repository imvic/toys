import * as React from "react";
import * as ReactDOM from "react-dom";

import { configs } from "./configs";

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      txs: [{ price: "", count: 0 }],
      exit: {
        price: 0,
        count: 0,
      },
      target: 0,
      min: 1,
      max: 30,
      quantiles: [],

      pwd: "",

      interval: {
        start: 0,
        end: 0,
        count: 0,
      },

      config: undefined,
    };
    this.pwd = "st";

    this.onChangeCount = this.onChangeCount.bind(this);
    this.onAddTx = this.onAddTx.bind(this);
    this.onDelTx = this.onDelTx.bind(this);
    this.onChangeExitPrice = this.onChangeExitPrice.bind(this);
    this.onChangeExitCount = this.onChangeExitCount.bind(this);
    this.onChangeTarget = this.onChangeTarget.bind(this);
  }

  onChangePrice = (id, strVal) => {
    const newTx = { count: this.state.txs[id].count, price: strVal };
    const newTxs = [
      ...this.state.txs.slice(0, id),
      newTx,
      ...this.state.txs.slice(id + 1),
    ];

    this.setState({ txs: newTxs });
  };

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
      txs: [...this.state.txs, { price: "", count: 0 }],
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

  onChangeTarget(e) {
    const target = parseFloat(e.target.value).toFixed(2);

    const quantileList = this.calculateQuantiles(
      target,
      this.state.min,
      this.state.max,
    );
    this.setState({
      target,
      quantiles: quantileList,
    });
  }

  calculateQuantiles = (target, min, max) => {
    let quantiles = [];
    for (let i = min; i <= max; i++) {
      quantiles = [...quantiles, i];
    }

    const reverseQuantiles = quantiles.map((quantile) => quantile * -1);
    const allQuantiles = [...reverseQuantiles, ...quantiles];
    const quantileList = allQuantiles.map((quantile) => {
      return {
        name: quantile,
        value: (((quantile + 100.0) / 100.0) * target).toFixed(2),
      };
    });

    return quantileList;
  };

  onChangeMin = (e) => {
    const min = parseInt(e.target.value);

    const quantileList = this.calculateQuantiles(
      this.state.target,
      min,
      this.state.max,
    );
    this.setState({
      min,
      quantiles: quantileList,
    });
  };

  onChangeMax = (e) => {
    const max = parseInt(e.target.value);
    const quantileList = this.calculateQuantiles(
      this.state.target,
      this.state.min,
      max,
    );
    this.setState({
      max,
      quantiles: quantileList,
    });
  };

  onChangePwd = (e) => {
    this.setState({
      pwd: e.target.value,
    });
  };

  onChangeStart = (e) => {
    const start = parseInt(e.target.value);
    this.setState({
      interval: {
        ...this.state.interval,
        start,
      },
    });
  };

  onChangeEnd = (e) => {
    const end = parseInt(e.target.value);
    this.setState({
      interval: {
        ...this.state.interval,
        end,
      },
    });
  };

  onChangePointCount = (e) => {
    const pointCount = parseInt(e.target.value);
    const start = this.state.interval.start;
    const end = this.state.interval.end;

    const txs = this.calculateTxs(pointCount, start, end);

    this.setState({
      interval: {
        ...this.state.interval,
        count: pointCount,
      },
      txs,
    });
  };

  calculateTxs = (count, start, end) => {
    const interval = end - start;
    const incr = interval / count;

    let txs = [];
    for (let i = 0; i < count + 1; i++) {
      const price = start + i * incr;
      txs = [...txs, { price: `${price.toPrecision(2)}`, count: 0 }];
    }

    return txs;
  };

  onChangeConfig = (config) => {
    const txs = this.calculateTxs(3, config.min, config.max);
    this.setState({
      config,
      txs,
    });
  };

  render() {
    const txRows = this.state.txs.map((tx, id) => (
      <div key={`panel-${id}`}>
        <input
          placeholder="Price"
          type="text"
          value={tx.price}
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
    let maxPrice = 0.0;
    this.state.txs.forEach((tx) => {
      const price = parseInt(tx.price);

      hold += price * tx.count;
      totalCount += tx.count;
      if (price - maxPrice > 0) {
        maxPrice = price;
      }
    });
    hold = hold.toFixed(2);

    const priceAvg = (hold / totalCount).toFixed(2);
    const sold = (this.state.exit.price * this.state.exit.count).toFixed(2);
    const gain = (
      (this.state.exit.price - priceAvg) *
      this.state.exit.count
    ).toFixed(2);
    const leftCount = totalCount - this.state.exit.count;
    const leftValue = (priceAvg * leftCount).toFixed(2);
    const interval = (
      ((this.state.exit.price - maxPrice) / maxPrice) *
      100
    ).toFixed(2);

    const quantileListPos = this.state.quantiles
      .filter((q) => q.name >= 0)
      .map((quantile) => {
        return <span>{`${quantile.name}=${quantile.value}, `}</span>;
      });

    const quantileListNeg = this.state.quantiles
      .filter((q) => q.name < 0)
      .map((quantile) => {
        return <span>{`${quantile.name}=${quantile.value}, `}</span>;
      });

    const configBtns = configs.map((config) => {
      return (
        <button
          onClick={() => {
            this.onChangeConfig(config);
          }}
        >
          {config.name}
        </button>
      );
    });

    console.log(this.state);

    if (this.state.pwd !== this.pwd) {
      return (
        <input
          onChange={this.onChangePwd}
          placeholder={"unlock"}
          type="text"
        ></input>
      );
    }

    return (
      <div>
        <div>
          <input
            onChange={this.onChangeTarget}
            placeholder={"Target"}
            type="text"
          ></input>
          <input
            onChange={this.onChangeMin}
            placeholder={"Min"}
            type="text"
          ></input>
          <input
            onChange={this.onChangeMax}
            placeholder={"Max"}
            type="text"
          ></input>

          <div className="result">{quantileListPos}</div>
          <div className="result">{quantileListNeg}</div>
        </div>

        <hr />

        <div>
          <input
            onChange={this.onChangeStart}
            placeholder={"Start"}
            type="text"
          ></input>
          <input
            onChange={this.onChangeEnd}
            placeholder={"End"}
            type="text"
          ></input>
          <input
            onChange={this.onChangePointCount}
            placeholder={"PointCount"}
            type="text"
          ></input>

          <hr />
          <div>{configBtns}</div>
        </div>

        <hr />

        {this.state.exit.count > totalCount && (
          <div id="alert">Too much sold</div>
        )}

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
        <div className="result">
          <div>{`Pre: ${hold} = ${priceAvg} x ${totalCount}`}</div>
          <div>{`Sold: ${sold} (${((sold / hold) * 100).toFixed(2)}%) = ${this.state.exit.price} x ${this.state.exit.count}`}</div>
          <div>{`Gain: ${gain} (${((gain / sold) * 100).toFixed(2)}%) = ${(this.state.exit.price - priceAvg).toFixed(2)} x ${this.state.exit.count}`}</div>
          <div>{`Post: ${leftValue} (${interval}%) = ${priceAvg} x  ${leftCount}`}</div>
        </div>
      </div>
    );
  }
}

App.defaultProps = {};

ReactDOM.render(<App />, document.getElementById("app"));
