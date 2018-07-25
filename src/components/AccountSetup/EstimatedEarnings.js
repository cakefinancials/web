import React, { Component } from "react";
import { Col, Row, Modal } from "react-bootstrap";

import CakeButton from "../helpers/CakeButton";

import "./EstimatedEarnings.css";
import cakeEstimatedEarningsExampleSrc from '../../public/walkthrough/cake-estimated-earnings-example.png';

export default class EstimatedEarnings extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = { show: false };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    renderImageModal() {
        return (
            <Modal
                bsSize="large"
                className="estimated-earnings-modal"
                show={this.state.show}
                onHide={() => this.handleClose()}
            >
                <Modal.Header
                    className="estimated-earnings-modal-header"
                    closeButton
                />
                <Modal.Body>
                    <div className="text-center">
                        <img
                            alt=""
                            className="estimated-earnings-modal"
                            src={cakeEstimatedEarningsExampleSrc}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

    render() {
        return (
            <div className="estimated-earnings">
                { this.renderImageModal() }
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
                    <br />
                    <Col xs={2} xsOffset={5}>
                        <div
                            className={'estimated-earnings-thumbnail-container'}
                            onClick={() => this.handleShow()}
                        >
                            <img
                                alt=""
                                className="estimated-earnings-thumbnail"
                                src={cakeEstimatedEarningsExampleSrc}
                            />
                            <div className="centered-hover-text">Click to see full report</div>
                        </div>
                    </Col>
                </Row>
                <br />
                <Row>
                    <br />
                    <p>
                        While you wait for your analyst to send you your paperwork, you can head over to your new Cake Dashboard:
                    </p>
                    <br />
                    <Col xs={4} xsOffset={4}>
                        <CakeButton
                            bsSize="large"
                            onClick={() => {
                                this.props.navigateToNext();
                            }}
                        >
                            GO TO DASHBOARD
                        </CakeButton>
                    </Col>
                </Row>
            </div>
        );
    }
}