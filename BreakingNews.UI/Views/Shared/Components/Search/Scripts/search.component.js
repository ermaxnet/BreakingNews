import React, { Component as ReactComponent } from "react";
import stringLocalizer from "../../../../../wwwroot/scripts/common/stringLocalizer";
import Icon from "../../../../../wwwroot/scripts/components/common/Icon";
import "components/SearchComponent.scss";

class SearchComponent extends ReactComponent {
    state = {
        value: ""
    }

    onChange(e) {
        this.setState({ value: e.target.value });
    }
    render() {
        return (
            <form className="SearchComponent__form">
                <input 
                    type="text"
                    name="query"
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                    className="SearchComponent__input"
                    placeholder={stringLocalizer.t("search_on_site")}
                />
                <Icon iconClass="fa-search SearchComponent__icon" />
            </form>
        );
    }
}

export default SearchComponent;