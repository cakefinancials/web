import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Grid, Row, Col } from "react-bootstrap";

import StepsHeader, { STEPS_HEADER_VERSIONS } from "./StepsHeader";

import { userStateActions } from "../../libs/userState";
const { CONSTANTS: { WALKTHROUGH } } = userStateActions;

export default class Welcome extends Component {
    render() {
        return (
            <div className="welcome">
                WELCOME TO CAKE - YADA YADA YADA
                <Grid>
                    <Row>
                        <Col xs={8} xsOffset={2}>
                            <StepsHeader
                                highlightedSteps={ [ WALKTHROUGH.ESTIMATED_EARNINGS ] }
                                stepsVersion={ STEPS_HEADER_VERSIONS.WELCOME }
                            />
                        </Col>
                    </Row>
                </Grid>
                <Button
                    block
                    bsStyle="warning"
                    bsSize="large"
                    onClick={e => {
                        this.props.navigateToNext();
                    }}
                >
                    Get Started
                </Button>
            </div>
        );
    }
}