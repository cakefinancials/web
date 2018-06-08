import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class Welcome extends Component {
    render() {
        return (
            <div className="welcome">
                WELCOME TO CAKE - YADA YADA YADA
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