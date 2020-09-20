import fetch from 'isomorphic-fetch';
import * as config from '../services/config';
import { resolveUrl } from '../utils/helper';
// import authObject from './authObject';
import jscookie from 'js-cookie';
import { message } from 'antd';
const {
    isBench,
    // isKeepAccessTokenInQueryString,
    apiHost,
    headers
} = config;
const handleNotOkFunc = (resp) => {
    const { status } = resp;
    if (status == 401) {
        let originUrl = window.location.href;
        let originHost = `${window.location.protocol}//${window.location.host}`;
        window.location.href = `/admin/oa/login?RETURN_URL=${originUrl}&RETURN_HOST=${originHost}`;
    }
};
export default ({ api, params, accessToken, host, handleNotOk = handleNotOkFunc }) => {
    console.log('api', api, 'params', params)
    window.showOffLineError = window.showOffLineError === undefined ? false : window.showOffLineError;
    if (window.require && !window.navigator.onLine) {
        console.log('断网了我');
        if (!window.showOffLineError) {
            window.showOffLineError = true;
            message.error('当前网络不可用, 请检查后重试', 3, () => {window.showOffLineError = false;});
        }
        return null;
    }
    const _queryParams = { ...params }
    const _fetchParams = { 
        method: api.method, 
        redirect: 'follow' };
    _fetchParams.headers = { ...api.headers || headers };
    let url
    const _apiHost = host && typeof (host) === 'string' ? host : apiHost;
    if (api.method === 'POST') {
        url = `${_apiHost}${api.uri}`
        if (_fetchParams._static_) {
            _fetchParams.body = _fetchParams.body.params;
        } else {
            _fetchParams.body = JSON.stringify(params);
        }
    } else {
        url = resolveUrl(api.uri, _queryParams, _apiHost);
    }
    // let start;
    // if (isBench) {
    //     start = new Date().getTime();
    // }
    return fetch(url, _fetchParams)
        .then(resp => {
            const { status, headers } = resp;
            let newToken = headers.get('content-language');
            if (newToken) {
                jscookie.set('auth.token', newToken.split(',')[1]);
            }
            /* 成功 */
            if (status === 200) {
                return resp.text();
            } else if (status === 401) {
                handleNotOk(resp);
            } else {
                return resp.json();
            }
        })
        .catch(e => {
            console.log('e', e)
            throw new Error(`调用API${url}。 错误: ${e.stack}`);
        })
        .then(resp => {
            try {
                resp = JSON.parse(resp);
            } catch (e) {
                resp = { message: resp };
            }
            /* 接口报错处理 */
            if (resp.message) {
                // 服务故障接口报错处理
                if (resp.message.error) {
                    throw new Error(resp.message.error.errMessage);
                }
                // ibp错误提示处理1
                if (resp.message.errorMsg) {
                    throw new Error(resp.message.errorMsg);
                }
                // ibp错误提示处理2
                if (resp.message.errorCode && resp.message.errorCode === '404') {
                    throw new Error(resp.message.message);
                }
            }
            if (isBench) {
                // const cost = (new Date().getTime() - start);
                // console.log(`|====== Fetch(${cost}ms) ======|`);
                // console.log(`${url}`);
                // console.log("|===================|");
            }
            return resp;
        });
};
