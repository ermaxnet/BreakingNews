import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import { ENTITY } from "../../../constants";
import linkifyIt from "linkify-it";

const linkify = linkifyIt();

export const findLinkifyEntitiesStategy = (contentBlock, callback) => {
    const links = linkify.match(contentBlock.get("text"));
    if(links) {
        links.forEach(link => {
            callback(link.index, link.lastIndex, link.url);
        });
    }
};

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

export class AutoLink extends ReactComponent {
    static propTypes = {
        children: PropTypes.node,
        entityKey: PropTypes.string,
        contentState: PropTypes.object.isRequired
    }

    render() {
        const { contentState, entityKey, children } = this.props;
        const { link } = contentState.getEntity(entityKey).getData();
        return (
            <a 
                className="link"
                href={link}
                rel="noopener noreferrer"
                target="_blank"
                aria-label={link} 
                children={children}
            />
        );
    }
};