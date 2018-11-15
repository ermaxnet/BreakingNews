import React from "react";
import PropTypes from "prop-types";
import CommentButton from "../../common/Button/Comment";
import NumberFormat from "../../common/Number";

const CommentCaption = props => {
    return (
        <div className="CommentCaption">
            <CommentButton
                onComment={props.onComment}
            />
            {!!props.commentsCount && (
                <NumberFormat className="CommentsCount">
                    {props.commentsCount}
                </NumberFormat>
            )}
        </div>
    );
};
CommentCaption.propTypes = {
    commentsCount: PropTypes.number,
    onComment: PropTypes.func.isRequired
};
CommentCaption.defaultProps = {
    commentsCount: 0
};

export default CommentCaption;