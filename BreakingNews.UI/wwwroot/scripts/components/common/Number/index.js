import React from "react";
import PropTypes from "prop-types";
import stringLocalizer from "../../../common/stringLocalizer";

const NumberFormat = props => {
    let { children: number } = props;
    if(number >= 1000) {
         number = <>{(Math.round(number / 10) / 100)}&nbsp;{stringLocalizer.t("numbers.thousand")}</>;
    }
    return (
        <span className={props.className} data-count={props.children}>
            {number}
        </span>
    ); 
};
NumberFormat.propTypes = {
    children: PropTypes.number.isRequired,
    className: PropTypes.string
};
NumberFormat.defaultProps = {
    children: 0
};

export default NumberFormat;