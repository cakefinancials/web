import React from "react";

import "./SpeechBubble.css";

export const SpeechBubble = ({ text }) => {
    return (
        <div>
            <hgroup className="speech-bubble">
                <p className="speech-bubble-text">
                    { text }
                </p>
            </hgroup>
        </div>
    );
};
