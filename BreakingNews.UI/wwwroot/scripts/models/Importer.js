import { convertFromHTML } from "draft-convert";
import { INLINE_STYLE, BLOCK_STYLE, ENTITY } from "../constants";

export function convertInlineStyle(nodeName, node, style) {
    switch(nodeName) {
        case "strong": 
            return style.add(INLINE_STYLE.BOLD);
        case "em":
            return style.add(INLINE_STYLE.ITALIC);
        case "u":
            return style.add(INLINE_STYLE.UNDERLINE);
        case "mark":
            return style.add(INLINE_STYLE.HIGHLIGHT);
        
        default:
            break;
    }
    return style;
};

export function convertBlock(nodeName, node) {
    switch(true) {
        case (nodeName === "h1"): 
            return {
                type: BLOCK_STYLE.H1,
                data: {}
            };
        case (nodeName === "h2"):
            return {
                type: BLOCK_STYLE.H2,
                data: {}
            };
        case (nodeName === "h3"):
            return {
                type: BLOCK_STYLE.H3,
                data: {}
            };
        case (nodeName === "h4"):
            return {
                type: BLOCK_STYLE.H4,
                data: {}
            };
        case (nodeName === "p" && node.className === "mais__caption"):
            return {
                type: BLOCK_STYLE.BLOCKQUOTE_CAPTION,
                data: {}
            };
        case (nodeName === "div" && node.classList.contains("mais__slider")): {
            const images = node.querySelectorAll(".mais__imageFigure__image");
            if(!images || !images.length) {
                return null;
            }
            const imagesLink = Array.from(images).map(image => image.getAttribute("src"));
            return {
                type: BLOCK_STYLE.IMAGES,
                data: {
                    links: imagesLink
                }
            };
        }
        case (nodeName === "figure"): {
            const image = node.querySelector(".mais__imageFigure__image");
            if(!image || !image.src) {
                return null;
            }
            return {
                type: BLOCK_STYLE.IMAGE,
                data: {
                    link: image.getAttribute("src")
                }
            }
        }
        case (nodeName === "blockquote"): 
            return {
                type: BLOCK_STYLE.BLOCKQUOTE,
                data: {}
            };
        case (nodeName === "p"): 
            return {
                type: BLOCK_STYLE.UNSTYLED,
                data: {}
            };
    }
};

export function convertEntity(nodeName, node, createEntity) {
    if(nodeName === "a") {
        return createEntity(
            ENTITY.LINK, 
            "MUTABLE", 
            { link: node.href }
        );
    }
    return null;
};

export const defaultOptions = {
    htmlToStyle: convertInlineStyle,
    htmlToBlock: convertBlock,
    htmlToEntity: convertEntity
};

export function setHTMLOptions(HTMLOptions = defaultOptions) {
    return convertFromHTML(HTMLOptions);
};

export function convertArticleFromHTML(HTML, HTMLOptions = defaultOptions) {
    return convertFromHTML(HTMLOptions)(HTML);
};