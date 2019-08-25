// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactToolTip from 'react-tooltip';
import Loading from '../Loading';
import ReactSvgPieChart from "react-svg-piechart"

type Props = {
  nodeAddress: string
};

type Pool = {
  poolId: string,
  stake: number,
}

type Stake = {
  dandling: number,
  pools: [Pool],
  unassigned: number,
};

type StakeState = {
  epoch: number,
  stake: Stake,
};

type State = {
  loaded: boolean,
  stakeState: StakeState,
};

export default class LeaderSchedules extends Component<Props, State> {
  props: Props;

  state: State = {
    loaded: false,
    stakeState: null,
  };

  loadSchedules = () => {
    const Http = new XMLHttpRequest();
    const url = this.props.nodeAddress + '/api/v0/stake';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      if (Http.responseText.length === 0) {
        return;
      }
      let stakeState = JSON.parse(Http.responseText);

      stakeState.stake.pools = stakeState.stake.pools.map((pool) => {
        return {
          poolId: pool[0],
          stake: pool[1],
        };
      });

      this.setState({ loaded: true, stakeState: stakeState });
    }
  }

  componentDidMount() {
    if (this.state.loaded === false) {
      this.loadSchedules();
    }
  }

  render() {
    const { loaded, stakeState } = this.state;

    if (loaded === false) {

      return (
        <div>
          Loading stake stake
          <Loading />
        </div>
      );
    } else {
      console.log(stakeState);

      return (
        <div className="card bg-dark">
          <div className="card-header">
            <span className="badge badge-light">{10929093389}</span>
            &nbsp;Stake State
            <span className="float-right">
              <button className="btn btn-primary" data-tip="Check for more logs" onClick={this.loadSchedules}>
                <i className="fa fa-redo" />
                <ReactToolTip />
              </button>
            </span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col">
                <MyCompo />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}


const data = [
  {title: "Data 1", value: 100, color: "#22594e"},
  {title: "Data 2", value: 60, color: "#2f7d6d"},
  {title: "Data 3", value: 30, color: "#3da18d"},
  {title: "Data 4", value: 20, color: "#69c2b0"},
  {title: "Data 5", value: 10, color: "#a1d9ce"},
]

const MyCompo = () => (
  <ReactSvgPieChart
    data={data}
    // If you need expand on hover (or touch) effect
    expandOnHover
    // If you need custom behavior when sector is hovered (or touched)
    onSectorHover={(d, i, e) => {
      if (d) {
        console.log("Mouse enter - Index:", i, "Data:", d, "Event:", e)
      } else {
        console.log("Mouse leave - Index:", i, "Event:", e)
      }
    }}
  />
)
