import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import {
    EditorState,
    RichUtils,
    getDefaultKeyBinding,
    SelectionState
} from "draft-js";
import Editor from "draft-js-plugins-editor";
import isSoftNewlineEvent from "draft-js/lib/isSoftNewlineEvent";
import blockRenderMap from "../../common/functions/blockRenderMap";
import getBlockRendererFn from "../../common/functions/getBlockRendererFn";
import blockStyleFn from "../../common/functions/blockStyleFn";
import onBeforeInput, { TextToType } from "../../common/functions/onBeforeInput";
import {
    getCurrentBlock,
    resetBlockWithType,
    addNewBlockAt
} from "../../models/Editor";
import {
    BLOCK_STYLE,
    CUSTOM_STYLE_MAP,
    ENTITY
} from "../../constants";
import { 
    findLinkifyEntitiesStategy, 
    findLinkEntitiesStategy,
    AutoLink 
} from "./entities/Link";
import DangerText, { findDangerTextStategy } from "./entities/DangerText";
import { convertContentToHTML } from "../../models/Exporter";
import "components/Pad.scss";

class Pad extends ReactComponent {
    static propTypes = {
        state: PropTypes.instanceOf(EditorState).isRequired,
        placeholder: PropTypes.string,
        readOnly: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        commentPad: PropTypes.bool,
        
        useLinkify: PropTypes.bool,
        useDangerText: PropTypes.bool,
        maxCount: PropTypes.number
    }
    static defaultProps = {
        readOnly: false,
        commentPad: false,
        useLinkify: true,
        useDangerText: false,
        maxCount: 280
    }

    constructor(props) {
        super(props);

        this.focus = () => this.padRef.focus();
        this.blockRendererFn = getBlockRendererFn(this.onChange.bind(this), this.getState.bind(this));
        this.blockStyleFn = blockStyleFn;

        this.plugins = [
            {
                decorators: [
                    {
                        strategy: findLinkEntitiesStategy,
                        component: AutoLink
                    }
                ]
            }
        ];
        if(this.props.useDangerText) {
            this.plugins.push({
                decorators: [
                    {
                        strategy: findDangerTextStategy,
                        component: DangerText
                    }
                ]
            });
        }
    }

    get textMapping() {
        return TextToType;
    }
    get styles() {
        return CUSTOM_STYLE_MAP;
    }
    get blockRenderMap() {
        return blockRenderMap;
    }
    get continuousBlocks() {
        return [
            BLOCK_STYLE.UNSTYLED,
            BLOCK_STYLE.BLOCKQUOTE,
            BLOCK_STYLE.OL,
            BLOCK_STYLE.UL
        ];
    }
    get length() {
        const { state } = this.props;
        const contentState = state.getCurrentContent();
        const text = contentState.getPlainText();
        return text.length;
    }

