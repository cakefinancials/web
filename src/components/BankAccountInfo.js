import { API } from 'aws-amplify';

import React, { Component, Fragment } from 'react';
import { Button } from 'react-bootstrap';
import Script from 'react-load-script';
import config from '../config';
import * as R from 'ramda';

import LoadingSpinner from './LoadingSpinner';
import Lock from './helpers/Lock';

import './helpers/FormStyles.css';

import { fetchBankData, subscribeBankData } from '../libs/userState';
import LoaderButton from './LoaderButton';

export class PlaidAccountIntegrator extends Component {
  handleScriptLoad() {
    const handler = window.Plaid.create({
      clientName: 'Cake Stripe/Plaid Test',
      selectAccount: true,
      env: config.plaid.ENVIRONMENT,
      // Replace with your public_key from the Dashboard
      key: config.plaid.PUBLIC_KEY,
      product: ['auth', 'transactions'],
      onSuccess: (public_token, metadata) => {
        const plaidAccountId = metadata.account_id;
        const plaidPublicToken = public_token;
        this.sendPlaidCredentials({ plaidAccountId, plaidPublicToken })
          .catch(error => {
            window.Rollbar.error('Error while sending plaid credentials to backend to be stored', {
              error,
              metadata,
              public_token,
            });
          })
          .then(() => fetchBankData());

        if (this.props.onSuccessPlaid) {
          this.props.onSuccessPlaid();
        }
      },
      onExit: (error, metadata) => {
        // The user exited the Link flow.
        if (error) {
          // The user encountered a Plaid API error prior to exiting.
          // rollbar here!!!
          // metadata contains information about the institution
          // that the user selected and the most recent API request IDs.
          // Storing this information can be helpful for support.
          window.Rollbar.error('User encountered plaid api error prior to exiting', { error, metadata });
        }

        if (this.props.onExitPlaid) {
          this.props.onExitPlaid();
        }
      },
    });

    handler.open();
  }

  sendPlaidCredentials({ plaidAccountId, plaidPublicToken }) {
    return API.post('cake', '/user/plaid_data', { body: { plaidAccountId, plaidPublicToken } });
  }

  render() {
    return (
      <Script url="https://cdn.plaid.com/link/v2/stable/link-initialize.js" onLoad={this.handleScriptLoad.bind(this)} />
    );
  }
}

const CONNECT_BANK_REQUIRED_TEXT =
  'Connecting your bank is required in order to participate with Cake Financials, this is how we pay you (and eventually ourselves).';

export class DashboardBankInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      institutionName: null,
      showPlaid: false,
    };
  }

  componentDidMount() {
    this.unsubscribeBankData = subscribeBankData(({ bankData, loading, error }) => {
      this.setState({
        error,
        isLoading: loading,
        institutionName: R.prop('institutionName', bankData),
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeBankData) {
      this.unsubscribeBankData();
    }
  }

  renderLoading = () => {
    return <LoadingSpinner bsSize="large" text="Loading bank data..." />;
  };

  renderLoaded = () => {
    return (
      <span>
        {'Bank Authorization (ACH): '}
        {this.state.institutionName ? (
          <Fragment>
            <Lock check style={{ marginLeft: '5px', marginRight: '5px' }} />
            <small>
              <i style={{ color: 'green' }}>{'Connected with'}</i>
            </small>
            <i>{` ${this.state.institutionName}`}</i>
            {this.props.showEditButton ? (
              <Button bsStyle="link" onClick={() => this.setState({ showPlaid: true })}>
                {'Edit'}
              </Button>
            ) : null}
          </Fragment>
        ) : (
          <Fragment>
            <LoaderButton
              block
              bsSize="small"
              isLoading={this.state.showPlaid}
              loadingText="Loading..."
              onClick={() => {
                this.setState({ showPlaid: true });
              }}
              parentStyle={{ display: 'inline-block' }}
              style={{ fontSize: '18px', paddingLeft: '25px', paddingRight: '25px' }}
              text="Connect Bank"
              type="submit"
            />
            <div style={{ marginTop: '15px', color: '#e69706' }}>
              <small>
                <i>{CONNECT_BANK_REQUIRED_TEXT}</i>
              </small>
            </div>
          </Fragment>
        )}
      </span>
    );
  };

  render = () => {
    return (
      <div>
        {this.state.isLoading ? this.renderLoading() : this.renderLoaded()}
        {this.state.showPlaid ? (
          <PlaidAccountIntegrator onExitPlaid={() => this.setState({ showPlaid: false })} />
        ) : null}
      </div>
    );
  };
}
