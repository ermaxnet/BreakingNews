import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";

export default class Image extends ReactComponent {
    static propTypes = {
        link: PropTypes.string
    }
    render() {
        return (
            <div className="ImagePreview">
                <img 
                    className="Image" 
                    role="presentation" 
                    src={`/Organization${this.props.link}`} 
                />
            </div>
        );
    }
};