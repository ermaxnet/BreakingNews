import { ADDONS } from "../constants";
import { List } from "immutable";

export class Addon {
    constructor(type) {
        this.type = type;
    }
};

export class Photos extends Addon {
    constructor() {
        super(ADDONS.PHOTOS);
        this.photos = [];
    }
    add(photo) {
        this.photos.push(photo);
    }
};

export class QuizOption {
    constructor(isRequired = true) {
        this.text = "";
        this.isRequired = isRequired;
    }
};

let _options = List();

export class Quiz extends Addon {
    static composer() {
        let quiz = new Quiz();
        return quiz
            .add(new QuizOption())
            .add(new QuizOption());
    }

    get options() {
        return _options.filter(
            option => (option instanceof QuizOption)
        ).toArray();
    }
    get goodQuiz() {
        return (
            this.options 
            && this.options.length >= 2 
            && this.options.filter(option => option.isRequired && !option.text).length === 0
        );
    }

    constructor(options = [], days = 1) {
        super(ADDONS.QUIZ);
        _options = List(options);
        this.days = days;
    }

    add(option) {
        if(option instanceof QuizOption) {
            const options = _options.push(option);
            return this.updateOptions(options);
        }
        return this;
    }
    remove(index) {
        if(_options.size > index) {
            const options = _options.splice(index, 1);
            return this.updateOptions(options);
        }
        return this;
    }
    updateOptions(options) {
        return new Quiz(options, this.days);
    }
    changeTerm(days) {
        return new Quiz(this.options, days);
    }
};

export const addonFactory = type => {
    switch(type) {
        case ADDONS.QUIZ:
            return new Quiz();
        case ADDONS.PHOTOS:
            return new Photos();
    }
    return null;
};