import fetch from 'isomorphic-fetch';
import * as config from '../services/config';
import { resolveUrl } from '../utils/helper';
import authObject from './authObject';
import jscookie from 'js-cookie';
import { message } from 'antd';

const {
    isLogAPI,
    isBench,
    isKeepAccessTokenInQueryString,
    apiHost,
} = config;
const handleNotOkFunc = (resp)=>{
    const { status } = resp;
    if (status == 401) {// 根据业务做相应处理
        let originUrl = window.location.href;
        let originHost = `${window.location.protocol}//${window.location.host}`;
        /* 老oa登录逻辑开始 */
        window.location.href = `/admin/oa/login?RETURN_URL=${originUrl}&RETURN_HOST=${originHost}`;
    }
};


export default ({ uri, queryParams, fetchParams, accessToken, host, handleNotOk = handleNotOkFunc }) => {
    window.showOffLineError = window.showOffLineError === undefined ? false : window.showOffLineError;
    if (window.require && !window.navigator.onLine) {
        console.log('断网了我');
        if (!window.showOffLineError) {
            window.showOffLineError = true;
            message.error('当前网络不可用, 请检查后重试', 3, () => {window.showOffLineError = false;});
        }
        return null;
    }
    const _queryParams = { ...queryParams }
    const _fetchParams = { ...fetchParams, redirect: 'error' };
    _fetchParams.headers = _fetchParams.headers || {};
    const keyArray = Object.keys(authObject());
    if (keyArray.length > 0) {
        keyArray.forEach(key => {
            // if (authObject()[key]) {
            _fetchParams.headers[key] = authObject()[key];
            // }
        });
    }


    /* _static_为true表示是上传文件，如果是上传文件则不能这么stringify */
    if (typeof _fetchParams.body === 'object') {
        if (_fetchParams._static_) {
            _fetchParams.body = _fetchParams.body.params;
        } else {
            _fetchParams.body = JSON.stringify(_fetchParams.body);
        }
    }

   
    _fetchParams.credentials = undefined;
    if (isKeepAccessTokenInQueryString && typeof (accessToken) === 'object') {
        _queryParams[accessToken.name] = accessToken.value;
    }
    let _apiHost = typeof (host) === 'string' ? host : apiHost;
    // let _apiHost = `//${window.location.host}`;
    if (host) {
        _apiHost = host;
    }
    const url = resolveUrl(uri, _queryParams, _apiHost);
    if (isLogAPI) {
        // console.log(url);
    }
    let start;
    if (isBench) {
        start = new Date().getTime();
    }
    return fetch(url, _fetchParams)
        .then(resp => {
            const { status, headers } = resp;
            // 返回新token时 重新设置
            let newToken = headers.get('content-language');
            if (newToken) {
                jscookie.set('auth.token', newToken.split(',')[1]);
            }
            /* 成功 */
            if (status === 200) {
                return resp.text();
            } else if (status === 401) {
                /* 约定401为未登录 */
                handleNotOk(resp);
            } else {
                /* 这里处理的应该就是404 500 666之类的错误了 */
                return resp.json();
            }
        })
        .catch(e => {
            throw new Error(`调用API[${url}]。 错误: ${e.stack}`);
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
                if (resp.message.errcode && resp.message.errcode === '404') {
                    throw new Error(resp.message.message);
                }
            }
            /* 这个应该没用了 */
            if (typeof (resp) === 'string') {
                throw new Error(`${resp}`);
            }
            if (isBench) {
                const cost = (new Date().getTime() - start);
                // console.log(`|====== Fetch(${cost}ms) ======|`);
                // console.log(`${url}`);
                // console.log("|===================|");
            }
            return resp;
        });
};
