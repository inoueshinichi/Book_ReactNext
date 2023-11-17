// Flux store
import { dispatcher } from "./dispatcher";
import { ActionType } from "./action";

// Store
export const nameStore = { name: '', onChange: null };
export const messageStore = { message: '', onChange: null };

// ActionとStoreを結びつける
dispatcher.register(payload => {
    if (payload.actionType === ActionType.CHANGE_NAME) {
        nameStore.name = payload.value;
        nameStore.onChange();
    }
});

dispatcher.register(payload => {
    if (payload.actionType === ActionType.SUBMIT_NAME) {
        messageStore.message = nameStore.name + 'さん、こんにちは';
        messageStore.onChange();
    }
});

