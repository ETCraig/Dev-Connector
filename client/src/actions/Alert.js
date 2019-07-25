import { SET_ALERT, REMOVE_ALERT } from './Types';

export const setAlert = (msg, alertType) => dispatch => {
    const id = 1;
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });
}