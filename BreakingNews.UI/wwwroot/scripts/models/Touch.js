import { 
    connecting, 
    connected,
    switchActiveState,
    setTimeline,
    pushTouch
} from "../store/actions/timeline";
import store, { invokeAction } from "../store";
import * as signalR from "@aspnet/signalr";

console.log(document.location.pathname);

const connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Error)
    .withUrl("/timeline", { //document.location.pathname + "/timeline"
        transport: signalR.HttpTransportType.LongPolling
    })
    .withHubProtocol(new signalR.JsonHubProtocol())
    .build();

export const isConnected = () => {
    const state = store.getState().timeline;
    return state ? state.get("connected") : false;
};

const invoke = (...action) => {
    if(!isConnected()) {
        return Promise.reject(new Error(`Connection with timeline hub was not been establised`));
    }
    return connection.invoke.apply(connection, action);
};

export const connect = () => {
    invokeAction(connecting());
    invokeAction(switchActiveState(true));
    return connection.start()
        .then(() => {
            invokeAction(switchActiveState(false));
            invokeAction(connected());

            invoke("push", {
                id: 70,
                time: new Date(),
                text: "Многие организации уже виртуализировали вычислительные ресурсы и хранилища, но этого недостаточно для удовлетворения требований цифровой эпохи. Узнайте, как виртуализация сети помогает модернизировать ЦОД.",
                likes_count: 36,
                comments_count: 0,
                you_like_it: false,
                user: {
                    id: 5,
                    name: "Молли Хоупер",
                    photo: "https://randomuser.me/api/portraits/women/8.jpg"
                }
            });

            return true;
        })
        .catch(err => {
            invokeAction(switchActiveState(false));
            console.error(err);
        });
    //store.dispatch(getTouches());
    /* fetch("/Organization/touches/all")
        .then(response => response.json())
        .then(touches => {
            store.dispatch(setTouches(touches));
        }); */
};

connection.on("set-timeline", touches => {
    return invokeAction(setTimeline(touches));
});

connection.on("push-in-timeline", touch => {
    return invokeAction(pushTouch(touch));
});