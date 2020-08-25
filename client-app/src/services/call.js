import { normalize } from 'normalizr';
import MessageModel from '../models/MessageModel';
const { addErrorMessage, addLoadingMessage, addSuccessMessage } = MessageModel.actions;

/**
 * 通用的API调用模板
 * @api function api 的函数
 * @params object api函数的参数对象
 * @schema src/actions/schema.js 定义的模型
 * @REQUEST 发起请求前设置的【请求中】状态【Action.type】
 * @SUCCESS 请求成功回调后设置的【成功】状态【Action.type】
 * @FAILURE 请求失败回调后设置的【失败】状态【Action.type】
 * @dispatch redux的dispatch函数
 * @getState redux的getState函数
 * @selectors redux的state选择器函数
 * @onSuccess 请求成功的回调函数
 * @nextAction 下一个action回调
 */
export default async ({ api, params = {}, schema, REQUEST, SUCCESS, FAILURE, dispatch, nextAction, onSuccess, getState = ()=>{} }) => {
    const _serializeParams = JSON.stringify(params);
    const name = `${api}`;
    const _key = `${name}_${_serializeParams}`;
    if (typeof REQUEST === 'undefined') {
        dispatch(addErrorMessage(`${name}, action type[REQUEST] undeinfed`));
        return;
    }
    if (typeof SUCCESS === 'undefined') {
        dispatch(addErrorMessage(`${name}, action type[SUCCESS] undeinfed`));
        return;
    }
    dispatch({
        type: typeof REQUEST === 'object' ? REQUEST.type : REQUEST,
        payload: _key,
    });
    let loadingMsgId;
    if (typeof REQUEST === 'object' && REQUEST.message) {
        loadingMsgId = new Date().getTime();
        dispatch(addLoadingMessage({ desc: REQUEST.message, id: loadingMsgId }));
    }
    try {
        const rawResponse = await api(params);

        // 助手断网时候回返回null
        if (rawResponse === null) {
            return;
        }
        /*
        * 请求成功回调
        */
        if (onSuccess) {
            onSuccess(rawResponse);
        }
        /*
        * 下一个action，如果是多个，传一个数组
        */
        if (nextAction) {
            if (nextAction instanceof Array) {
                for (let i = 0; i < nextAction.length; i++) {
                    nextAction[i](dispatch, getState);
                }
            } else {
                dispatch(nextAction(dispatch, getState));
            }
        }
        if (typeof rawResponse === 'object' && rawResponse['__status__'] === 'break') {
            return;
        }

        dispatch({
            type: typeof SUCCESS === 'object' ? SUCCESS.type : SUCCESS,
            payload: {
                params, // 发起API携带的参数
                raw: rawResponse, // API返回的原始数据
                normalized: schema ? normalize(rawResponse, schema) : null, // 按Schema标准化后的数据
            }
        });
        if (typeof SUCCESS === 'object' && SUCCESS.message) {
            dispatch(addSuccessMessage(SUCCESS.message, SUCCESS.duration));
        }
        return rawResponse;
    } catch (e) {
        if (typeof FAILURE === 'undefined') {
            dispatch(addErrorMessage(`${name}, action type[FAILURE] undeinfed`));
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
        // 如果不需要自己手动处理错误
        if (FAILURE.dealErrorSelf) {
            return {
                state: 'error',
                message: e.message
            };
        }
    } finally {
        if (loadingMsgId) {
            const { getLiveMessage } = MessageModel.selectors(getState());
            const liveMsg = getLiveMessage(loadingMsgId);
            liveMsg.close('close-loading');
        }
    }
};