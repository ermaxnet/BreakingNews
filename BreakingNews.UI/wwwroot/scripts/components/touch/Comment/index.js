import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import Avatar from "../../user/Avatar";
import { 
    EditorState,
    SelectionState,
    RichUtils
} from "draft-js";
import Pad from "../../Pad";
import PhotosAddon, { PhotosAddonButton } from "../Addons/PhotosAddon";
import QuizAddon, { QuizAddonButton } from "../Addons/QuizAddon";
import { ADDONS, INLINE_STYLE } from "../../../constants";
import Button from "../../common/Button";
import CharactersCounter from "../../common/CharactersCounter";
import stringLocalizer from "../../../common/stringLocalizer";

class Comment extends ReactComponent {
    static propTypes = {
        useImages: PropTypes.bool,
        useQuiz: PropTypes.bool,
        useEmoji: PropTypes.bool,
        placeholder: PropTypes.string,
        charsCount: PropTypes.number
    }
    static defaultProps = {
        charsCount: 280
    }

    state = {
        focused: false,
        filled: false,
        pad: EditorState.createEmpty(),
        addon: null
    }

    get isFilled() {
        return this.state.filled || this.hasAddon;
    }
    get addonFilled() {
        return !this.hasAddon
            || this.state.addon.type === ADDONS.PHOTOS
            || (
                this.state.addon.type === ADDONS.QUIZ
                && this.state.filled
                && this.state.addon.goodQuiz
            );
    }
    get isFocused() {
        return this.state.focused;
    }
    get useAddons() {
        return this.props.useImages || this.props.useQuiz;
    }
    get hasAddon() {
        return !!(this.state.addon);
    }
    get formClassName() {
        let className = "Comment__Form";
        if(this.isFocused) {
            className += " Comment__Form--focused";
        }
        if(this.isFilled) {
            className += " Comment__Form--filled";
        }
        return className;
    }
    get contentCount() {
        const { pad } = this.state;
        const contentState = pad.getCurrentContent();
        const text = contentState.getPlainText();
        return text.length;
    }

    constructor(props) {
        super(props);

        this.onSwitchExpan = this.switchExpan.bind(this);
    }
    componentDidMount() {
        document.addEventListener("mousedown", this.onSwitchExpan);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.onSwitchExpan);
    }

    switchExpan(e) {
        let { focused } = this.state;
        const isOutside = this.commentRef && !this.commentRef.contains(e.target);
        if((focused && isOutside) || (!focused && !isOutside)) {
            focused = !focused;
        }
        this.setState({ focused });
    }
    onChange(editorState, done = null) {
        this.setState({ pad: editorState }, () => {
            let { filled } = this.state;
            const hasContent = this.editorRef.hasContent();
            if((filled && !hasContent) || (!filled && hasContent)) {
                this.setState({ filled: !filled }, () => {
                    if(typeof done === "function") {
                        done();
                    }
                });
            }
        });
    }
    onChangeAddon(addon, done = null) {
        this.setState({ addon }, () => {
            if(typeof done === "function") {
                done();
            }
        });
    }
    onSend() {
        const text = this.editorRef.toHTML();
        console.log(text);
    }

    render() {
        return (
            <div 
                className="Comment"
                ref={node => { this.commentRef = node; }}
            >
                <Avatar className="Comment__UserAvatar" />
                <form 
                    className={this.formClassName}
                    encType="multipart/form-data"
                    method="post"
                >
                    <div className={`Comment__Content${this.hasAddon ? " Comment__Content--addon" : ""}`}>
                        <div className="container">
                            <Pad 
                                ref={node => { this.editorRef = node; }}
                                commentPad={true}
                                state={this.state.pad}
                                readOnly={false}
                                placeholder={this.props.placeholder}

                                onChange={this.onChange.bind(this)}
                                useDangerText={true}
                                maxCount={this.props.charsCount}
                            />
                            {(this.isFilled || this.isFocused) && (
                                <CharactersCounter 
                                    count={this.contentCount}
                                    maxCount={this.props.charsCount}
                                />
                            )}
                        </div>
                        {this.hasAddon && (
                            <div className="Comment__Addon">
                                {this.state.addon.type === ADDONS.PHOTOS && (
                                    <PhotosAddon 
                                        model={this.state.addon} 
                                        onChange={this.onChangeAddon.bind(this)}
                                    />
                                )}
                                {this.state.addon.type === ADDONS.QUIZ && (
                                    <QuizAddon 
                                        model={this.state.addon} 
                                        onChange={this.onChangeAddon.bind(this)}
                                        maxSize={4}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    {(this.isFilled || this.isFocused) && (
                        <div className="Comment__Toolbar">
                            {this.useAddons && (
                                <div className="Comment__Toolbar__Addons">
                                    {this.props.useImages && (
                                        <span
                                            className="Addon"
                                        >
                                            <PhotosAddonButton 
                                                type={ADDONS.PHOTOS}
                                                state={this.state.addon}
                                                onChange={this.onChangeAddon.bind(this)}
                                            />
                                        </span>
                                    )}
                                    {this.props.useImages && (
                                        <span
                                            className="Addon"
                                        >
                                            <QuizAddonButton
                                                type={ADDONS.QUIZ}
                                                state={this.state.addon}
                                                onChange={this.onChangeAddon.bind(this)}
                                            />
                                        </span>
                                    )}
                                </div>
                            )}
                            <div className="Comment__Toolbar__Button">
                                <Button 
                                    className="TouchButton"
                                    disabled={!(this.isFilled && this.addonFilled)}
                                    onClick={this.onSend.bind(this)}
                                >
                                    <span>{stringLocalizer.t("buttons.button_notice")}</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        );
    }
};

export default Comment;