import React from "react";
import PropTypes from "prop-types";
import Icon from "../../../../common/Icon";

const MenuButton = props => {
    const { active, description, style, onToggle, isBlock } = props;
    let className = `MenuButton${active ? " MenuButton--active" : ""}`;
    if(props.className) {
        className += " " + props.className;
    }
    let content = null;
    if(props.label) {
        content = props.label;
    } else if(props.icon) {
        content = <Icon iconClass={props.icon} />;
    } else {
        content = props.children;
    }
    return (
        <span
            className={className}
            aria-label={description}
            onClick={e => {
                e.preventDefault();
                onToggle(style, isBlock);
            }}
        >{content}</span>
    );
};
MenuButton.propTypes = {
    style: PropTypes.string.isRequired,
    description: PropTypes.string,
    label: PropTypes.node,
    icon: PropTypes.string,
    active: PropTypes.bool,
    onToggle: PropTypes.func,
    isBlock: PropTypes.bool
};

export default MenuButton;