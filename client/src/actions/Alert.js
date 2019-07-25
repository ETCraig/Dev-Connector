// import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './Types';

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
      const id = 5
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};