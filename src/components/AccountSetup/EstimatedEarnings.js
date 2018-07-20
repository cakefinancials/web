import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";

import CakeButton from "../helpers/CakeButton";

import cakeEstimatedEarningsExampleSrc from '../../public/walkthrough/cake-estimated-earnings-example.png';

export default class EstimatedEarnings extends Component {
    render() {
        return (
            <div className="estimated-earnings" style={{textAlign: 'center'}}>
                <Row>
                    <p>
                        Awesome, your data has been securely sent to one of our analysts.
                        In order to get you excited about Cake, your Cake analyst will
                        put together a complimentary analysis of how much money you would
                        have made last year with Cake.
                    </p>
                    <p>
                        Here is an example analysis done for a hypothetical Intuit employee:
                    </p>
                    <img alt="" src={cakeEstimatedEarningsExampleSrc} />
                </Row>
                <br />
                <Row>
                    <Col xs={4} xsOffset={4}>
                        <CakeButton
                            bsSize="large"
                            onClick={e => {
                                this.props.navigateToNext();
                            }}
                        >
                            Go to dashboard
                        </CakeButton>
                    </Col>
                </Row>
            </div>
        );
    }
}