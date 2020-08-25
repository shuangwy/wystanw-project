import callApi from '../services/call';
import { cookie } from '../utils/helper';
import request from '../utils/request';
import RouterModel from './RouterModel';

const KEEP_ACCESS_TOKEN = 'KEEP_ACCESS_TOKEN';
const KEEP_LOGIN_USER = 'KEEP_LOGIN_USER';
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';
const REMOVE_ACCESS_TOKEN = 'REMOVE_ACCESS_TOKEN';
const REMOVE_LOGIN_USER = 'REMOVE_LOGIN_USER';
const REMOVE_IS_LOGIN_SUCCESS = 'REMOVE_IS_LOGIN_SUCCESS';

const SessionModel = function () {
    const name = 'session';
    return {
        name,
        actionTypes: {
            KEEP_ACCESS_TOKEN,
            KEEP_LOGIN_USER,
            LOGIN_REQUEST,
            LOGIN_SUCCESS,
            LOGIN_FAILURE,
            LOGOUT
        },
        state: {
            accessToken: {},
            loginUser: {},
            isLoginSuccess: false,
            isLoginFetching: false,
        },
        selectors: (state) => {
            const currentState = state[name];
            return {
                getLoginUser: () => currentState.loginUser,
                getIsLoginSuccess: () => currentState.isLoginSuccess,
                getIsLoginFetching: () => currentState.isLoginFetching,
                getAccessToken: () => currentState.accessToken,
            };
        },
        api: {
            /* 登录API */
            login: ({ loginName, loginPwd, host }) => request({
                uri: '/demo/users/sessions',
                queryParams: {
                    json: {
                        loginName,
                        loginPwd
                    }
                },
                fetchParams: {
                    method: "POST",
                    headers: {
                        'Content-type': 'application:/x-www-form-urlencoded:charset=UTF-8'
                    }
                },
                host
            }),
        },
        actions: {
            /* 登录 */
            login: ({ loginName, loginPwd }) => (dispatch, getState) => {
                const host = RouterModel.selectors(getState()).getHost();
                return callApi({
                    api: SessionModel.api.login,
                    params: { loginName, loginPwd, host },
                    REQUEST: LOGIN_REQUEST,
                    SUCCESS: LOGIN_SUCCESS,
                    FAILURE: LOGIN_FAILURE,
                    dispatch
                });
            },
            /* 保存认证信息 */
            keepAccessToken: ({ accessToken }) => ({
                type: KEEP_ACCESS_TOKEN,
                payload: accessToken
            }),
            removeAccessToken: () => ({
                type: REMOVE_ACCESS_TOKEN
            }),
            /* 保存登录用户信息 */
            keepLoginUser: ({ loginUser }) => ({
                type: KEEP_LOGIN_USER,
                payload: loginUser
            }),
            removeLoginUser: () => ({
                type: REMOVE_LOGIN_USER
            }),
            /* 设置登录成功标识 */
            loginSuccess: () => ({
                type: LOGIN_SUCCESS
            }),
            removeIsLoginSuccess: () => ({
                type: REMOVE_IS_LOGIN_SUCCESS
            }),
            /* 退出登录 */
            logout: () => ({
                type: LOGOUT,
            })
        },
        reducers: {
            accessToken: (state = SessionModel.state.accessToken, action) => {
                const { type, payload } = action;
                const accessToken = payload;
                switch (type) {
                    case KEEP_ACCESS_TOKEN:
                        return {
                            ...state,
                            ...accessToken
                        };
                    case LOGOUT:
                    case REMOVE_ACCESS_TOKEN:
                        return {};
                    default:
                        return state;
                }
            },
            loginUser: (state = SessionModel.state.loginUser, action) => {
                const { type, payload } = action;
                const loginUser = payload;
                switch (type) {
                    case KEEP_LOGIN_USER:
                        return { ...state, ...loginUser };
                    case LOGOUT:
                    case REMOVE_LOGIN_USER:
                        return {};
                    default:
                        return state;
                }
            },
            isLoginSuccess: (state = SessionModel.state.isLoginSuccess, action) => {
                switch (action.type) {
                    case LOGIN_SUCCESS:
                        return true;
                    case LOGOUT:
                        cookie.clear();
                        return false;
                    case REMOVE_IS_LOGIN_SUCCESS:
                        return false;
                    default:
                        return state;
                }
            },
            isLoginFetching: (state = SessionModel.state.isLoginFetching, action) => {
                switch (action.type) {
                    case LOGIN_REQUEST:
                        return true;
                    case LOGIN_SUCCESS:
                    case LOGIN_FAILURE:
                        return false;
                    default:
                        return state;
                }
            }
        }
    };
}();

export default SessionModel;