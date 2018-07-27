import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import * as typeformEmbed from '@typeform/embed';
import queryString from 'query-string';

import CakeButton from '../helpers/CakeButton';
import './PersonalDetails.css';
import { subscribeSessionChange } from '../../libs/userState';

const TYPEFORM_URL = 'https://prodfeedback.typeform.com/to/DTj72J';

export default class PersonalDetails extends Component {
    constructor(props) {
        super(props);

        this.state = { submittedTypeform: false };
    }

    componentDidMount() {
        const elm = this.typeformElm;

        const self = this;

        this.unsubscribeSessionChange = subscribeSessionChange((session) => {
            const qs = queryString.stringify({ user_email: this.getEmailFromSession(session) });

            // Load Typeform embed widget
            typeformEmbed.makeWidget(
                elm,
                `${TYPEFORM_URL}?${qs}`,
                {
                    onSubmit: () => {
                        self.setState({ submittedTypeform: true });
                    }
                }
            );
        });
    }

    componentWillUnmount() {
        if (this.unsubscribeSessionChange) {
            this.unsubscribeSessionChange();
        }
    }

    getEmailFromSession(session) {
        return session.idToken.payload.email;
    }

    render() {
        return (
            <div className='personaldetails'>
                <Row>
                    <div
                        className='react-typeform-embed'
                        ref={
                            tf => {
                                this.typeformElm = tf;
                            }
                        }
                    />
                </Row>
                <br />
                <Row>
                    <Col xs={4} xsOffset={4}>
                        <CakeButton
                            bsSize='large'
                            disabled={this.state.submittedTypeform === false}
                            onClick={() => {
                                this.props.navigateToNext();
                            }}
                        >
                            {
                                this.state.submittedTypeform === false ?
                                    'COMPLETE SURVEY TO PROCEED' :
                                    'NEXT STEP: BROKERAGE ACCESS'
                            }
                        </CakeButton>
                    </Col>
                </Row>
            </div>
        );
    }
}