    getState() {
        return this.props.state;
    }
    onChange(state, done = null) {
        if(this.props.useLinkify) {
            const contentState = state.getCurrentContent();
            const blocks = contentState.getBlockMap();

            blocks.forEach(block => {
                const key = block.getKey();
                findLinkifyEntitiesStategy(block, (start, end, link) => {
                    let entityKey = block.getEntityAt(start);
                    if(entityKey) {
                        const entity = contentState.getEntity(entityKey);
                        if(entity.getType() === ENTITY.LINK && entity.data.link === link) {
                            return false;
                        }
                    }
                    const stateSelection = state.getSelection();
                    const selection = new SelectionState({
                        anchorKey: key,
                        focusKey: key,
                        anchorOffset: start,
                        focusOffset: end
                    });
                    const newContentState = contentState.createEntity(ENTITY.LINK, "IMMUTABLE", { link });
                    state = EditorState.forceSelection(
                        RichUtils.toggleLink(
                            EditorState.push(state, newContentState, "create-entity"),
                            selection,
                            newContentState.getLastCreatedEntityKey()
                        ),
                        stateSelection
                    );
                });
            });
        }
        if(this.props.useDangerText) {
            if(this.length + 1 > this.props.maxCount) {
                const contentState = state.getCurrentContent();
                const selection = state.getSelection();
                const dangerTextSelection = new SelectionState({
                    anchorKey: selection.getAnchorKey(),
                    focusKey: selection.getFocusKey(),
                    anchorOffset: this.props.maxCount,
                    focusOffset: selection.getFocusOffset()
                });
                const newContentState = contentState.createEntity(ENTITY.DANGER_TEXT, "MUTABLE");
                state = EditorState.forceSelection(
                    EditorState.push(
                        EditorState.forceSelection(
                            state,
                            dangerTextSelection
                        ), 
                        newContentState, 
                        "create-entity"
                    ),
                    selection
                );
                
                console.log(dangerTextSelection.toJS());
            }
        }
        return this.props.onChange(state, done);
    }
    onTab(e) {
        const { state } = this.props;
        const newState = RichUtils.onTab(e, state, 4);
        if(newState !== state) {
            this.onChange(newState);
        }
    }
    keyBinding(e) {
        return getDefaultKeyBinding(e);
    }
    handleKeyCommand(command) {
        const { state } = this.props;
        const newState = RichUtils.handleKeyCommand(state, command);
        if(newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }
    handleBeforeInput(text) {
        const { state, commentPad } = this.props;
        if(commentPad) {
            return false;
        }
        return onBeforeInput(
            state, text, this.props.onChange, this.textMapping
        );
    }
    handleReturn(e) {
        const { state } = this.props;
        if(isSoftNewlineEvent(e)) {
            this.onChange(
                RichUtils.insertSoftNewline(state)
            );
            return true;
        }
        if(e.altKey || e.metaKey || e.ctrlKey) {
            return false;
        }
        const block = getCurrentBlock(state);
        const type = block.getType();
        if(block.getLength() === 0) {
            switch(type) {
                case BLOCK_STYLE.H1:
                case BLOCK_STYLE.H2:
                case BLOCK_STYLE.H3:
                case BLOCK_STYLE.H4:
                case BLOCK_STYLE.UL:
                case BLOCK_STYLE.OL:
                case BLOCK_STYLE.BLOCKQUOTE:
                case BLOCK_STYLE.BLOCKQUOTE_CAPTION:
                    this.onChange(
                        resetBlockWithType(state, BLOCK_STYLE.UNSTYLED)
                    );
                    return true;
                default:
                    return false;
            }
        }
        const selection = state.getSelection();
        if(selection.isCollapsed() && block.getLength() === selection.getStartOffset()) {
            if(this.continuousBlocks.indexOf(type) === -1) {
                this.onChange(
                    addNewBlockAt(state, block.getKey())
                );
                return true;
            }
        }
        return false;
    }

    hasContent() {
        const { state } = this.props;
        const currentContent = state.getCurrentContent();
        return currentContent.hasText();
    }
    toHTML() {
        return convertContentToHTML(
            this.props.state.getCurrentContent()
        );
    }

    render() {
        const { 
            state, 
            placeholder, 
            readOnly
        } = this.props;
        return (
            <div className="Pad" onClick={this.focus}>
                <div className="Pad__editor">
                    <Editor 
                        ref={node => { this.padRef = node; }}
                        editorState={state}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        onChange={this.onChange.bind(this)}
                        spellCheck={true}
                        onTab={this.onTab.bind(this)}
                        keyBinding={this.keyBinding.bind(this)}

                        customStyleMap={this.styles}
                        blockRenderMap={this.blockRenderMap}
                        blockRendererFn={this.blockRendererFn}
                        blockStyleFn={this.blockStyleFn}

                        handleKeyCommand={this.handleKeyCommand.bind(this)}
                        handleBeforeInput={this.handleBeforeInput.bind(this)}
                        handleReturn={this.handleReturn.bind(this)}

                        plugins={this.plugins}
                    />
                </div>
            </div>
        );
    }
};

export default Pad;