import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import { addNewBlock } from "../../../../../models/Editor";
import { BLOCK_STYLE } from "../../../../../constants";
import { uploadImages } from "../../../../../common/functions/uploadImages";

export default class MenuImageButton extends ReactComponent {
    static propTypes = {
        setEditorState: PropTypes.func,
        getEditorState: PropTypes.func
    }

    onClick() {
        this.inputElement.value = null;
        this.inputElement.click();
    }
    onChange(e) {
        const { setEditorState, getEditorState } = this.props;
        const files = Array.from(e.target.files).filter(file => ~file.type.indexOf("image/"));
        if(files.length > 0) {
            uploadImages(files).then(images => {
                if(images && images.length) {
                    images.length === 1
                        ? setEditorState(addNewBlock(
                            getEditorState(),
                            BLOCK_STYLE.IMAGE, { link: images[0] }
                        ))
                        : setEditorState(addNewBlock(
                            getEditorState(),
                            BLOCK_STYLE.IMAGES, { links: images }
                        ));
                }
            });
        }
    }
    render() {
        return (
            <span
                className="MenuButton MenuButton__Images"
                onClick={this.onClick.bind(this)}
            >
                {this.props.children}
                <input
                    ref={element => { this.inputElement = element; }}
                    onChange={this.onChange.bind(this)}
                    className="MenuButton__Images__Input"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                />
            </span>
        );
    }
};