import { BLOCK_STYLE } from "../../constants";

const BASE_BLOCK_CLASS = "block";
/**
 * Возвращает классы для специальных блоков
 * 
 * @param {*} contentBlock 
 */
export default function(contentBlock) {
    switch(contentBlock.getType()) {
        case BLOCK_STYLE.BLOCKQUOTE: {
            return `${BASE_BLOCK_CLASS} quote`;
        }
        case BLOCK_STYLE.UNSTYLED: {
            return contentBlock.getText() 
                ? `${BASE_BLOCK_CLASS} text`
                : BASE_BLOCK_CLASS;
        }
        case BLOCK_STYLE.BLOCKQUOTE_CAPTION: {
            return `${BASE_BLOCK_CLASS} quote caption`;
        }
        case BLOCK_STYLE.UL:
        case BLOCK_STYLE.OL: {
            return `${BASE_BLOCK_CLASS} list-item`;
        }
        case BLOCK_STYLE.IMAGE:
        case BLOCK_STYLE.IMAGES: {
            return `${BASE_BLOCK_CLASS} media`;
        }
        case BLOCK_STYLE.H1: {
            return `${BASE_BLOCK_CLASS} caption caption--1`;
        }
        case BLOCK_STYLE.H2: {
            return `${BASE_BLOCK_CLASS} caption caption--2`;
        }
        case BLOCK_STYLE.H3: {
            return `${BASE_BLOCK_CLASS} caption caption--3`;
        }
        case BLOCK_STYLE.H4: {
            return `${BASE_BLOCK_CLASS} caption caption--4`;
        }
        default: {
            return BASE_BLOCK_CLASS;
        }
    }
};