import React from "react";
import { Label, Glyphicon } from "react-bootstrap";
import "./LoadingSpinner.css";

export default ({
  isLoading,
    text,
    className = "",
    ...props
}) =>
    <Label
        className={`LoadingSpinner ${className}`}
        {...props}
    >
        <Glyphicon glyph="refresh" className="spinning" />
        { text }
    </Label>;
