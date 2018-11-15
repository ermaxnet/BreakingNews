import React from "react";
import PropTypes from "prop-types";
import { ENTITY } from "../../../../../constants";

export const findLinkEntitiesStategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        block => {
            const entityKey = block.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === ENTITY.LINK
            );
        },
        callback
    );
};

const Link = props => {
    const { contentState, entityKey } = props;
    const { link } = contentState.getEntity(entityKey).getData();
    return (
        <a 
            className="Link"
            href={link}
            rel="noopener noreferrer"
            target="_blank"
            aria-label={link}
        >{props.children}</a>
    );
};
Link.propTypes = {
    children: PropTypes.node,
    entityKey: PropTypes.string,
    contentState: PropTypes.object.isRequired
};

export default Link;