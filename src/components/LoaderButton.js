import React from "react";
import { Glyphicon } from "react-bootstrap";
import "./LoaderButton.css";

import CakeButton from "./helpers/CakeButton";

export default ({
  isLoading,
    text,
    loadingText,
    className = "",
    disabled = false,
    ...props
}) =>
    <CakeButton
        className={`LoaderButton ${className}`}
        disabled={disabled || isLoading}
        {...props}
    >
        {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
        {!isLoading ? text : loadingText}
    </CakeButton>;
