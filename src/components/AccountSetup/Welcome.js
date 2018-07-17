import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Grid, Row, Col } from "react-bootstrap";

import CakeButton from "../helpers/CakeButton";
import StepsHeader, { STEPS_HEADER_VERSIONS } from "./StepsHeader";

import "./Welcome.css";

import { userStateActions } from "../../libs/userState";

const { CONSTANTS: { WALKTHROUGH } } = userStateActions;

export default class Welcome extends Component {
    render() {
        return (
            <div className="welcome">
                <Row>
                    <Col xs={8} xsOffset={2}>
                        <h1><strong>Welcome!</strong></h1>
                        <br />
                        <h3>
                            We have worked tirelessly to simplify the Cake onboarding
                            experience so that it is painless. To that end, we do need
                            to collect some sensitive information and have you sign a
                            contract that you NEED to read. Here is what to expect during onboarding:
                        </h3>
                        <br />
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} xsOffset={3}>
                        <StepsHeader
                            highlightedSteps={ [ WALKTHROUGH.ESTIMATED_EARNINGS ] }
                            stepsVersion={ STEPS_HEADER_VERSIONS.WELCOME }
                        />
                    </Col>
                </Row>
                <br />
                <br />
                <Row>
                    <Col xs={4} xsOffset={4}>
                        <CakeButton
                            block
                            bsSize="large"
                            onClick={e => {
                                this.props.navigateToNext();
                            }}
                        >
                            Get Started
                        </CakeButton>
                    </Col>
                </Row>
            </div>
        );
    }
}