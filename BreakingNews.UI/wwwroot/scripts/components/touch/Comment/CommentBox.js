import React, { Component as ReactComponent } from "react";
import Comment from "./index";
import stringLocalizer from "../../../common/stringLocalizer";
import "components/Comment.scss";

class CommentBox extends ReactComponent {
    render() {
        return (
            <div className="CommentBox">
                <Comment 
                    useImages={true}
                    useQuiz={true}
                    useEmoji={true}
                    placeholder={stringLocalizer.t("New notification")}
                />
            </div>
        );
    }
}

export default CommentBox;