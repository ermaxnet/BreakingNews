import React, { Component as ReactComponent } from "react";
import { 
    EditorState,
    convertToRaw,
    convertFromRaw
} from "draft-js";
import Text from "./Text";
import stringLocalizer from "../../../common/stringLocalizer";
import { ARTICLE_CONTENT } from "../../../constants";
import "components/article/editor/Editor.scss";

export default class ArticleEditor extends ReactComponent {
    saveContent(editorState) {
        const contentStateJSON = JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
        );
        window.localStorage[ARTICLE_CONTENT] = contentStateJSON;
    }
    loadContent(editorState, onChange, onFocus) {
        const contentStateJSON = window.localStorage.getItem(ARTICLE_CONTENT);
        if(!contentStateJSON) {
            return;
        }
        onChange(
            EditorState.push(
                editorState, convertFromRaw(JSON.parse(contentStateJSON))
            ),
            onFocus
        );
    }
    render() {
        return (
            <div className="Editor">
                <Text 
                    ref={node => { this.editorNode = node; }}
                    placeholder={stringLocalizer.t("simple_text.placeholder")}
                    saveContent={this.saveContent}
                    loadContent={this.loadContent}
                />
            </div>
        );
    }
};