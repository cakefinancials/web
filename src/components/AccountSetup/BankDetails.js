import React, { Component } from "react";
import { Col } from "react-bootstrap";

import { BankAccountInfoEditor } from "../BankAccountInfo";
import { SpeechBubble } from "./helpers/SpeechBubble";

import "./BrokerageAndBankDetails.css";

const ourCTOSaysSpeechBubbleText = `The credentials below will NOT allow us to access your bank, it
will only allow us to send money to your specified bank account. That is a great thing, right?!`;

export default class BankDetails extends Component {
    componentDidMount() { }

    render() {
        return (
            <Col xs={10} xsOffset={1}>
                <br />
                <div className="centered-text">
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
                        <a rel="noopener noreferrer" target="_blank" href="//google.com">Read More About Taxes Here</a>
                    </p>
                </div>
                <br />
                <br />
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
                <BankAccountInfoEditor
                    bankAccountInfoSaved={() => this.props.navigateToNext()}
                    saveButtonText='Save & Continue'
                />
            </Col>
        );
    }
}