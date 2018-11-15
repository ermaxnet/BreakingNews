import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import { MENU_BUTTONS } from "../../../../constants";
import MenuList from "./MenuList";
import { RichUtils } from "draft-js";

export default class Menu extends ReactComponent {
    static propTypes = {
        editorState: PropTypes.object,
        toggleInlineStyle: PropTypes.func,
        toggleBlockType: PropTypes.func,
        getEditorState: PropTypes.func,
        setEditorState: PropTypes.func
    }

    toggleButtonState(isBlockButton, type) {
        if(isBlockButton) {
            const blockType = RichUtils.getCurrentBlockType(this.props.editorState);
            return blockType === type;
        }
        return false;
    }
    onToggle(style, isBlock) {
        return isBlock 
            ? this.props.toggleBlockType(style) 
            : this.props.toggleInlineStyle(style);
    }
    render() {
        return (
            <header className="Menu">
                <MenuList
                    buttons={MENU_BUTTONS}
                    toggleButtonState={this.toggleButtonState.bind(this)}
                    onToggle={this.onToggle.bind(this)}
                    enabledImages={true}
                    getEditorState={this.props.getEditorState}
                    setEditorState={this.props.setEditorState}
                />
            </header>
        );
    }
};