import React from "react";
import PropTypes from "prop-types";

const Icon = props => {
    return (
        <span 
            className={`Icon${props.className} ${props.family} ${props.iconClass}`} 
            aria-hidden="true"
        ></span>
    );
};
Icon.propTypes = {
    family: PropTypes.string,
    iconClass: PropTypes.string.isRequired,
    className: PropTypes.string
};
Icon.defaultProps = {
    family: "fa",
    className: ""
};

export default Icon;
