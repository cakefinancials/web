import React, { Component } from "react";
import { Button } from "react-bootstrap";
import * as typeformEmbed from '@typeform/embed';

import { BankAccountInfoEditor } from "../BankAccountInfo";

export default class BankDetails extends Component {
    constructor(props) { super(props); }

    componentDidMount() { }

    render() {
        return <BankAccountInfoEditor
            bankAccountInfoSaved={() => this.props.navigateToNext()}
        />;
    }
}