import React, { Component } from "react";
import { Button } from "react-bootstrap";
import * as typeformEmbed from '@typeform/embed';

import { BrokerageCredentialsEditor } from "../BrokerageCredentials";

export default class BrokerageAccess extends Component {
    constructor(props) { super(props); }

    componentDidMount() { }

    render() {
        return <BrokerageCredentialsEditor
            brokerageCredentialsSaved={() => this.props.navigateToNext()}
        />;
    }
}