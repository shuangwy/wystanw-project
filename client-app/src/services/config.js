let isDev = true;
let isKeepAccessTokenInQueryString = false;// 一般为false，特殊情况，比如跨域请设置为true
let isServerRender = false;
let isLog = false;
let isLogAPI = false;
let isBench = true;
let serverPort = 8080;// 默认即可，不用修改，除非端口被占用。生产模式请按照网络权限指定端口
let serverHostName = 'localhost';// Node服务端主机名（IP或域名）
let apiHost = 'http://localhost:8080';// api调用的远端主机地址。
if (process.env.NODE_ENV === 'production') {
    isDev = false;
    isBench = false;// 是否开启性能统计，生产模式请设置为false
}
export {
    isDev,
    isKeepAccessTokenInQueryString,
    isServerRender,
    isLog,
    isLogAPI,
    isBench,
    serverPort,
    serverHostName,
    apiHost
};
