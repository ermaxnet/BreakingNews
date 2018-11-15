import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import { getVisibleSelectionRect } from "draft-js";
import stringLocalizer from "../../../../common/stringLocalizer";

function getRelative(element) {
    if(!element) {
        return null;
    }
    const position = window.getComputedStyle(element).getPropertyValue("position");
    if(position !== "static") {
        return element;
    }
    return getRelative(element.parentElement);
};

export default class LinkEdit extends ReactComponent {
    static propTypes = {
        editorState: PropTypes.object.isRequired,
        link: PropTypes.string.isRequired,
        blockKey: PropTypes.string.isRequired,
        entityKey: PropTypes.string.isRequired,
        remove: PropTypes.func.isRequired,
        edit: PropTypes.func.isRequired
    }
    
    state = {
        position: {}
    };
    renderedOnce = false;

    componentDidMount() {
        setTimeout(this.calculatePosition.bind(this), 0);
    }
    componentDidUpdate() {
        setTimeout(this.calculatePosition.bind(this), 0);
    }
    shouldComponentUpdate(newProps) {
        if(this.renderedOnce) {
            const cursor = (
                this.props.blockKey !== newProps.blockKey || this.props.entityKey !== newProps.entityKey
            );
            if(cursor) {
                this.renderedOnce = false;
            }
            return cursor;
        }
        this.renderedOnce = true;
        return true;
    }
    calculatePosition() {
        if(!this.toolbarElement) {
            return;
        }
        const parent = getRelative(this.toolbarElement.parentElement);
        const boundary = parent
            ? parent.getBoundingClientRect()
            : window.document.body.getBoundingClientRect();
        const selection = getVisibleSelectionRect(window);
        if(!selection) {
            return;
        }

        const position = {
            top: (selection.top - boundary.top) + 35,
            left: (selection.left - boundary.left) + (selection.width / 2),
            transform: "translate(-50%) scale(1)"
        };
        this.setState({ position });
    }
    removeLink(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.remove(this.props.blockKey, this.props.entityKey);
    }
    editLink(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.edit(this.props.blockKey, this.props.entityKey);
    }
    render() {
        let { link } = this.props;
        if(link.length > 30) {
            link = link.slice(0, 30) + "...";
        }
        return (
            <div 
                className="Toolbar Toolbar--isOpen Toolbar__LinkEdit"
                style={this.state.position}
                ref={element => { this.toolbarElement = element; }}
            >
                <a
                    className="Toolbar__LinkEdit__Link"
                    href={this.props.link}
                    title={this.props.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >{link}</a>
                <button 
                    className="Toolbar__LinkEdit__Button Toolbar__LinkEdit--Unlink"
                    onClick={this.removeLink.bind(this)}
                >{stringLocalizer.t("buttons.button_link_undo")}</button>
                <button 
                    className="Toolbar__LinkEdit__Button Toolbar__LinkEdit--Edit"
                    onClick={this.editLink.bind(this)}
                >{stringLocalizer.t("buttons.button_link_edit")}</button>
            </div>
        );
    }
};