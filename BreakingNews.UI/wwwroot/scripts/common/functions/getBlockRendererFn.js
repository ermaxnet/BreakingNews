import BlockquoteCaptions from "../../components/Pad/blocks/BlockquoteCaptions";
import Images from "../../components/Pad/blocks/Images";
import Image from "../../components/Pad/blocks/Image";
import { BLOCK_STYLE } from "../../constants";

/**
 * Возвращает пользовательский рендерер блоков в текстовом редакторе
 * 
 * @param {*} setState 
 * @param {*} getState 
 */
export default function(setState, getState) {
    return contentBlock => {
        const type = contentBlock.getType();
        switch(type) {
            case BLOCK_STYLE.BLOCKQUOTE_CAPTION: {
                return {
                    component: BlockquoteCaptions
                };
            }
            case BLOCK_STYLE.IMAGE: {
                return {
                    component: Image,
                    props: {
                        setState, getState
                    }
                };
            }
            case BLOCK_STYLE.IMAGES: {
                return {
                    component: Images,
                    props: {
                        setState, getState
                    }
                };
            }
            default: {
                return null;
            }
        }
    };
};