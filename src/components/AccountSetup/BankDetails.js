import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import CakeButton from '../helpers/CakeButton';

import { SpeechBubble } from './helpers/SpeechBubble';

import './BrokerageAndBankDetails.css';

const ourCTOSaysSpeechBubbleText = `Before we can enroll you in your company's ESPP, Cake will need you to
authorize us to make deposits and withdrawals from your bank account so that we can transfer your profits to your account while also paying back the loan.
Cake partners with best-in-class providers that gather this information on Cake's behalf, we do not store any of your data`;

export default class BankDetails extends Component {
    componentDidMount() { }

    render() {
        return (
            <Col xs={10} xsOffset={1}>
                <br />
                <div className='centered-text'>
                    <p>
                        Upon selling your shares, we can send the profits directly
                        to your bank. Please note that the original loan amount will
                        be removed before profits are calculated.
                    </p>
                    <br />
                    <p>
                        Our analyst will also take into account all tax considerations
                        when performing the calculations.
                        <br />
                        <a
                            rel='noopener noreferrer'
                            target='_blank'
                            href='https://turbotax.intuit.com/tax-tips/investments-and-taxes/employee-stock-purchase-plans/L8NgMFpFX'
                        >
                            Read More About Taxes Here
                        </a>
                    </p>
                </div>
                <br />
                <div className='cto-speech-bubble-container'>
                    <div>
                        <small><i>
                            Our CTO, <br /> Samuel says:
                        </i></small>
                    </div>
                    <SpeechBubble text={ ourCTOSaysSpeechBubbleText } />
                </div>
                <br />
                <br />
                <Row>
                    <Col xs={6} xsOffset={3}>
                        <CakeButton
                            bsSize='large'
                            onClick={() => {
                                this.props.navigateToNext();
                            }}
                        >
                            GOT IT, LET'S KEEP GOING
                        </CakeButton>
                    </Col>
                </Row>
            </Col>
        );
    }
}