import {
    createStore,
    combineReducers
} from "redux";
import timelineReducer from "./reducers/timeline";

const reducer = combineReducers({
    timeline: timelineReducer
});

const store = createStore(reducer);

export const invokeAction = action => {
    return store.dispatch(action);
};

export default store;