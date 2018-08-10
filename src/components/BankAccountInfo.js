import React, { Component, Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import CakeButton from './helpers/CakeButton';
import Script from 'react-load-script';
import LoadingSpinner from './LoadingSpinner';
import config from '../config';

import './helpers/FormStyles.css';

let plaidScriptLoaded = false;

export class PlaidAccountIntegrator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            plaidReady: plaidScriptLoaded
        };
    }

    handleScriptLoad() {
        plaidScriptLoaded = true;
        this.setState({ plaidReady: true });
    }

    render() {
        return (
            <Fragment>
                {
                    this.state.plaidReady ? null :
                        <Script
                            url='https://cdn.plaid.com/link/v2/stable/link-initialize.js'
                            onLoad={this.handleScriptLoad.bind(this)}
                        />
                }
                <Row>
                    <Col xs={6} xsOffset={3}>
                        {
                            this.state.plaidReady ? (
                                <CakeButton
                                    bsSize='large'
                                    onClick={() => {
                                        const handler = window.Plaid.create({
                                            clientName: 'Cake Stripe/Plaid Test',
                                            selectAccount: true,
                                            env: config.plaid.ENVIRONMENT,
                                            // Replace with your public_key from the Dashboard
                                            key: config.plaid.PUBLIC_KEY,
                                            product: [ 'auth' ],
                                            onSuccess: function (public_token, metadata) {
                                                console.log('public_token: ' + public_token);
                                                console.log('metadata: ', metadata);
                                                console.log('account ID: ' + metadata.account_id);
                                            },
                                            onExit: function (err, metadata) {
                                                // The user exited the Link flow.
                                                if (err != null) {
                                                    // The user encountered a Plaid API error prior to exiting.
                                                    // rollbar here!!!
                                                    // metadata contains information about the institution
                                                    // that the user selected and the most recent API request IDs.
                                                    // Storing this information can be helpful for support.
                                                    console.log(err);
                                                    console.log(metadata);
                                                }
                                            },
                                        });

                                        handler.open();
                                    }}
                                >
                                    Authorize
                                </CakeButton>
                            ) : (
                                <LoadingSpinner bsSize='large' text='Loading Plaid integration...' />
                            )
                        }
                    </Col>
                </Row>
            </Fragment>
        );
    }
}