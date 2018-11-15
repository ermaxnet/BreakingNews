import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import { 
    EditorBlock, 
    EditorState, 
    SelectionState,
    Modifier
} from "draft-js";
import { getCurrentBlock } from "../../../models/Editor";
import Image from "../../article/images/Image";

export default class ImageCont extends ReactComponent {
    static propTypes = {
        block: PropTypes.object,
        blockProps: PropTypes.object
    }

    componentDidMount() {
        setTimeout(this.addImageCaption.bind(this), 0);
    }
    focusBlock() {
        const { block, blockProps } = this.props;
        const { setState, getState } = blockProps;
        const key = block.getKey();
        const editorState = getState();
        const currentBlock = getCurrentBlock(editorState);
        if(currentBlock.getKey() === key) {
            return;
        }
        const newSelection = new SelectionState({
            anchorKey: key,
            focusKey: key,
            anchorOffset: 0,
            focusOffset: 0
        });
    }
    render() {
        const { block } = this.props;
        const data = block.getData();
        let link = data.get("link");
        if(link) {
            return (
                <>
                    <div className="Images" onClick={this.focusBlock.bind(this)}>
                        <Image link={link} imageCaption={data.get("caption")} />
                    </div>
                    <figcaption className="ImageCaption">
                        <EditorBlock {...this.props} />
                    </figcaption>
                </>
            );
        }
        return <EditorBlock {...this.props} />;
    }
};