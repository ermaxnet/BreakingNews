import React, { Component as ReactComponent } from "react";
import ReactDOM from "react-dom";
import { 
    Editor, 
    EditorState, 
    RichUtils, 
    ContentBlock, 
    SelectionState,
    Modifier,
    CompositeDecorator,
    KeyBindingUtil,
    getDefaultKeyBinding,
    genKey
} from "draft-js";
import isSoftNewlineEvent from "draft-js/lib/isSoftNewlineEvent";
import stringLocalizer from "../../../../common/stringLocalizer";
import PropTypes from "prop-types";
import Toolbar from "./Toolbar";
import { 
    CUSTOM_STYLE_MAP, 
    BLOCK_STYLE,
    DQUOTE_START, DQUOTE_END,
    SQUOTE_START, SQUOTE_END,
    ENTITY,
    COMMANDS,
    INLINE_STYLE
} from "../../../../constants";
import blockRenderMap from "../../../../common/functions/blockRenderMap";
import getBlockRendererFn from "../../../../common/functions/getBlockRendererFn";
import blockStyleFn from "../../../../common/functions/blockStyleFn";
import processURL from "../../../../common/functions/processURL";
import throttle from "../../../../common/functions/throttle";
import uploadImages from "../../../../common/functions/uploadImages";
import onBeforeInput, { TextToType } from "../../../../common/functions/onBeforeInput";
import { 
    getCurrentBlock, 
    addNewBlockAt,
    isCursorBetweenLink,
    resetBlockWithType
} from "../../../../models/Editor";
import Link, { findLinkEntitiesStategy } from "./Entities/Link";
import ImageCaption, { findImageCaptionStrategy } from "./Entities/ImageCaption";
import Menu from "./Menu";
import LinkEdit from "./LinkEdit";
import { OrderedMap } from "immutable";
import "components/article/editor/Text.scss";

const { hasCommandModifier } = KeyBindingUtil;

export default class Text extends ReactComponent {
    static propTypes = {
        placeholder: PropTypes.string,
        saveContent: PropTypes.func,
        loadContent: PropTypes.func
    }
    static defaultProps = {
        placeholder: stringLocalizer.t("text.placeholder"),
        readOnly: false
    }
    constructor(props) {
        super(props);
        this.state = {
            editorState: this.createEditorState()
        };
        this.blockRendererFn = getBlockRendererFn(this.onChange.bind(this), this.getEditorState.bind(this));
        this.blockStyleFn = blockStyleFn;
        this.onBeforeInput = onBeforeInput;
        this.focus = () => this.editorElement.focus();

        this.continuousBlocks = [
            BLOCK_STYLE.UNSTYLED,
            BLOCK_STYLE.BLOCKQUOTE,
            BLOCK_STYLE.OL,
            BLOCK_STYLE.UL
        ];
    }

    get customStyleMap() {
        return CUSTOM_STYLE_MAP;
    }
    get customBlockRenderMap() {
        return blockRenderMap;
    }
    get customTextMapping() {
        return TextToType;
    }

