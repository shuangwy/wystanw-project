import MessageModel from '../models/MessageModel';
import request from '../utils/request';
const callApi = ({ uri, method, params = {}, onSuccess, ...rest }) => async ({ dispatch, state, actions: { MessageModel: { addErrorMessage, addLoadingMessage, addSuccessMessage }}}) => {
    const { REQUEST, SUCCESS, FAILURE } = Object.values(rest)[0] 
    const _serializeParams = JSON.stringify(params);
    const name = `${uri}`;
    const _key = `${_serializeParams}`;
    dispatch({
        type: REQUEST,
        payload: _key,
    });
    let loadingMsgId;
    if (typeof REQUEST === 'object' && REQUEST.message) {
        loadingMsgId = new Date().getTime();
        dispatch(addLoadingMessage({ desc: REQUEST.message, id: loadingMsgId }));
    }
    try {
        const rawResponse = await request({ api: { uri, method }, params });
        console.log('rawResponse', rawResponse)
        if (rawResponse === null) {
            return;
        }
        if (onSuccess) {
            onSuccess(rawResponse);
        }
        if (typeof rawResponse === 'object' && rawResponse['__status__'] === 'break') {
            return;
        }
        dispatch({
            type: typeof SUCCESS === 'object' ? SUCCESS.type : SUCCESS,
            payload: {
                params, // 发起API携带的参数
                raw: rawResponse, // API返回的原始数据
            }
        });
        if (typeof SUCCESS === 'object' && SUCCESS.message) {
            dispatch(addSuccessMessage(SUCCESS.message, SUCCESS.duration));
        }
        return rawResponse;
    } catch (e) {
        if (typeof FAILURE === 'undefined') {
            dispatch(addErrorMessage(`${name}, action type[FAILURE] undefined`));
            return;
        }
        if (FAILURE.message) {
            if (FAILURE.ignoreReason) {
                dispatch(addErrorMessage(`${FAILURE.message}`));
            } else {
                dispatch(addErrorMessage(`${FAILURE.message} 原因[${e.message}]`));
            }
        } else if (!FAILURE.dealErrorSelf) { // 不需要自己手动处理错误
            dispatch(addErrorMessage(`${e.message}`));
        }
        dispatch({
            type: typeof FAILURE === 'object' ? FAILURE.type : FAILURE,
            payload: _key
        });
        if (FAILURE.dealErrorSelf) {
            return {
                state: 'error',
                message: e.message
            };
        }
    } finally {
        if (loadingMsgId) {
            const { getLiveMessage } = MessageModel.selectors(state);
            const liveMsg = getLiveMessage(loadingMsgId);
            liveMsg.close('close-loading');
        }
    }
};
export default callApi
function AsyncAction (action) {
    const actionType = action.toUpperCase().replace('/', '_')
    return {
        REQUEST: `${actionType}_REQUEST`,
        SUCCESS: `${actionType}_SUCCESS`,
        FAILURE: `${actionType}_FAILURE`
    }
}
export {
    AsyncAction
}