import React, { Component } from "react";
import { Grid, Row, Col, Glyphicon, OverlayTrigger, Tooltip } from "react-bootstrap";
import * as typeformEmbed from '@typeform/embed';

import { BrokerageCredentialsEditor } from "../BrokerageCredentials";

import "./BrokerageAccess.css";
import "./StepsTooltip.css";

const maxContribTooltipText = `Why do we always enroll you at max contribution? Because it is the same amount of work for Cake
to enroll you at max contribution as minimum contribution. Yes, it costs more upfront, but we cover
those costs. Max contribution is how you (and Cake) can make the most money.`;

export default class BrokerageAccess extends Component {
    constructor(props) { super(props); }

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
            <Grid>
                <Row>
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
                            <br />
                            <p>
                                Our analysts are legally only allowed to touch ESPP stocks. Examples of things we can't touch include:
                            </p>
                            <ul class="dashed">
                                <li>RSUs</li>
                                <li>Common Stock</li>
                                <li>Options</li>
                                <li>Any other financial holdings</li>
                            </ul>
                            <br />
                            <p>
                                <strong>2)</strong> Sell your ESPP stock as soon as it is available**
                            <br />
                            </p>
                            <p>
                                <i>** This is the Cake policy so that risk exposure is minimized and your gains reach you as soon as possible</i>
                            </p>
                        </div>
                        <BrokerageCredentialsEditor
                            brokerageCredentialsSaved={() => this.props.navigateToNext()}
                        />
                    </Col>
                </Row>
            </Grid>
        );
    }
}