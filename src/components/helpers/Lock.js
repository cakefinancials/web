import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';

import React, { Component, Fragment } from "react";

const Lock = ({check, ...props}) => {
    const LockCheckStyle = {
        color: '#1DBA1D',
        opacity: '1',
        marginLeft: '1px',
        marginTop: '-3px',
        fontSize: '22px',
    }

    const LockStyle = {
        fontSize: '22px',
        opacity: '1',
        color: '#7F7F7F'
    };

    return (
        <span {...props} className="fa-layers fa-fw lock-container" >
            <i className="fas fa-lock" style={LockStyle}></i>
            { check ? <i className="fas fa-check" style={LockCheckStyle}></i> : null }
        </span>
    );
};

export default Lock;