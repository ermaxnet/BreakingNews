import React from "react";
import PropTypes from "prop-types";
import { ENTITY } from "../../../constants";

export const findDangerTextStategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        block => {
            const entityKey = block.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === ENTITY.DANGER_TEXT
            );
        },
        callback
    );
};

const DangerText = props => {
    return (
        <em 
            className="danger"
            children={props.children} 
        />
    );
};
DangerText.propTypes = {
    children: PropTypes.node
};

export default DangerText;