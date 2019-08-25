// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactToolTip from 'react-tooltip';
import Loading from '../Loading';
import styles from './BlockchainConfig.css';

type Props = {
  nodeAddress: string
};

type Stats = {
  uptime: number,
  numberTransactionReceived: number,
};

type State = {
  loaded: boolean,
  stats?: Stats,
};

function secondsToString(seconds)
{
  const years = Math.floor(seconds / 31536000);
  const days = Math.floor((seconds % 31536000) / 86400);
  const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  const remainingSeconds = (((seconds % 31536000) % 86400) % 3600) % 60;

  let result = '';
  if (years !== 0) {
    result += years + " years ";
  }
  if (days !== 0) {
    result += days + " days ";
  }
  if (hours !== 0) {
    result += hours + " hours ";
  }
  if (minutes !== 0) {
    result += minutes + " minutes ";
  }
  if (remainingSeconds !== 0) {
    result += remainingSeconds + " seconds";
  }

  return result;
}


const renderData = (stats: Stats) => {
  return (
    <div className="card bg-dark">
      <div className="card-header">
        Node stats
      </div>
      <div className="card-body">
        <div className="row">
          <label className="col-sm-4">Up since</label>
          <div className="col-sm-8">
            {secondsToString(stats.uptime)}
          </div>
        </div>

        <div className="row">
          <label className="col-sm-4">Received Txs</label>
          <div className="col-sm-8">
            {stats.numberTransactionReceived}
          </div>
        </div>

      </div>
    </div>
  );
};

export default class NodeStats extends Component<Props, State> {
  props: Props;

  interval= null;

  state: State = {
    loaded: false,
    stats: {
      uptime: 0,
      numberTransactionReceived: 0,
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    if (this.state.loaded === true) {
      return;
    }

    this.interval = setInterval(() => {
      const Http = new XMLHttpRequest();
      const url = this.props.nodeAddress + '/api/v0/node/stats';
      Http.open("GET", url);
      Http.send();

      Http.onreadystatechange = (e) => {
        if (Http.responseText.length === 0) {
          return;
        }
        const data = JSON.parse(Http.responseText);

        const stats = {
          uptime: data.uptime,
          numberTransactionReceived: data.txRecvCnt,
        };

        this.setState({ loaded: true, stats: stats });
      }
    },
      1000);

  }

  render() {
    const { loaded, stats } = this.state;

    if (loaded === false) {

      return (
        <div>
          Loading node stats...
          <Loading />
        </div>
      );
    } else {
      return renderData(stats);
    }
  }
}

