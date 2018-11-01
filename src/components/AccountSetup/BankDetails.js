import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import LoaderButton from '../LoaderButton';
import { PlaidAccountIntegrator } from '../BankAccountInfo';

import { SpeechBubble } from './helpers/SpeechBubble';

import './BrokerageAndBankDetails.css';

const ourCTOSaysSpeechBubbleText = `Before we can enroll you in your company's ESPP, Cake will need you to
authorize us to make deposits and withdrawals from your bank account so that we can transfer your profits to your account while also paying back the loan.
Cake partners with best-in-class providers that gather this information on Cake's behalf, we do not store any of your data`;

export default class BankDetails extends Component {
  constructor(props) {
    super(props);

    this.state = { showPlaid: false };
  }

  componentDidMount() {}

  render() {
    return (
      <Col xs={10} xsOffset={1}>
        {this.state.showPlaid ? (
          <PlaidAccountIntegrator
            onSuccessPlaid={() => this.props.navigateToNext()}
            onExitPlaid={() => this.setState({ showPlaid: false })}
          />
        ) : null}
        <br />
        <div className="centered-text">
          <p>
            Upon selling your shares, we can send the profits directly to your bank. Please note that the original loan
            amount will be removed before profits are calculated.
          </p>
          <br />
          <p>
            Our analyst will also take into account all tax considerations when performing the calculations.
            <br />
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://turbotax.intuit.com/tax-tips/investments-and-taxes/employee-stock-purchase-plans/L8NgMFpFX"
            >
              Read More About Taxes Here
            </a>
          </p>
        </div>
        <br />
        <div className="cto-speech-bubble-container">
          <div>
            <small>
              <i>
                Our CTO, <br /> Samuel says:
              </i>
            </small>
          </div>
          <SpeechBubble text={ourCTOSaysSpeechBubbleText} />
        </div>
        <br />
        <br />
        <Row>
          <Col xs={6} xsOffset={3}>
            <LoaderButton
              block
              bsSize="large"
              isLoading={this.state.showPlaid}
              loadingText="Loading..."
              onClick={() => {
                this.setState({ showPlaid: true });
              }}
              text="Connect Bank"
              type="submit"
            />
          </Col>
        </Row>
        <br />
        <Row>
          <div className="center-text">
            <Button bsStyle="link" onClick={() => this.props.navigateToNext()}>
              {'SKIP FOR NOW >>'}
            </Button>
          </div>
        </Row>
      </Col>
    );
  }
}
