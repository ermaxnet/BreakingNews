import React, { Component as ReactComponent } from "react";
import stringLocalizer from "../../../../../wwwroot/scripts/common/stringLocalizer";
import Button from "../../../../../wwwroot/scripts/components/common/Button";
import "components/NoticeComponent.scss";

class NoticeComponent extends ReactComponent {
    render() {
        return (
            <div className="NoticeComponent__container">
                <Button className="NoticeComponent__button">
                    <span>{stringLocalizer.t("buttons.button_notice")}</span>
                </Button>
            </div>
        );
    }
}

export default NoticeComponent;