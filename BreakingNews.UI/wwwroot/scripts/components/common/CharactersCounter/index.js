import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";

class CharactersCounter extends ReactComponent {
    static propTypes = {
        count: PropTypes.number.isRequired,
        maxCount: PropTypes.number,
        warnLimit: PropTypes.number
    }
    static defaultProps = {
        maxCount: 280,
        warnLimit: 20
    }

    render() {
        const { count, maxCount, warnLimit } = this.props;
        const dashArray = 50;
        const characterOffset = dashArray / maxCount;
        let dashOffset = (count < maxCount) 
            ? dashArray - characterOffset * count
            : 0;

        let progressClassName = "CharactersCounter__progress";
        const countdown = maxCount - count;
        switch(true) {
            case countdown < 0: {
                progressClassName += " CharactersCounter__progress--danger";
                break;
            }
            case countdown === 0: {
                progressClassName += " CharactersCounter__progress--danger CharactersCounter__progress--pulse";
                break;
            }
            case countdown < warnLimit: {
                progressClassName += " CharactersCounter__progress--warn";
                break;
            }
            case countdown === warnLimit: {
                progressClassName += " CharactersCounter__progress--warn CharactersCounter__progress--pulse";
                break;
            }
            default:
                progressClassName += " CharactersCounter__progress--safe";
                break;
        }

        return (
            <div className="CharactersCounter">
                <svg
                    className="CharactersCounter__radial" 
                    height={20}
                    width={20}  
                >
                    <circle
                        className="CharactersCounter__progressOverlay"
                        cx="50%"
                        cy="50%"
                        r={8}
                        fill="none"
                        strokeWidth={1}
                    ></circle>
                    <circle
                        className={progressClassName}
                        cx="50%"
                        cy="50%"
                        r={8}
                        fill="none"
                        strokeWidth={2}
                        style={{
                            strokeDasharray: dashArray,
                            strokeDashoffset: dashOffset
                        }}
                    ></circle>
                </svg>
                {(countdown <= warnLimit) && (
                    <span className={`countdown${countdown <= 0 ? " countdown--danger" : ""}`}>
                        {countdown}
                    </span>
                )}
            </div>
        );
    }
};

export default CharactersCounter;