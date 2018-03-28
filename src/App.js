import { Auth } from "aws-amplify";
import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            currentSession: null,
            isAuthenticating: true
        };
    }

    async componentDidMount() {
        try {
            const currentSession = await Auth.currentSession();
            if (currentSession) {
                this.userHasAuthenticated(currentSession);
            }
        }
        catch (e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }

        this.setState({ isAuthenticating: false });
    }

    userHasAuthenticated = session => {
        this.setState({ isAuthenticated: true, currentSession: session });
    }

    userHasLoggedOut = () => {
        this.setState({ isAuthenticated: false, currentSession: null })
    }

    handleLogout = async event => {
        await Auth.signOut();

        this.userHasLoggedOut();
        this.props.history.push("/login");
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            !this.state.isAuthenticating &&
            <div className="App container">
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">Cake Home</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            {this.state.isAuthenticated
                                ? (
                                    <Fragment>
                                        <Navbar.Text>{this.state.currentSession.idToken.payload.email}</Navbar.Text>
                                        <NavItem onClick={this.handleLogout}>Logout</NavItem>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <LinkContainer to="/signup">
                                            <NavItem>Signup</NavItem>
                                        </LinkContainer>
                                        <LinkContainer to="/login">
                                            <NavItem>Login</NavItem>
                                        </LinkContainer>
                                    </Fragment>
                                )
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps} />
            </div>
        );
    }
}

export default withRouter(App);
