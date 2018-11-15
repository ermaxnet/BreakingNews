import React, { Component as ReactComponent } from "react";
import Icon from "../../../../common/Icon";
import { INLINE_STYLE } from "../../../../../constants";

export default class ToolButton extends ReactComponent {
    onToggle(e) {
        e.preventDefault();
        this.props.onToggle(this.props.style);
    }
    render() {
        if(this.props.style === INLINE_STYLE.HYPERLINK) {
            return null;
        }
        let className = "Toolbar__Button";
        if(this.props.active) {
            className += " Toolbar__Button--active";
        }
        className += ` Toolbar__Button_${this.props.style.toLowerCase()}`;
        return (
            <span
                className={className}
                onMouseDown={this.onToggle.bind(this)}
                aria-label={this.props.description}
            >
                {this.props.icon
                    ? (
                        <Icon iconClass={this.props.icon} />
                    )
                    : this.props.label
                }
            </span>
        )
    }
}