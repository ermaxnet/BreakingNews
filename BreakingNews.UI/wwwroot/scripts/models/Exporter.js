import React from "react";
import { convertToHTML } from "draft-convert";
import { INLINE_STYLE, BLOCK_STYLE, ENTITY } from "../constants";

export function convertInlineStyle(style) {
    switch(style) {
        case INLINE_STYLE.BOLD: 
            return <strong />;
        case INLINE_STYLE.ITALIC: 
            return <em />;
        case INLINE_STYLE.UNDERLINE: 
            return <u />;
        case INLINE_STYLE.HIGHLIGHT:
            return <mark />;

        default: 
            return null;
    }
};

function getImageHTML(imageLink, text = null) {
    if(text && text.length > 0) {
        return {
            start: `
                <figure class="mais__imageFigure">
                    <img class="mais__imageFigure__image" src="${imageLink}" alt="${text}" />
                    <figcaption class="mais__imageFigure__imageCaption">
            `,
            end: "</figcaption></figure>"
        };
    }
    return {
        start: `<figure class="mais__imageFigure"><img class="mais__imageFigure__image" src="${imageLink}" alt="image" />`,
        end: "</figure>"
    };
};

export function convertBlock(block) {
    const type = block.type;
    switch(type) {
        case BLOCK_STYLE.H1:
            return <h1 />;
        case BLOCK_STYLE.H2:
            return <h2 />;
        case BLOCK_STYLE.H3:
            return <h3 />;
        case BLOCK_STYLE.H4:
            return <h4 />;
        case BLOCK_STYLE.BLOCKQUOTE:
            return <blockquote />;
        case BLOCK_STYLE.BLOCKQUOTE_CAPTION:
            return {
                start: `<p><caption>`,
                end: `</caption></p>`
            }
        case BLOCK_STYLE.IMAGE: {
            const imageLink = block.data.link;
            const text = block.text;
            return getImageHTML(imageLink, text);
        }   
        case BLOCK_STYLE.IMAGES: {
            const images = block.data.links;
            if(images && images.length) {
                const imagesHTML = images.map(image => {
                    return getImageHTML(image);
                }).reduce((HTML, image) => {
                    return HTML + image.start + image.end;
                }, "");
                return {
                    start: `<div class="mais__slider">${imagesHTML}`,
                    end: `</div>`
                };
            }
            return null;
        }
        case BLOCK_STYLE.UL: 
            return {
                element: <li />,
                nest: <ul />
            };
        case BLOCK_STYLE.OL: 
            return {
                element: <li />,
                nest: <ol />
            };
        case BLOCK_STYLE.UNSTYLED: {
            if(block.text.length < 1) {
                return <span><br/></span>;
            }
            return <span />;
        }

        default:
            return null;
    }
};

export function convertEntity(entity, text) {
    if(entity.type === ENTITY.LINK) {
        return (
            <a
                className="link"
                href={entity.data.link}
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={entity.data.link} 
            >
                {text}
            </a>
        );
    }
    return text;
};

export const defaultOptions = {
    styleToHTML: convertInlineStyle,
    blockToHTML: convertBlock,
    entityToHTML: convertEntity
};

export function setHTMLOptions(HTMLOptions = defaultOptions) {
    return convertToHTML(HTMLOptions);
};

export function convertContentToHTML(contentState, HTMLOptions = defaultOptions) {
    return convertToHTML(HTMLOptions)(contentState);
};