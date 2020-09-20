import SessionModel from './SessionModel';
const ADD_MESSAGE = 'ADD_MESSAGE';
const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
const liveMessages = {};
const MessageModel = function () {
    const name = 'MessageModel';
    return {
        name,
        actionTypes: {
            ADD_MESSAGE,
            REMOVE_MESSAGE
        },
        states: {
            byId: {},
            ids: [],
        },
        selectors: (state = {}) => {
            const currentState = state[name];
            return {
                getMessages: () => currentState.ids.map(id => currentState.byId[id]),
                getMessage: (id) => currentState.byId[id],
                getLiveMessage: (id) => liveMessages[id],
            };
        },
        actions: {
            addMessage: (message) => ({ dispatch }) => {
                console.log('dispatch123', dispatch)
                const id = message.id || new Date().getTime();
                const msg = {
                    ...message,
                    id,
                    close: (closeType) => {
                        dispatch(MessageModel.actions.removeMessage(id));
                        if (closeType) {
                            if (typeof (msg.onClose) === 'function') {
                                msg.onClose(closeType);
                            }
                            delete liveMessages[id];
                        } else {
                            if (msg.duration && msg.duration > 0) {
                                delete liveMessages[id];
                            }
                        }
                    }
                };
                liveMessages[id] = msg;
                console.log('dispatch', dispatch)
                // dispatch({
                //     type: ADD_MESSAGE,
                //     payload: msg
                // });
            },
            /* 产生一个成功消息提示 */
            addSuccessMessage: (desc, duration = 2, title = '成功') =>
                MessageModel.actions.addMessage({
                    type: 'success',
                    title,
                    duration,
                    desc
                }),
            /* 产生一个失败消息提示 */
            addErrorMessage: (desc, duration = 2, title = '错误') =>

                MessageModel.actions.addMessage({
                    type: 'error',
                    title,
                    duration,
                    desc
                }),
            /* 产生一个警告消息提示 */
            addWarningMessage: (desc, duration = 2, title = '警告') =>
                MessageModel.actions.addMessage({
                    type: 'warning',
                    title,
                    duration,
                    desc
                }),
            /* 产生一个普通消息提示 */
            addInfoMessage: (desc, duration = 2, title = '消息') =>
                MessageModel.actions.addMessage({
                    type: 'info',
                    title,
                    duration,
                    desc
                }),
            /* 产生一个加载中消息提示 */
            addLoadingMessage: (payload) => {
                let id;
                let desc = payload;
                let title = '加载';
                if (typeof payload === 'object') {
                    id = payload.id;
                    desc = payload.desc;
                    title = payload.title || title;
                }
                return MessageModel.actions.addMessage({
                    id,
                    type: 'loading',
                    title,
                    duration: 0,
                    desc,
                });
            },
            /* 移除一个消息 */
            removeMessage: (id) => ({
                type: REMOVE_MESSAGE,
                payload: id
            }),
            /* 产生一个文件下载消息 */
            downloadFile: ({ fileId, downloadUrl }) => (dispatch, getState) => {
                if (typeof (downloadUrl) === 'undefined') {
                    dispatch(MessageModel.actions.addWarningMessage('缺少下载链接'));
                    return;
                }

                if (typeof (fileId) === 'undefined') {
                    dispatch(MessageModel.actions.addWarningMessage('缺少文件ID'));
                    return;
                }

                const accessToken = SessionModel.selectors(getState()).getAccessToken();
                const url = new URL(downloadUrl);
                url.searchParams.append(accessToken.name, accessToken.value);

                dispatch(MessageModel.actions.addMessage({
                    type: 'download',
                    fileId,
                    url: url.href,
                    title: '下载文件',
                }));
            },
            addConfirmMessage: ({ content, onClose }) =>
                MessageModel.actions.addMessage({
                    type: 'confirm',
                    content,
                    onClose,
                }),
        },
        reducers: {
            byId: (state = MessageModel.states.byId, action) => {
                const { type, payload } = action;
                switch (type) {
                    case ADD_MESSAGE:
                        return {
                            ...state,
                            [payload.id]: payload
                        };
                    case REMOVE_MESSAGE:
                        return Object.keys(state)
                            .filter(id => id !== payload)
                            .map(id => state[id]);
                    default:
                        return state;
                }
            },
            ids: (state = MessageModel.states.ids, action) => {
                const { type, payload } = action;
                switch (type) {
                    case ADD_MESSAGE:
                        return [
                            ...state, payload.id
                        ];
                    case REMOVE_MESSAGE:
                        return state.filter(msg => msg.id !== payload);
                    default :
                        return state;
                }
            }
        }
    };
}();

export default MessageModel;