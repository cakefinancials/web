import React, { Component, Fragment } from 'react';
import { Col, Glyphicon, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import axios from 'axios';

import { ObfuscatedBrokerageCredentials, BrokerageCredentialsEditor } from '../BrokerageCredentials';
import { DashboardBankInfo } from '../BankAccountInfo';

import CakeButton from '../helpers/CakeButton';
import { subscribeSessionChange } from '../../libs/userState';

import cakeImageSrc from '../../public/app/cake.png';

import './ESPPDetails.css';
import '../AccountSetup/StepsTooltip.css';

let TOOLTIP_COUNTER = 0;
const createDetailsTooltip = tooltipText => {
  return (
    <OverlayTrigger
      placement="right"
      overlay={
        <Tooltip id={`ESPP-DETAILS-TOOLTIP-${TOOLTIP_COUNTER++}`} className="steps-tooltip">
          {tooltipText}
        </Tooltip>
      }
    >
      <Glyphicon glyph="question-sign" />
    </OverlayTrigger>
  );
};

export class ESPPDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditPersonalDetailsModal: false,
      showEditFinancialDetailsModal: false,
      email: null,
      sentDetailsChangedNotification: false,
      editedBrokerageDetails: false,
    };
  }

  componentDidMount() {
    this.unsubscribeSessionChange = subscribeSessionChange(session => {
      const email = session.idToken.payload.email;
      this.setState({ email });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeSessionChange) {
      this.unsubscribeSessionChange();
    }
  }

  handleCloseEditPersonalDetailsModal() {
    this.setState({ showEditPersonalDetailsModal: false });
  }

  handleShowEditPersonalDetailsModal() {
    this.setState({ showEditPersonalDetailsModal: true });
  }

  handleCloseEditFinancialDetailsModal() {
    this.setState({
      showEditFinancialDetailsModal: false,
      editedBrokerageDetails: false,
    });
  }

  handleShowEditFinancialDetailsModal() {
    this.setState({ showEditFinancialDetailsModal: true });
  }

  renderEditPersonalDetailsModal() {
    return !this.state.showEditPersonalDetailsModal ? null : (
      <Modal
        bsSize="large"
        className="espp-details-modal"
        show={true}
        onHide={() => this.handleCloseEditPersonalDetailsModal()}
      >
        <Modal.Header className="espp-details-modal-header" closeButton />
        <Modal.Body>
          {this.state.sentDetailsChangedNotification ? (
            <Fragment>
              <Row>
                <Col xs={12} className="personal-details-modal-text-content">
                  <p>
                    You have successfully submitted a personal details change request. Your analyst will reach out via
                    email to continue the process.
                  </p>
                </Col>
              </Row>
              <Row className="pad-bottom">
                <Col xs={4} xsOffset={4}>
                  <CakeButton cancelButton bsSize="large" onClick={() => this.handleCloseEditPersonalDetailsModal()}>
                    Close
                  </CakeButton>
                </Col>
              </Row>
            </Fragment>
          ) : (
            <Fragment>
              <Row>
                <Col xs={12} className="personal-details-modal-text-content">
                  <p>
                    <strong>Did your compensation change?</strong>
                  </p>

                  <p>
                    If so, your analyst will verify this via your brokerage account and update your details accordingly.
                    We need to verify this manually, as a compensation change may trigger an adjustment to the Cake
                    paperwork.
                  </p>
                </Col>
              </Row>
              <Row className="pad-bottom">
                <Col xs={4} xsOffset={2}>
                  <CakeButton
                    bsSize="large"
                    onClick={() => {
                      axios.get('https://hooks.zapier.com/hooks/catch/403974/gtg3ka/', {
                        params: { email: this.state.email },
                      });
                      this.setState({ sentDetailsChangedNotification: true });
                    }}
                  >
                    Yes, there was a change
                  </CakeButton>
                </Col>
                <Col xs={4}>
                  <CakeButton cancelButton bsSize="large" onClick={() => this.handleCloseEditPersonalDetailsModal()}>
                    Cancel
                  </CakeButton>
                </Col>
              </Row>
            </Fragment>
          )}
        </Modal.Body>
      </Modal>
    );
  }

  renderEditFinancialDetailsModal() {
    return !this.state.showEditFinancialDetailsModal ? null : (
      <Modal
        bsSize="large"
        className="espp-details-modal"
        show={true}
        onHide={() => this.handleCloseEditFinancialDetailsModal()}
      >
        <Modal.Header className="espp-details-modal-header" closeButton />
        <Modal.Body>
          <Row>
            <Col xsOffset={3} xs={6}>
              <DashboardBankInfo showEditButton />
            </Col>
          </Row>
          <hr />
          <Row>
            {this.state.editedBrokerageDetails ? (
              <div className="centered-text">
                <p>Update successfully saved</p>
              </div>
            ) : (
              <BrokerageCredentialsEditor
                brokerageCredentialsSaved={() => this.setState({ editedBrokerageDetails: true })}
              />
            )}
          </Row>
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    const {
      salary,
      currentPaycheckAmount,
      payPeriod,
      lastPaycheck,
      company,
      companyDiscount,
      lookback,
      purchasePeriod,
      maxAllowableContribution,
      eSPPNotes,
      policyLink,
    } = this.props;

    const DISCOUNT_TEXT =
      'The % discount is the % amount below the company stock price at which your shares can be purchased after the contribution period is ended. For example, a stock worth $100 at a company with a 15% discount policy, can be purchased for $85.';
    const LOOKBACK_TEXT =
      'If a company has a lookback policy, this usually means that your ESPP discount will be applied to the price of the stock at the start OR end of the contribution period (details can vary slightly company to company)';
    const PURCHASE_PERIOD_TEXT =
      'The amount of time during which your contributed % of salary will be earmarked to purchase discounted company stock, which will be automatically purchased on the end date of the purchase period.';
    const MAX_CONTRIBUTION_TEXT =
      'This is the maximum allowable salary % that your company allows you to contribute. The IRS limits ESPP purchases to $25,000 worth of stock for any calendar year, so depending on how much you make, it is possible to hit the IRS limit before hitting the company-imposed % limit.';

    return (
      <Row className="espp-details dashboard-data-container">
        {this.renderEditPersonalDetailsModal()}
        {this.renderEditFinancialDetailsModal()}
        <Col xs={6}>
          <h3>
            Your ESPP:{' '}
            <span className="right">
              <big>{company}</big>
            </span>
          </h3>
          <br />
          Discount: {createDetailsTooltip(DISCOUNT_TEXT)} <strong>{companyDiscount}</strong>
          <br />
          <br />
          Lookback: {createDetailsTooltip(LOOKBACK_TEXT)} <strong>{lookback}</strong>
          <br />
          <br />
          Purchase Period Length: {createDetailsTooltip(PURCHASE_PERIOD_TEXT)} <strong>{purchasePeriod}</strong>
          <br />
          <br />
          Max Allowable Annual Contribution: {createDetailsTooltip(MAX_CONTRIBUTION_TEXT)}{' '}
          <strong>{maxAllowableContribution}</strong>
          <br />
          <br />
          <div className="center-text">
            <small>
              {eSPPNotes ? (
                <Fragment>
                  <i>{eSPPNotes}</i>
                  <br />
                </Fragment>
              ) : null}
              {policyLink ? (
                <a rel="noopener noreferrer" target="_blank" href={policyLink}>
                  READ FULL DETAILS OF {company.toUpperCase()} POLICY HERE
                </a>
              ) : null}
            </small>
          </div>
        </Col>
        <Col xs={6} className="border-left">
          <h3>
            Your Details:{' '}
            <span className="right">
              <a className="modal-link" onClick={() => this.handleShowEditPersonalDetailsModal()}>
                edit my personal details
              </a>
            </span>
          </h3>
          <br />
          Salary (annual): <strong>{salary}</strong>
          <br />
          <br />
          Current Paycheck Amount (post taxes): <strong>{currentPaycheckAmount}</strong>
          <br />
          <br />
          Pay Period: <strong>{payPeriod}</strong>
          <br />
          <br />
          Last Paycheck: <strong>{lastPaycheck}</strong>
          <br />
          <br />
          <h3>
            Financial Details:{' '}
            <span className="right">
              <a className="modal-link" onClick={() => this.handleShowEditFinancialDetailsModal()}>
                edit my financial details
              </a>
            </span>
          </h3>
          <br />
          <ObfuscatedBrokerageCredentials />
          <br />
          <DashboardBankInfo />
        </Col>
      </Row>
    );
  }
}

export const ESPPDetailsDefault = () => {
  return (
    <Row className="espp-details-default dashboard-data-container">
      <Col xs={12}>
        <h4>Your Details</h4>
        <br />
        <div className="centered-text">
          Your analyst is verifying your data. This section will populate after everything has been reviewed.
        </div>
        <br />
        <br />
      </Col>
      <img alt="" src={cakeImageSrc} />
    </Row>
  );
};
