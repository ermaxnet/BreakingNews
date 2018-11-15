import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import Icon from "../../common/Icon";
import { ADDONS } from "../../../constants";
import { Addon, Quiz, QuizOption } from "../../../models/Addon";
import stringLocalizer from "../../../common/stringLocalizer";

export class QuizAddonButton extends ReactComponent {
    static propTypes = {
        type: PropTypes.string,
        state: PropTypes.instanceOf(Addon),
        onChange: PropTypes.func.isRequired
    }
    static defaultProps = {
        type: ADDONS.QUIZ
    }

    get isDisabled() {
        return (this.props.state && this.props.state.type !== this.props.type);
    }
    get className() {
        let className = "quiz-addon";
        if(this.isDisabled) {
            className += " quiz-addon--disabled";
        }
        if(this.props.state && this.props.state.type === this.props.type) {
            className += " quiz-addon--enabled";
        }
        return className;
    }

    onChange(e) {
        e.preventDefault();
        const state = this.props.state ? null : Quiz.composer();
        this.props.onChange(state);
    }
    render() {
        return (
            <div className={this.className}>
                <button 
                    className="quiz-addon__button"
                    aria-hidden="true"
                    disabled={this.isDisabled}
                    onClick={this.onChange.bind(this)}
                >
                    <Icon 
                        family="far"
                        iconClass="fa-chart-bar" 
                    />
                </button>
            </div>
        );
    }
};

class QuizOptionItem extends ReactComponent {
    static propTypes = {
        option: PropTypes.instanceOf(QuizOption).isRequired,
        index: PropTypes.number.isRequired,
        last: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired
    }
    static defaultProps = {
        last: false
    }

    
    onRemove(e) {
        this.props.onRemove(
            e, this.props.index
        );
    }
    render() {
        const { 
            index, 
            option, 
            onChange, 
            last
        } = this.props;
        const number = index + 1;
        const name = `${index}`;
        let placeholder = stringLocalizer.t("Variant") + " " + number;
        if(!option.isRequired) {
            placeholder += ` (${stringLocalizer.t("optional")})`;
        }
        return (
            <div 
                className={`quiz-option quiz-option-${number}${last ? " quiz-option--last" : ""}`}
                data-option-index={index}
            >
                <div className="quiz-option__radio"></div>
                <input
                    type="text"
                    name={`${name}.text`}
                    className="quiz-option__input"
                    placeholder={placeholder}
                    value={option.text}
                    onChange={onChange}
                />
                {(!option.isRequired) && (
                    <button 
                        type="button"
                        className="quiz-option__remove"
                        onClick={this.onRemove.bind(this)}
                        tabIndex={-1}
                    >
                        <Icon iconClass="fa-times" />
                    </button>
                )}
            </div>
        );
    }
};

class QuizTerm extends ReactComponent {
    static propTypes = {
        days: PropTypes.number,
        onChange: PropTypes.func.isRequired
    }
    static defaultProps = {
        days: 1
    }

    state = {
        editable: false
    }

    onClick(e) {
        e.preventDefault();
        this.setState({ editable: true });
    }
    onChange(e) {
        const days = +e.target.value;
        this.setState({ editable: false }, () => {
            return this.props.onChange(days);
        });
    }
    render() {
        if(this.state.editable) {
            const options = [];
            for (let idx = 1; idx <= 7; idx++) {
                options.push(
                    <option 
                        key={idx}
                        value={idx}
                        label={idx}
                    />
                );
            }
            return (
                <>
                    <select 
                        className="quiz-days"
                        name="days"
                        value={this.props.days}
                        onChange={this.onChange.bind(this)}
                    >
                        {options}
                    </select>
                    <span className="label">
                        {stringLocalizer.t("day", { count: this.props.days })}
                    </span>
                </>
            );
        }
        return (
            <button
                type="button"
                className="quiz-button quiz-button--term"
                onClick={this.onClick.bind(this)}
            >
                {this.props.days}&nbsp;
                {stringLocalizer.t("day", { count: this.props.days })}
            </button>
        );
    }
};

class QuizAddon extends ReactComponent {
    static propTypes = {
        model: PropTypes.instanceOf(Quiz).isRequired,
        onChange: PropTypes.func.isRequired,
        maxSize: PropTypes.number
    }
    static defaultProps = {
        maxSize: 2
    }

    onChangeOption(e) {
        const key = e.target.name;
        let [ index, name ] = key.split(".");
        const { model } = this.props;
        const options = model.options;
        options[+index][name] = e.target.value;
        const quiz = model.updateOptions(options);
        this.props.onChange(quiz);
    } 
    onAddOptions(e) {
        e.preventDefault();
        const { model } = this.props;
        const quiz = model.add(new QuizOption(false));
        this.props.onChange(quiz);
    }
    onRemoveOptions(e, index) {
        e.preventDefault();
        const { model } = this.props;
        const quiz = model.remove(index);
        this.props.onChange(quiz);
    }
    onRemove(e) {
        e.preventDefault();
        this.props.onChange(null);
    }
    onChangeTerm(days) {
        const { model } = this.props;
        const quiz = model.changeTerm(days);
        this.props.onChange(quiz);
    }
    render() {
        const { model, maxSize } = this.props;
        return (
            <div className="quiz-composer">
                <div className="container">
                    {model.options.map((option, index) =>
                        <QuizOptionItem 
                            key={index}
                            option={option}
                            index={index}
                            last={index === (maxSize - 1)}
                            onChange={this.onChangeOption.bind(this)}
                            onRemove={this.onRemoveOptions.bind(this)}
                        />
                    )}
                    {(model.options.length < maxSize) && (
                        <button 
                            role="button"
                            className="quiz-button"
                            onClick={this.onAddOptions.bind(this)}
                        >
                            &#43;&nbsp;{stringLocalizer.t("Add variant")}
                        </button>
                    )}
                    <div className="quiz-term">
                        <span className="label">
                            {stringLocalizer.t("Quiz duration")}&nbsp;
                        </span>
                        <QuizTerm
                            days={model.days}
                            onChange={this.onChangeTerm.bind(this)}
                        />
                    </div>
                    <button
                        role="button"
                        className="quiz-button quiz-button--remove"
                        onClick={this.onRemove.bind(this)}
                    >
                        {stringLocalizer.t("Remove quiz")}
                    </button>
                </div>
            </div>
        );
    }
};

export default QuizAddon;