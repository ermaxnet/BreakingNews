import React from "react";
import { EditorBlock } from "draft-js";

export default props => {
    return (
        <cite>
            <EditorBlock {...props} />
        </cite>
    );
};