// @flow
import React, { Component } from 'react';
import ReactToolTip from 'react-tooltip';
import ReactTable from 'react-table';
import Loading from '../Loading';

type Props = {
  nodeAddress: string
};

type Log = {
  fragmentId: string,
  receivedFrom: string,
  receivedAt: Date,
  lastUpdatedAt: Date,
  status: string
};

type State = {
  loaded: boolean,
  logs: [Log],
  filter: string
};

const renderStatus = status => {
  if (status === 'Pending') {
    return 'Pending';
  }

  if (status.Rejected !== undefined) {
    return status.Rejected.reason;
  }

  if (status.InABlock !== undefined) {
    return status.InABlock.date;
  }

  return `Unknown status ${status}`;
};

const columns = [
  {
    id: 'fragmentId',
    Header: 'Fragment',
    accessor: log => log.fragmentId
  },
  {
    id: 'receivedAt',
    Header: 'Received',
    accessor: log => log.receivedAt.toLocaleString()
  },
  {
    id: 'lastUpdatedAt',
    Header: 'Updated',
    accessor: log => log.lastUpdatedAt.toLocaleString()
  },
  {
    id: 'status',
    Header: 'Status',
    accessor: log => renderStatus(log.status)
  }
];

const defaultSortMethod = (log1: Log, log2: Log) => {
  if (log1.lastUpdatedAt < log2.lastUpdatedAt) {
    return -1;
  }
  if (log1.lastUpdatedAt > log2.lastUpdatedAt) {
    return +1;
  }
  return 0;
};

export default class FragmentLogs extends Component<Props, State> {
  props: Props;

  state: State = {
    loaded: false,
    logs: [],
    filter: ''
  };

  componentDidMount() {
    const { loaded } = this.state;
    if (loaded === false) {
      this.loadLogs();
    }
  }

  loadLogs = () => {
    const { nodeAddress } = this.props;
    const Http = new XMLHttpRequest();
    const url = `${nodeAddress}/api/v0/fragment/logs`;
    Http.open('GET', url);
    Http.send();

    Http.onreadystatechange = () => {
      if (Http.responseText.length === 0) {
        return;
      }
      let logs = JSON.parse(Http.responseText);

      logs = logs.map(log => {
        return {
          fragmentId: log.fragment_id,
          receivedFrom: log.received_from,
          receivedAt: new Date(log.received_at),
          lastUpdatedAt: new Date(log.last_updated_at),
          status: log.status
        };
      });

      this.setState({ loaded: true, logs });
    };
  };

  searchByChange = event => {
    this.setState({ filter: event.target.value });
  };

  render() {
    const { loaded, logs, filter } = this.state;
    let arrayLogs = logs;

    if (loaded === false) {
      return (
        <div>
          Loading the fragment logs...
          <Loading />
        </div>
      );
    }

    arrayLogs.sort(defaultSortMethod);
    arrayLogs.reverse();
    arrayLogs = arrayLogs.filter(log => {
      if (filter !== '') {
        return log.fragmentId.startsWith(filter);
      }
      return true;
    });

    return (
      <div className="card bg-dark">
        <div className="card-header">
          <span className="badge badge-light">{logs.length}</span>
          &nbsp;Fragment Logs
          <span className="float-right">
            <input
              type="text"
              onChange={this.searchByChange}
              placeholder="Fragment ID"
            />
            <button
              type="button"
              className="btn btn-primary"
              data-tip="Check for more logs"
              onClick={this.loadLogs}
            >
              <i className="fa fa-redo" />
              <ReactToolTip />
            </button>
          </span>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <ReactTable
                defaultPageSize={5}
                data={arrayLogs}
                columns={columns}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
