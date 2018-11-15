import { BLOCK_STYLE, ENTITY } from "../constants";
import { EditorState, ContentBlock, genKey } from "draft-js";
import { Map, List } from "immutable";

export const getDefaultBlockData = (blockType, initialData = {}) => {
    switch(blockType) {
        default: {
            return initialData;
        }
    };
};

export const getCurrentBlock = editorState => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    return contentState.getBlockForKey(selection.getStartKey());
};

export const getFirstEmptyBlock = (editorState, key = null) => {
    const contentState = editorState.getCurrentContent();
    if(key === null) {
        key = editorState.getSelection().getStartKey();
    }
    const block = contentState.getBlockForKey(key);
    if(block && block.getLength() === 0) {
        return [ block, key ];
    }
    const nextKey = contentState.getKeyAfter(key);
    if(!nextKey) {
        return null;
    }
    return getFirstEmptyBlock(editorState, nextKey);
};

export const addNewBlock = (editorState, newType = BLOCK_STYLE.UNSTYLED, initialData = {}) => {
    const selection = editorState.getSelection();
    if(!selection.isCollapsed()) {
        return editorState;
    }
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    const [ block, key ] = getFirstEmptyBlock(editorState);
    if(!block || block.getType() === newType) {
        return editorState;
    }
    const newBlock = block.merge({
        type: newType,
        text: "image",
        data: getDefaultBlockData(newType, initialData)
    });
    const newContentState = contentState.merge({
        blockMap: blockMap.set(key, newBlock),
        selectionAfter: selection
    });
    return EditorState.push(editorState, newContentState, "change-block-type");
};

export const resetBlockWithType = (editorState, newType = BLOCK_STYLE.UNSTYLED, overrides = {}) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const key = selection.getStartKey();
    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(key);
    const newBlock = block.mergeDeep(overrides, {
        type: newType,
        data: getDefaultBlockData(newType)
    });
    const newContentState = contentState.merge({
        blockMap: blockMap.set(key, newBlock),
        selectionAfter: selection.merge({
            anchorOffset: 0,
            focusOffset: 0
        }) 
    });
    return EditorState.push(editorState, newContentState, "change-block-type");
};

export const addNewBlockAt = (
    editorState,
    pivotBlockKey,
    newType = BLOCK_STYLE.UNSTYLED,
    initialData = {}
) => {
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(pivotBlockKey);
    if(!block) {
        throw new Error(`The pivot key ${pivotBlockKey} is not present in blockMap.`);
    }
    const blocksBefore = blockMap.toSeq().takeUntil(item => item === block);
    const blocksAfter = blockMap.toSeq().skipUntil(item => item === block).rest();
    const newBlockKey = genKey();
    const newBlock = new ContentBlock({
        key: newBlockKey,
        type: newType,
        characterList: List(),
        depth: 0,
        data: Map(getDefaultBlockData(newType, initialData))
    });

    const newBlockMap = blocksBefore.concat(
        [ 
            [ pivotBlockKey, block], 
            [ newBlockKey, newBlock] 
        ],
        blocksAfter
    ).toOrderedMap();

    const selection = editorState.getSelection();

    const newContentState = contentState.merge({
        blockMap: newBlockMap,
        selectionBefore: selection,
        selectionAfter: selection.merge({
            anchorKey: newBlockKey,
            anchorOffset: 0,
            focusKey: newBlockKey,
            focusOffset: 0,
            isBackward: false
        })
    });
    return EditorState.push(editorState, newContentState, "split-block");
};

export const isCursorBetweenLink = editorState => {
    let cursor = null;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const block = getCurrentBlock(editorState);
    if(!block) {
        return cursor;
    }
    let entityKey = null, key = null;
    if(block.getType() !== BLOCK_STYLE.ATOMIC && selection.isCollapsed()) {
        if(block.getLength() > 0) {
            if(selection.getAnchorOffset() > 0) {
                entityKey = block.getEntityAt(selection.getAnchorOffset() - 1);
                key = block.getKey();
                if(entityKey !== null) {
                    const entity = contentState.getEntity(entityKey);
                    if(entity.getType() === ENTITY.LINK) {
                        cursor = {
                            entityKey,
                            blockKey: key,
                            link: entity.getData().link
                        };
                    }
                }
            }
        }
    }
    return cursor;
};