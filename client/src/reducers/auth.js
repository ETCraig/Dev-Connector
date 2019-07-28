import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    ACCOUNT_LOADED,
    LOGOUT,
    AUTH_ERR,
    DELETE_ACCOUNT
} from '../actions/Types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: false,
    account: null
}

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACCOUNT_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                account: payload
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case LOGOUT:
        case AUTH_ERR:
        case DELETE_ACCOUNT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default:
            return state
    }
}