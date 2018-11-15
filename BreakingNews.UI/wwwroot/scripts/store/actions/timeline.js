import { REDUX_ACTION_TIMELINE } from "../constants";

export const connecting = () => {
    return {
        type: REDUX_ACTION_TIMELINE.TRY_CONNECT_TO_HUB
    };
};

export const connected = () => {
    return {
        type: REDUX_ACTION_TIMELINE.CONNECT_TO_HUB_WAS_ESTABLISHED
    };
};

export const switchActiveState = (state = false) => {
    return {
        type: state 
            ? REDUX_ACTION_TIMELINE.HUB_IS_ACTIVE 
            : REDUX_ACTION_TIMELINE.HUB_IS_NOT_ACTIVE
    };
};

export const setTimeline = touches => {
    return {
        type: REDUX_ACTION_TIMELINE.SET_TIMELINE,
        touches
    };
};

export const pushTouch = touch => {
    return {
        type: REDUX_ACTION_TIMELINE.PUSH_TOUCH_TO_TIMELINE,
        touch
    };
};