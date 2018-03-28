import React, { Component } from "react";
import { PageHeader } from "react-bootstrap";
import "./Home.css";
//import { API } from "aws-amplify";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };
    }

    async componentDidMount() {
        // do some async loading here
        this.setState({ isLoading: false});
    }

    /*
    async fetchNotes() {
        if (!this.fetchedNotes) {
            this.fetchedNotes = true;

            try {
                const notes = await API.get("notes", "/notes");
                this.setState({ notes });
            } catch (e) {
                alert(e);
            }

            this.setState({ isLoading: false });
        }
    }
    */

    /*
    handleNoteClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }
    */

    renderLander() {
        return (
            <div className="lander">
                <h1>Cake</h1>
                <p>A simple $$$ making app</p>
            </div>
        );
    }

    renderAuthedHome() {
        return (
            <div className="notes">
                <PageHeader>Your Dashboard</PageHeader>
                {!this.state.isLoading && (
                    <div>
                        <h3>
                            Your pretty dash
                        </h3>
                    </div>
                )}
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderAuthedHome() : this.renderLander()}
            </div>
        );
    }
}
