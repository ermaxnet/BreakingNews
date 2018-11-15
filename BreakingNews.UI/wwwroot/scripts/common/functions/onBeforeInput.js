import { BLOCK_STYLE } from "../../constants";
import { getCurrentBlock, resetBlockWithType } from "../../models/Editor";

export const TextToType = {
    ["--"]: `${BLOCK_STYLE.BLOCKQUOTE}:${BLOCK_STYLE.BLOCKQUOTE_CAPTION}`,
    ["> "]: BLOCK_STYLE.BLOCKQUOTE,
    ["=="]: BLOCK_STYLE.UNSTYLED,
    ["# "]: BLOCK_STYLE.H1,
    ["## "]: BLOCK_STYLE.H2,
    ["### "]: BLOCK_STYLE.H3,
    ["####"]: BLOCK_STYLE.H4
};

export default function(editorState, text, onChange, mapping = TextToType) {
    const selection = editorState.getSelection();
    const block = getCurrentBlock(editorState);
    const blockType = block.getType();
    if(blockType.indexOf(BLOCK_STYLE.ATOMIC) === 0) {
        return false;
    }
    const blockLength = block.getLength();
    if(selection.getAnchorOffset() > 4 || blockLength > 4) {
        return false;
    }
    const blockTo = mapping[block.getText() + text];
    if(!blockTo) {
        return false;
    }
    const types = blockTo.split(":");
    if(types < 1) {
        return false;
    }
    let resultType = types[0];
    switch(types.length) {
        case 2: {
            resultType = blockType === types[0] 
                ? types[1] : types[0];
            break;
        }
    }
    onChange(resetBlockWithType(editorState, resultType, {
        text: ""
    }));
    return true;
};