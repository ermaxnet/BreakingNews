import React from "react";
import PropTypes from "prop-types";
import LikeButton from "../../common/Button/Like";
import NumberFormat from "../../common/Number";

const Like = props => {
    return (
        <div className={`Like${props.likeIt ? " Like--liked" : ""}`}>
            <LikeButton
                likeIt={props.likeIt}
                toggleLike={props.toggleLike}
            />
            {!!props.likesCount && (
                <NumberFormat className="LikesCount">
                    {props.likesCount}
                </NumberFormat>
            )}
        </div>
    );
};
Like.propTypes = {
    likeIt: PropTypes.bool,
    likesCount: PropTypes.number,
    toggleLike: PropTypes.func.isRequired
};
Like.defaultProps = {
    likeIt: false,
    likesCount: 0
};

export default Like;