import { REDUX_ACTION_TIMELINE } from "../constants";
import { Record, List } from "immutable";

const TimelineState = Record({
    connected: false,
    isActive: false,
    touches: null
});

export default (state = new TimelineState(), action) => {
    switch(action.type) {
        case REDUX_ACTION_TIMELINE.HUB_IS_ACTIVE: {
            return state.set("isActive", true);
        }
        case REDUX_ACTION_TIMELINE.HUB_IS_NOT_ACTIVE: {
            return state.set("isActive", false);
        }
        case REDUX_ACTION_TIMELINE.TRY_CONNECT_TO_HUB: {
            return state.set("connected", false);
        }
        case REDUX_ACTION_TIMELINE.CONNECT_TO_HUB_WAS_ESTABLISHED: {
            return state.set("connected", true);
        }
        case REDUX_ACTION_TIMELINE.SET_TIMELINE: {
            return state.set("touches", List(action.touches));
        }
        case REDUX_ACTION_TIMELINE.PUSH_TOUCH_TO_TIMELINE: {
            return state.update("touches", touches => {
                return touches.splice(0, 0, action.touch);
            });
        }
    }
    return state;
};