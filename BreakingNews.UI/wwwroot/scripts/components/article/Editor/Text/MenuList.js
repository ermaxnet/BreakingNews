import React from "react";
import PropTypes from "prop-types";
import MenuButton from "./Buttons/MenuButton";
import MenuImageButton from "./Buttons/MenuImageButton";
import getIconOptions from "../../../../common/functions/getIconOptions";
import stringLocalizer from "../../../../common/stringLocalizer";

const MenuList = props => {
    const { buttons } = props;
    if(buttons.length < 1) {
        return null;
    }
    return (
        <div className="Menu_MenuList">
            {buttons.map(button => {
                const iconOptions = getIconOptions(button);
                const isActive = props.toggleButtonState(button.block, button.style);
                return (
                    <MenuButton
                        key={button.style}
                        {...iconOptions}
                        style={button.style}
                        description={stringLocalizer.t(button.description)}
                        active={isActive}
                        onToggle={props.onToggle}
                        isBlock={button.block}
                    />
                );
            })}
            {props.enabledImages && (
                <MenuImageButton 
                    setEditorState={props.setEditorState}
                    getEditorState={props.getEditorState}
                >
                    <span>{stringLocalizer.t("buttons.button_images")}</span>
                </MenuImageButton>
            )}
        </div>
    );
};
MenuList.propTypes = {
    buttons: PropTypes.array,
    toggleButtonState: PropTypes.func,
    enabledImages: PropTypes.bool,
    setEditorState: PropTypes.func,
    getEditorState: PropTypes.func
};
MenuList.defaultProps = {
    buttons: []
};

export default MenuList;