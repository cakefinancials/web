import React, { Component } from 'react';
import { Col, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { BrokerageCredentialsEditor } from '../BrokerageCredentials';
import { SpeechBubble } from './helpers/SpeechBubble';

import './BrokerageAndBankDetails.css';
import './StepsTooltip.css';

const maxContribTooltipText = `Why do we always enroll you at max contribution? Because it is the same amount of work for Cake
to enroll you at max contribution as minimum contribution. Yes, it costs more upfront, but we cover
those costs. Max contribution is how you (and Cake) can make the most money.`;

const ourCTOSaysSpeechBubbleText = `Your credentials will be encrypted and stored on an Amazon server. Only one person,
your Cake Analyst, will have the encryption key, which is stored indepedently of your credentials. They will only
access your account to do the two things outlined above.`;

export default class BrokerageAccess extends Component {
    componentDidMount() { }

    render() {
        const maxContribTooltip = (
            <OverlayTrigger
                placement="right"
                overlay={
                    <Tooltip id="brokerage-access-max-contrib-tooltip" className="steps-tooltip">
                        { maxContribTooltipText }
                    </Tooltip>
                }
            >
                <Glyphicon glyph="question-sign" />
            </OverlayTrigger>
        );

        return (
            <Col xs={10} xsOffset={1}>
                <br />
                <p>
                    At Cake we want you to make money from your Employee Stock
                    without having to worry about it. In order to guarantee this,
                    one of our analysts will need access to your brokerage account
                    so that we can do the following:
                </p>
                <br />
                <div className="centered-text">
                    <p>
                        <strong>1)</strong> Enroll in your ESPP at max contribution. { maxContribTooltip }
                    </p>
                    <small><small>
                        <p>
                            Our analysts are legally only allowed to touch ESPP stocks.
                            <br />
                            Examples of things we can't touch include:
                        </p>
                        <ul className="dashed">
                            <li>RSUs</li>
                            <li>Common Stock</li>
                            <li>Options</li>
                            <li>Any other financial holdings</li>
                        </ul>
                    </small></small>
                    <br />
                    <br />
                    <p>
                        <strong>2)</strong> Sell your ESPP stock as soon as it is available**
                    </p>
                    <br />
                    <p>
                        <small><small>
                            <i>** This is the Cake policy so that risk exposure is minimized and your gains reach you as soon as possible</i>
                        </small></small>
                    </p>
                </div>
                <div className="cto-speech-bubble-container">
                    <div>
                        <small><i>
                            Our CTO, <br /> Samuel says:
                        </i></small>
                    </div>
                    <SpeechBubble text={ ourCTOSaysSpeechBubbleText } />
                </div>
                <br />
                <br />
                <BrokerageCredentialsEditor
                    brokerageCredentialsSaved={() => this.props.navigateToNext()}
                    saveButtonText='Save & Continue'
                />
            </Col>
        );
    }
}