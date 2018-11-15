import React from "react";
import PropTypes from "prop-types";
import ToolButton from "./Buttons/ToolButton";
import getIconOptions from "../../../../common/functions/getIconOptions";
import stringLocalizer from "../../../../common/stringLocalizer";

const InlineToolbar = props => {
    const { buttons } = props;
    if(buttons.length < 1) {
        return null;
    }
    const currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="Toolbar__InlineToolbar">
            {buttons.map(button => {
                const iconLabel = getIconOptions(button);
                return (
                    <ToolButton 
                        key={button.style}
                        {...iconLabel}
                        active={currentStyle.has(button.style)}
                        onToggle={props.onToggle}
                        style={button.style}
                        description={stringLocalizer.t(button.description)}
                    />
                );
            })}
        </div>
    );
};
InlineToolbar.propTypes = {
    editorState: PropTypes.object.isRequired,
    buttons: PropTypes.array,
    onToggle: PropTypes.func
};
InlineToolbar.defaultProps = {
    buttons: []
};

export default InlineToolbar;