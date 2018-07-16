import React from "react";
import { Button } from "react-bootstrap";

import * as R from 'ramda';

import "./CakeButton.css";

const CakeButton = (props) => {
    const modifiedProps = R.mergeAll([ props ]);

    const backgroundColorStyle = { backgroundColor: '#A145FB' };

    modifiedProps.style = R.merge(modifiedProps.style || {}, backgroundColorStyle);
    modifiedProps.className = (modifiedProps.className || '') + ' cake-form-button';

    return (
        <div className='cake-button-parent'>
            <Button { ...modifiedProps }>
                { modifiedProps.children }
            </Button>
        </div>
    );
};

export default CakeButton;