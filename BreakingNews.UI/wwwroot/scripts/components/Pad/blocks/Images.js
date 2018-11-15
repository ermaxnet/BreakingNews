import React, { Component as ReactComponent } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { 
    EditorBlock, 
    EditorState, 
    SelectionState
} from "draft-js";
import { getCurrentBlock } from "../../../models/Editor";
import ImagesSlider from "../../article/images/ImagesSlider";
import { List } from "immutable";

class CompositeImagesSlider extends ImagesSlider {
    constructor(props) {
        super(props);
        
        this.state = {
            ...this.state,
            isSettingsOpen: false,
            settingsStyles: {}
        };
    }

    componentDidMount() {
        setTimeout(this.setSettingsStyles.bind(this), 0);
    }
    setSettingsStyles() {
        if(!this.stickNode) {
            return;
        }
        const nodeBoundary = ReactDOM.findDOMNode(this.stickNode).getBoundingClientRect();
        const styles = {
            width: `${nodeBoundary.width}px`,
            left: `${nodeBoundary.left}px`,
            top: `${nodeBoundary.top}px`,
            minHeight: `${nodeBoundary.height}px`
        };
        this.setState({ settingsStyles: styles });
    }
    openSettings(e) {
        e.preventDefault();
        this.setState({ isSettingsOpen: true });
    }
    getCaptionOnChange(index) {
        function updateCaption(e) {
            const value = e.target.value;
            const images = this.state.images.map(image => {
                if(image.get("key") === index) {
                    image = image.merge({
                        caption: value
                    });
                }
                return image;
            });
            this.setState({ images });
        };
        return updateCaption.bind(this);
    }
    render() {
        return (
            <div className="ImagesSlider__Wrapper" onFocus={this.props.focusBlock}>
                {super.render()}
            </div>
        );
    }
};

export default class Images extends ReactComponent {
    static propTypes = {
        block: PropTypes.object,
        blockProps: PropTypes.object
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
        setState(EditorState.forceSelection(editorState, newSelection));
    }
    render() {
        const { block, blockProps } = this.props;
        let links = block.getData().get("links");
        if(links instanceof Array) {
            links = List(links);
        }
        if(links && links.size) {
            return (
                <div className="Images">
                    <CompositeImagesSlider 
                        links={links.toJS()} 
                        focusBlock={this.focusBlock.bind(this)}
                        getEditorState={blockProps.getState}
                        setEditorState={blockProps.setState}
                        block={this.props}
                    />
                </div>
            );
        }
        return <EditorBlock {...this.props} />;
    }
};