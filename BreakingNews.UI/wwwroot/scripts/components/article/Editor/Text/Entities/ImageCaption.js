import React, { Component as ReactComponent } from "react";
import { ENTITY } from "../../../../../constants";

export const findImageCaptionStrategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        block => {
            const entityKey = block.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === ENTITY.IMAGE_CAPTION
            );
        },
        callback
    );
};

export default class ImageCaption extends ReactComponent {
    render() {
        return (
            <figcaption className="ImageCaption">
                Caption
            </figcaption>
        );
    }
};