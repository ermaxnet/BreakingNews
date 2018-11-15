import React from "react";
import PropTypes from "prop-types";
import Icon from "../Icon";

const CommentButton = porps => {
    return (
        <button className="CommentButton">
            <Icon 
                family="far"
                iconClass="fa-comment" 
            />
        </button>
    )
};
CommentButton.propTypes = {
    onComment: PropTypes.func.isRequired
};

export default CommentButton;