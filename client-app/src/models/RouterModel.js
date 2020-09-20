
const PRELOAD_FROM_CLIENT = 'PRELOAD_FROM_CLIENT';
const PRELOAD_FROM_SERVER = 'PRELOAD_FROM_SERVER';
const ENTER_ROUTE = 'ENTER_ROUTE';
const STORE_HOST_INFO = 'STORE_HOST_INFO';

const CLIENT = 'client';
const SERVER = 'server';

const RouterModel = function () {
    const name = 'router';
    return {
        name,
        actionTypes: {
            PRELOAD_FROM_CLIENT,
            PRELOAD_FROM_SERVER,
            STORE_HOST_INFO,
        },
        states: {
            path: null,
            preload: CLIENT,
            host: null,
        },
        selectors: (state) => {
            const currentState = state[name];
            return {
                getHost: () => 'localhost:8080',
                getIsPreloadFromClient: () => currentState.preload === CLIENT,
                getIsPreloadFromServer: () => currentState.preload === SERVER,
                getCurrentRoutePath: () => currentState.path,
            }
        },
        actions: {
            /* 设置预加载行为来自客户端 */
            preloadFromClient: () => ({
                type: PRELOAD_FROM_CLIENT,
            }),
            /* 设置预加载行为来自服务端 */
            preloadFromServer: () => ({
                type: PRELOAD_FROM_SERVER,
            }),
            /* 设置当前进入的路由 */
            enterRoute: (path) => ({
                type: ENTER_ROUTE,
                payload: path,
            }),
            /* 保存服务端Host信息 */
            storeHostInfo: ({ protocol, host }) => ({
                type: STORE_HOST_INFO,
                payload: { protocol, host },
            }),
        },
        reducers: {
            path: (state = RouterModel.states.path, action) => {
                const { type, payload } = action;
                switch (type) {
                    case ENTER_ROUTE :
                        return payload;
                    default: 
                        return state;
                }
            },
            preload: (state = RouterModel.states.preload, action) => {
                switch (action.type) {
                    case PRELOAD_FROM_CLIENT:        	
                        return CLIENT;
                    case PRELOAD_FROM_SERVER:        	
                        return SERVER;
                    default:
                        return state;
                }
            },
            host: (state = RouterModel.states.host, action) => {
                const { type, payload } = action;
                switch (type) {
                    case STORE_HOST_INFO:
                        return `${payload.protocol}://${payload.host}`;
                    default:
                        return state;
                }
            }
        }
    }
}();

export default RouterModel;