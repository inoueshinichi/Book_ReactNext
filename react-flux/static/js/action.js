// Flux action
import { dispatcher } from "./dispatcher";

// Action
export const ActionType = {
    CHANGE_NAME: 'CHANGE_NAME',
    SUBMIT_NAME: 'SUBMIT_NAME'
};

// Actionの生成・・・Dispatcherに情報を投げる
export const Actions = {
    changeName: (name) => {
        dispatcher.dispatch({
            actionType: ActionType.CHANGE_NAME,
            value: name
        });
    },
    submitName: () => {
        dispatcher.dispatch({
            actionType: ActionType.SUBMIT_NAME
        });
    }
};

