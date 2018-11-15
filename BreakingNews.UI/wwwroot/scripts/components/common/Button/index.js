import React from "react";
import PropTypes from "prop-types";

const Button = props => {
    const {
        className,
        onClick,
        children,
        disabled
    } = props;
    return (
        <button 
            className={`Button ${className}`}
            disabled={disabled}
            onClick={e => {
                e.preventDefault();
                if(typeof onClick === "function") {
                    onClick(e);
                }
            }}
        >{children}</button>
    );
};
Button.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.element,
    disabled: PropTypes.bool
};
Button.defaultProps = {
    disabled: false
};

export default Button;