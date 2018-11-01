import React from 'react';
import { Button } from 'react-bootstrap';

import * as R from 'ramda';

import './CakeButton.css';

const CakeButton = props => {
  const modifiedProps = R.mergeAll([props]);

  const backgroundColorStyle = { backgroundColor: !props.cancelButton ? '#A145FB' : 'white' };

  modifiedProps.style = R.merge(modifiedProps.style || {}, backgroundColorStyle);
  modifiedProps.className = (modifiedProps.className || '') + ' cake-form-button';
  delete modifiedProps.parentStyle;

  if (props.cancelButton) {
    modifiedProps.className += ' cake-form-button-cancel-style';
  }

  return (
    <div className="cake-button-parent" style={props.parentStyle || {}}>
      <Button {...modifiedProps}>{modifiedProps.children}</Button>
    </div>
  );
};

export default CakeButton;
