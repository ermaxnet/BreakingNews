import React, { Component as ReactComponent } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import BlockToolbar from "./BlockToolbar";
import InlineToolbar from "./InlineToolbar";
import "components/article/editor/Toolbar.scss";
import getSelection from "../../../../common/functions/getSelection";
import getSelectionRect from "../../../../common/functions/getSelectionRect";
import { 
    INLINE_BUTTONS, 
    INLINE_STYLE,
    BLOCK_BUTTONS,
    ENTITY
} from "../../../../constants";
import Icon from "../../../common/Icon";
import stringLocalizer from "../../../../common/stringLocalizer";
import { getCurrentBlock } from "../../../../models/Editor";

export default class Toolbar extends ReactComponent {
    static propTypes = {
        editorElement: PropTypes.object,
        editorState: PropTypes.object,
        toggleInlineStyle: PropTypes.func,
        toggleBlockType: PropTypes.func,
        onFocus: PropTypes.func,
        setLink: PropTypes.func
    }
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: false,
            isLinkInputOpen: false,
            linkInputValue: ""
        };
    }

    componentWillReceiveProps(props) {
        const { editorState } = props;
        const selection = editorState.getSelection();
        if(selection.isCollapsed() && this.state.isLinkInputOpen) {
            return this.setState({
                isLinkInputOpen: false,
                linkInputValue: ""
            });
        }
    }
    componentDidUpdate() {
        if(this.state.isLinkInputOpen) {
            return;
        }
        const isOpen = this.state.isOpen;

        const selectionState = this.props.editorState.getSelection();
        if(selectionState.isCollapsed()) {
            return isOpen && this.setState({ isOpen: false });
        }
        !isOpen && this.setState({ isOpen: true });

        const nativeSelection = getSelection(window);
        if(!nativeSelection.rangeCount) {
            return;
        }
        const selectionBoundary = getSelectionRect(nativeSelection);

        const toolbarNode = ReactDOM.findDOMNode(this);
        const toolbarBoundary = toolbarNode.getBoundingClientRect();

        const editorNode = ReactDOM.findDOMNode(this.props.editorElement);
        const editorBoundary = editorNode.getBoundingClientRect();

        toolbarNode.style.top =
            `${(selectionBoundary.top - editorBoundary.top - toolbarBoundary.height - 5)}px`;
        if(toolbarNode.offsetWidth < toolbarBoundary.width) {
            toolbarNode.style.width = `${toolbarBoundary.width}px`;
        }
        const widthDiff = selectionBoundary.width - toolbarBoundary.width;
        if(widthDiff >= 0) {
            toolbarNode.style.left = `${widthDiff / 2}px`;
        } else {
            const left = selectionBoundary.left - editorBoundary.left;
            toolbarNode.style.left = `${left + (widthDiff / 2)}px`;
        }
    }
    handleHyperlinkClick(e, isDirect = false) {
        if(!isDirect) {
            e.preventDefault();
            e.stopPropagation();
        }
        const { editorState } = this.props;
        const selection = editorState.getSelection();
        if(selection.isCollapsed()) {
            return this.props.onFocus();
        }
        const currentBlock = getCurrentBlock(editorState);
        let entity = "", linkFound = false;
        currentBlock.findEntityRanges(block => {
            const entityKey = block.getEntity();
            entity = entityKey;
            return entityKey !== null 
                && editorState.getCurrentContent().getEntity(entityKey).getType() === ENTITY.LINK;
        }, (start, end) => {
            let selectionStart = selection.getAnchorOffset(),
                selectionEnd = selection.getFocusOffset();
            if(selection.getIsBackward()) {
                selectionStart = selection.getFocusOffset();
                selectionEnd = selection.getAnchorOffset();
            }
            if(start === selectionStart && end === selectionEnd) {
                linkFound = true;
                const { link } = editorState.getCurrentContent().getEntity(entity).getData();
                this.setState({
                    isLinkInputOpen: true,
                    linkInputValue: link
                }, () => {
                    setTimeout(() => {
                        this.linkInput.focus();
                        this.linkInput.select();
                    }, 0);
                });
            }
        });
        if(linkFound) {
            return;
        }
        this.setState({
            isLinkInputOpen: true
        }, () => {
            setTimeout(() => {
                this.linkInput.focus();
            }, 0);
        });
    }
    closeLinkInput(e) {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.setState({
            isLinkInputOpen: false,
            linkInputValue: ""
        }, this.props.onFocus);
    }
    onLinkChange(e) {
        this.setState({
            linkInputValue: e.target.value
        });
    }
    onLinkKeyDown(e) {
        switch(e.which) {
            case 13: {
                e.preventDefault();
                e.stopPropagation();
                this.props.setLink(this.state.linkInputValue);
                return this.closeLinkInput();
            }
            case 27: {
                return this.closeLinkInput();
            }
        }
    }
    render() {
        const { editorState } = this.props;
        let { isOpen, isLinkInputOpen } = this.state;
        if(editorState.getSelection().isCollapsed()) {
            isOpen = false;
        }
        if(isLinkInputOpen) {
            return (
                <div className={`Toolbar${isOpen ? " Toolbar--isOpen" : ""} Toolbar--Link`}>
                    <div className="Toolbar__LinkInput">
                        <span className="IconClose" onClick={this.closeLinkInput.bind(this)}><Icon iconClass="fa-times" /></span>
                        <input 
                            ref={element => { this.linkInput = element; }}
                            type="text"
                            className="TextInput"
                            value={this.state.linkInputValue}
                            onChange={this.onLinkChange.bind(this)}
                            onKeyDown={this.onLinkKeyDown.bind(this)}
                            placeholder={stringLocalizer.t("link_input_placeholder")}
                        />
                    </div>
                </div>
            );
        }
        const hyperlinkButton = INLINE_BUTTONS.filter(button => button.style === INLINE_STYLE.HYPERLINK);
        const hyperlinkOptions = (hyperlinkButton && hyperlinkButton.length === 1)
            ? hyperlinkButton[0]
            : null;
        return (
            <div className={`Toolbar${isOpen ? " Toolbar--isOpen" : ""}`}>
                <BlockToolbar 
                    editorState={this.props.editorState}
                    buttons={BLOCK_BUTTONS}
                    onToggle={this.props.toggleBlockType}
                />
                <InlineToolbar 
                    editorState={this.props.editorState}
                    buttons={INLINE_BUTTONS}
                    onToggle={this.props.toggleInlineStyle}
                />
                {hyperlinkOptions && (
                    <div className="Toolbar__HyperLink">
                        <span
                            className={`Toolbar__Button Toolbar__Button_${hyperlinkOptions.style.toLowerCase()}`}
                            onClick={this.handleHyperlinkClick.bind(this)}
                            aria-label={stringLocalizer.t(hyperlinkOptions.description)}
                        >
                            {hyperlinkOptions.label}
                        </span>
                    </div>
                )}
            </div>
        );
    }
};