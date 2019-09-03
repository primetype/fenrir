// @flow
import React, { Component } from 'react';
import ReactToolTip from 'react-tooltip';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';

type Props = {};

export default class MissingSettingsAlert extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className="alert alert-danger" role="alert">
        <h2 className="alert-heading">Missing settings!</h2>
        <p>
          Missing the node&apos;s REST insetting. Without them Fenrir will not
          be able to connect to Jörmungandr. Nothing will happen
        </p>
        <hr />
        <div className="row">
          <div className="col-6">
            Go to the HOME page and enter the necessary settings
          </div>
          <div className="col" />
          <div className="col">
            <Link
              to={routes.HOME}
              className="btn btn-danger"
              data-tip="Set the Node connection settings"
            >
              Go to Home page
              <ReactToolTip />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
