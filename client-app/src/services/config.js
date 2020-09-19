let isDev = true;
const isKeepAccessTokenInQueryString = false;
const isServerRender = false;
const isLog = false;
let isBench = true;
const serverPort = 8080;
const serverHostName = 'localhost';
const apiHost = 'http://localhost:8080';
if (process.env.NODE_ENV === 'production') {
    isDev = false;
    isBench = false;
}
const headers = {
    // 'Content-type': 'application:/x-www-form-urlencoded:charset=UTF-8',
    'Content-type': 'application/json'
}
export {
    isDev,
    isKeepAccessTokenInQueryString,
    isServerRender,
    isLog,
    isBench,
    serverPort,
    serverHostName,
    apiHost,
    headers
};
