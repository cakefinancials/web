import { Auth } from "aws-amplify";
import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { subscribeSessionChange, setCurrentUserSession } from "./libs/userState";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            currentSession: null,
            isAuthenticating: true
        };

        subscribeSessionChange((session) => {
            if (session === null) {
                this.setState({ isAuthenticated: false, currentSession: null })
            } else {
                this.setState({ isAuthenticated: true, currentSession: session });
            }
        });
    }

    async componentDidMount() {
        try {
            const currentSession = await Auth.currentSession();
            if (currentSession) {
                setCurrentUserSession(currentSession);
            }
        } catch (e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }

        this.setState({ isAuthenticating: false });
    }

    handleLogout = async () => {
        await Auth.signOut();

        setCurrentUserSession(null);
        this.props.history.push('/login');
    }

    renderNavbar() {
        return (
            <div className="app-nav-container container-fluid">
                <Navbar fluid collapseOnSelect style={{backgroundColor: '#8f2cfa'}}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <div className={'app-logo'}></div>
                        </Navbar.Brand>
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
            </div>
        );
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
        };

        // is this naughty? probably!
        const { location: { pathname: currentPath } } = this.props;
        if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/verify') {
            document.body.classList.add('login-signup-background');
        } else {
            document.body.classList.remove('login-signup-background');
        }


        return (
            !this.state.isAuthenticating &&
            <div>
                { this.renderNavbar() }
                <div className="App container">
                    <Routes childProps={childProps} />
                </div>
            </div>
        );
    }
}

export default withRouter(App);
