import React, { Component } from "react";
import { Button } from "react-bootstrap";
import * as typeformEmbed from '@typeform/embed';
import queryString from "query-string";

import "./PersonalDetails.css";
import { getCurrentUserSession } from "../../libs/userState";

const TYPEFORM_URL = "https://prodfeedback.typeform.com/to/DTj72J";

export default class PersonalDetails extends Component {
    constructor(props) {
        super(props);

        this.state = { submittedTypeform: false };
    }

    componentDidMount() {
        const elm = this.typeformElm;

        const self = this;
        const qs = queryString.stringify({ user_email: this.getEmailFromSession()});

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
    }

    getEmailFromSession() {
        return getCurrentUserSession().idToken.payload.email;
    }

    render() {
        return (
            <div className="personaldetails">
                I WANT SOME DEETS - YADA YADA YADA
                <div className="react-typeform-embed" ref={tf => { this.typeformElm = tf; }} />
                <Button
                    block
                    bsStyle="warning"
                    bsSize="large"
                    disabled={this.state.submittedTypeform === false}
                    onClick={e => {
                        this.props.navigateToNext();
                    }}
                >
                    {
                        this.state.submittedTypeform === false ?
                            'Complete the survey above to proceed' :
                            'Next Step: Brokerage Access'
                    }
                </Button>
            </div>
        );
    }
}