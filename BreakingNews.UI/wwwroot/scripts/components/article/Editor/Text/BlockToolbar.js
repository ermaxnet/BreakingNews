import React from "react";
import PropTypes from "prop-types";
import { RichUtils } from "draft-js";
import ToolButton from "./Buttons/ToolButton";
import getIconOptions from "../../../../common/functions/getIconOptions";
import stringLocalizer from "../../../../common/stringLocalizer";

const BlockToolbar = props => {
    const { buttons } = props;
    if(buttons.length < 1) {
        return null;
    }
    const blockType = RichUtils.getCurrentBlockType(props.editorState);
    return (
        <div className="Toolbar__BlockToolbar">
            {buttons.map(button => {
                const iconLabel = getIconOptions(button);
                return (
                    <ToolButton 
                        key={button.style}
                        {...iconLabel}
                        active={button.style === blockType}
                        onToggle={props.onToggle}
                        style={button.style}
                        description={stringLocalizer.t(button.description)}
                    />
                );
            })}
        </div>
    );
};
BlockToolbar.propTypes = {
    editorState: PropTypes.object.isRequired,
    buttons: PropTypes.array,
    onToggle: PropTypes.func
};

export default BlockToolbar;