    componentDidMount() {
        setTimeout(this.setFloatingMenu.bind(this), 0);
    }
    setFloatingMenu() {
        const node = ReactDOM.findDOMNode(this);
        const menuNode = ReactDOM.findDOMNode(this.menuElement);
        const menuBoundary = menuNode.getBoundingClientRect();
        menuNode.style.width = `${menuBoundary.width}px`;
        node.style.paddingTop = `${menuBoundary.height + 9}px`;
        const calculateMenuPosition = () => { 
            const nodeBoundary = node.getBoundingClientRect();
            const top = ((window.pageYOffset || document.documentElement.scrollTop) 
                - (document.documentElement.clientTop || 0));
            if(top > nodeBoundary.top) {
                menuNode.style.position = "fixed";
                menuNode.style.left = `${nodeBoundary.left}px`;
                menuNode.classList.add("Menu--fixed");
            } else {
                menuNode.style.position = "absolute";
                menuNode.style.left = "0px";
                menuNode.classList.remove("Menu--fixed");
            }
        };
        const eventHandler = throttle(calculateMenuPosition, 25);
        window.addEventListener("scroll", eventHandler, false);
    }
    getEditorState() {
        return this.state.editorState;
    }
    createEditorState(contentState = null) {
        const decorators = new CompositeDecorator([
            {
                strategy: findLinkEntitiesStategy,
                component: Link
            },
            {
                strategy: findImageCaptionStrategy,
                component: ImageCaption
            }
        ]);
        const editorState = (contentState 
            ? EditorState.createWithContent(contentState, decorators)
            : EditorState.createEmpty(decorators));
        return editorState;
    }
    onChange(editorState, done = null) {
        this.setState({ editorState }, () => {
            if(typeof done === "function") {
                done();
            }
        });
    }
    keyBinding(e) {
        if(hasCommandModifier(e)) {
            switch(true) {
                case (e.which === 75 && e.shiftKey): // Ctrl + Shift + K
                    return COMMANDS.UNLINK;
                case e.which === 75: // Ctrl + K
                    return COMMANDS.SHOW_LINK_INPUT;
                case e.which === 83: // Ctrl + S
                    return COMMANDS.SAVE_CONTENT;
            }
        }
        if(e.altKey === true) {
            if(e.shiftKey === true) {
                switch(e.which) {
                    case 76: // Alt + Shift + L
                        return COMMANDS.LOAD_CONTENT;
                }
            }
            if(!e.ctrlKey) {
                switch(e.which) {
                    case 49: // Alt + 1
                        return COMMANDS.CHANGE_TYPE(BLOCK_STYLE.OL);
                    case 50: // Alt + @
                        return COMMANDS.SHOW_LINK_INPUT;
                    case 51: // Alt + #
                        return COMMANDS.CHANGE_TYPE(BLOCK_STYLE.H3);
                    case 56: // Alt + *
                        return COMMANDS.CHANGE_TYPE(BLOCK_STYLE.UL);
                    case 72: // Alt + H
                        return COMMANDS.TOGGLE_INLINE_STYLE(INLINE_STYLE.HIGHLIGHT);
                    case 190: // Alt + >
                        return COMMANDS.CHANGE_TYPE(BLOCK_STYLE.UNSTYLED);
                    case 222: // Alt + "
                        return COMMANDS.CHANGE_TYPE(BLOCK_STYLE.BLOCKQUOTE);
                }
            }
        }
        return getDefaultKeyBinding(e);
    }
    handleKeyCommand(command) {
        const { editorState } = this.state;
        if(command === COMMANDS.SAVE_CONTENT) {
            this.props.saveContent(editorState);
            return true;
        }
        if(command === COMMANDS.LOAD_CONTENT) {
            this.props.loadContent(editorState, this.onChange.bind(this), this.focus.bind(this));
            return true;
        }
        if(command === COMMANDS.SHOW_LINK_INPUT) {
            if(!this.toolbarElement) {
                return false;
            }
            const cursor = isCursorBetweenLink(editorState);
            if(cursor) {
                this.editLink(cursor.blockKey, cursor.entityKey);
                return true;
            }
            this.toolbarElement.handleHyperlinkClick(null, true);
            return true;
        }
        if(command === COMMANDS.UNLINK) {
            const cursor = isCursorBetweenLink(editorState);
            if(cursor) {
                this.removeLink(cursor.blockKey, cursor.entityKey);
                return true;
            }
        }
        if(~command.indexOf(COMMANDS.CHANGE_TYPE())) {
            const type = command.split(":")[1];
            //const currentType = getCurrentBlock(editorState).getType();
            if(type === BLOCK_STYLE.ATOMIC) {
                return true;
            }
            this.toggleBlockType(type);
        }
        if(~command.indexOf(COMMANDS.TOGGLE_INLINE_STYLE())) {
            const style = command.split(":")[1];
            this.toggleInlineStyle(style);
            return true;
        }
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if(newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }
    handleBeforeInput(text) {
        const editorState = this.state.editorState;
        if(text === `"` || text === `'`) {
            const currentBlock = getCurrentBlock(editorState);
            const selection = editorState.getSelection();
            const contentState = editorState.getCurrentContent();
            const content = currentBlock.getText();
            const contentLength = content.length;
            if(selection.getAnchorOffset() === 0) {
                this.onChange(
                    EditorState.push(
                        editorState,
                        Modifier.insertText(contentState, selection, (text === `"` ? DQUOTE_START : SQUOTE_START)),
                        "transpose-characters"
                    )
                );
                return true;
            } else if(contentLength > 0) {
                const last = content[contentLength - 1];
                last !== " "
                    ? (
                        this.onChange(
                            EditorState.push(
                                editorState,
                                Modifier.insertText(contentState, selection, (text === `"` ? DQUOTE_END : SQUOTE_END)),
                                "transpose-characters"
                            )
                        )
                    )
                    : (
                        this.onChange(
                            EditorState.push(
                                editorState,
                                Modifier.insertText(contentState, selection, (text === `"` ? DQUOTE_START : SQUOTE_START)),
                                "transpose-characters"
                            )
                        )
                    );
                return true;
            }
        }
        return this.onBeforeInput(
            editorState, text, this.onChange.bind(this), this.customTextMapping
        );
    }
    toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }
    toggleBlockType(blockType) {
        const type = RichUtils.getCurrentBlockType(this.state.editorState);
        if(~type.indexOf(`${BLOCK_STYLE.ATOMIC}:`)) {
            return;
        }
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }
    setLink(link) {
        let { editorState } = this.state;
        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        let entityKey = null, newLink = processURL(link);
        if(newLink) {
            const contentWithEntity = contentState.createEntity(
                ENTITY.LINK, "MUTABLE", { link: newLink }
            );
            editorState = EditorState.push(editorState, contentWithEntity, "create-entity");
            entityKey = contentWithEntity.getLastCreatedEntityKey();
        }
        this.onChange(RichUtils.toggleLink(editorState, selection, entityKey), this.focus);
    }
    removeLink(key, entityKey) {
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const block = contentState.getBlockForKey(key);
        const selection = editorState.getSelection();
        block.findEntityRanges(character => {
            return character.getEntity() === entityKey;
        }, (start, end) => {
            const newSelection = new SelectionState({
                anchorKey: key,
                focusKey: key,
                anchorOffset: start,
                focusOffset: end
            });
            this.onChange(
                EditorState.forceSelection(
                    RichUtils.toggleLink(editorState, newSelection, null),
                    selection
                ),
                this.focus
            );
        });
    }
    editLink(key, entityKey = null) {
        if(!entityKey) {
            return;
        }
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const block = contentState.getBlockForKey(key);
        block.findEntityRanges(character => {
            return character.getEntity() === entityKey;
        }, (start, end) => {
            const newSelection = new SelectionState({
                anchorKey: key,
                focusKey: key,
                anchorOffset: start,
                focusOffset: end
            });
            this.onChange(
                EditorState.forceSelection(editorState, newSelection),
                () => {
                    if(this.toolbarElement) {
                        setTimeout(() => this.toolbarElement.handleHyperlinkClick(null, true), 100);
                    }
                }
            );
        });
    }
    handleDroppedFiles(selection, files) {
        files = Array.from(files).filter(file => ~file.type.indexOf("image/"));
        return uploadImages(files).then(images => {
            if(images && images.length) {
                images.length === 1
                    ? this.onChange(addNewBlockAt(
                        this.state.editorState,
                        selection.getAnchorKey(),
                        BLOCK_STYLE.IMAGE, { link: images[0] }
                    ))
                    : this.onChange(addNewBlockAt(
                        this.state.editorState,
                        selection.getAnchorKey(),
                        BLOCK_STYLE.IMAGES, { links: images }
                    ));
            }
        }).then(() => true).catch(err => {
            console.error(err);
            return false;
        });
    }
    handlePastedText(text) {
        const block = getCurrentBlock(this.state.editorState);
        if(block.getType() === BLOCK_STYLE.IMAGE || block.getType() === BLOCK_STYLE.IMAGES) {
            const { editorState } = this.state;
            const contentState = editorState.getCurrentContent();
            this.onChange(
                EditorState.push(
                    editorState,
                    Modifier.insertText(
                        contentState,
                        editorState.getSelection(),
                        text
                    )
                )
            );
            return true;
        }
        return false;
    }
    handleReturn(e) {
        const { editorState } = this.state;
        if(isSoftNewlineEvent(e)) {
            this.onChange(
                RichUtils.insertSoftNewline(editorState)
            );
            return true;
        }
        if(e.altKey || e.metaKey || e.ctrlKey) {
            return false;
        }
        const block = getCurrentBlock(editorState);
        const type = block.getType();
        if(~type.indexOf(BLOCK_STYLE.ATOMIC)) {
            this.onChange(
                addNewBlockAt(editorState, block.getKey())
            );
            return true;
        }
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
                        resetBlockWithType(editorState, BLOCK_STYLE.UNSTYLED)
                    );
                    return true;
                default:
                    return false;
            }
        }
        const selection = editorState.getSelection();
        if(selection.isCollapsed() && block.getLength() === selection.getStartOffset()) {
            if(this.continuousBlocks.indexOf(type) === -1) {
                this.onChange(
                    addNewBlockAt(editorState, block.getKey())
                );
                return true;
            }
        }
        return false;
    }
    onTab(e) {
        const { editorState } = this.state;
        const newEditorState = RichUtils.onTab(e, editorState, 2);
        if(newEditorState !== editorState) {
            this.onChange(newEditorState);
        }
    } 
    onUpArrow(e) {
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const key = selection.getAnchorKey();
        const block = contentState.getBlockForKey(key);
        const firstBlock = contentState.getFirstBlock();
        if(firstBlock.getKey() === key) {
            if(~firstBlock.getType().indexOf(BLOCK_STYLE.ATOMIC)) {
                e.preventDefault();
                const newBlock = new ContentBlock({
                    type: BLOCK_STYLE.UNSTYLED,
                    key: genKey()
                });
                const newBlockMap = OrderedMap([
                    [ newBlock.getKey(), newBlock ]
                ]).concat(contentState.getBlockMap());
                const newContent = contentState.merge({
                    blockMap: newBlockMap,
                    selectionAfter: selection.merge({
                        anchorKey: newBlock.getKey(),
                        focusKey: newBlock.getKey(),
                        anchorOffset: 0,
                        focusOffset: 0,
                        isBackward: false
                    })
                });
                this.onChange(
                    EditorState.push(editorState, newContent, "insert-characters")
                );
            }
        } else if(~block.getType().indexOf(BLOCK_STYLE.ATOMIC)) {
            const blockBefore = contentState.getBlockBefore(key);
            if(!blockBefore) {
                return;
            }
            e.preventDefault();
            const newSelection = selection.merge({
                anchorKey: blockBefore.getKey(),
                focusKey: blockBefore.getKey(),
                anchorOffset: blockBefore.getLength(),
                focusOffset: blockBefore.getLength(),
                isBackward: false
            });
            this.onChange(
                EditorState.forceSelection(editorState, newSelection)
            );
        }
    }
    render() {
        const { editorState } = this.state;
        const isCursorOnLink = isCursorBetweenLink(editorState);
        return (
            <div className="Text">
                <Menu 
                    ref={element => { this.menuElement = element; }}
                    editorState={this.state.editorState} 
                    toggleInlineStyle={this.toggleInlineStyle.bind(this)}
                    toggleBlockType={this.toggleBlockType.bind(this)}
                    getEditorState={this.getEditorState.bind(this)}
                    setEditorState={this.onChange.bind(this)}
                />
                <div className="Text__editor">
                    <Editor
                        ref={element => { this.editorElement = element; }}
                        editorState={this.state.editorState} 
                        spellCheck={true}
                        onTab={this.onTab.bind(this)}
                        onUpArrow={this.onUpArrow.bind(this)}
                        onChange={this.onChange.bind(this)} 
                        handleKeyCommand={this.handleKeyCommand.bind(this)}
                        handleBeforeInput={this.handleBeforeInput.bind(this)}
                        placeholder={this.props.placeholder}

                        customStyleMap={this.customStyleMap}
                        blockRenderMap={this.customBlockRenderMap}
                        blockRendererFn={this.blockRendererFn}
                        blockStyleFn={this.blockStyleFn}
                        
                        handleDroppedFiles={this.handleDroppedFiles.bind(this)}
                        handlePastedText={this.handlePastedText.bind(this)}
                        handleReturn={this.handleReturn.bind(this)}
                        keyBindingFn={this.keyBinding.bind(this)}
                    />
                    <Toolbar
                        ref={element => { this.toolbarElement = element; }}
                        editorElement={this.editorElement}
                        editorState={this.state.editorState}
                        toggleInlineStyle={this.toggleInlineStyle.bind(this)}
                        toggleBlockType={this.toggleBlockType.bind(this)}
                        onFocus={this.focus}
                        setLink={this.setLink.bind(this)}
                    />
                    {isCursorOnLink && (
                        <LinkEdit 
                            {...isCursorOnLink}
                            editorState={editorState}
                            remove={this.removeLink.bind(this)}
                            edit={this.editLink.bind(this)}
                        />
                    )}
                </div>
            </div>
        );
    }
};