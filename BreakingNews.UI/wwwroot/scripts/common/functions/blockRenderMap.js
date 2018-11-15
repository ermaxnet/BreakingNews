import { Map } from "immutable";
import { DefaultDraftBlockRenderMap } from "draft-js";
import { BLOCK_STYLE } from "../../constants";

const BlockRenderMap = DefaultDraftBlockRenderMap.merge(Map({
    [BLOCK_STYLE.BLOCKQUOTE_CAPTION]: {
        element: "blockquote"
    },
    [BLOCK_STYLE.UNSTYLED]: {
        element: "div",
        aliasedElements: [ "p" ]
    },
    [BLOCK_STYLE.IMAGE]: {
        element: "figure"
    },
    [BLOCK_STYLE.IMAGES]: {
        element: "div"
    }
}));

export default BlockRenderMap;