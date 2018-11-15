import React from "react";
import PropTypes from "prop-types";
import Icon from "../Icon";

const LikeButton = porps => {
    return (
        <button className="LikeButton">
            <input 
                className="LikeCheckbox"
                type="checkbox" 
                checked={porps.likeIt} 
                onChange={porps.toggleLike}
            />
            <Icon
                family={porps.likeIt ? "fa" : "far"}
                iconClass="fa-heart"
            />
        </button>
    )
};
LikeButton.propTypes = {
    likeIt: PropTypes.bool,
    toggleLike: PropTypes.func.isRequired
};
LikeButton.defaultProps = {
    likeIt: false
};

export default LikeButton;