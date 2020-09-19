import jscookie from 'js-cookie';

export const decodeHTML = (encodeHTML = '') => {
    return encodeHTML
        .replace(/&amp;/ig, '&')
        .replace(/&nbsp;/ig, ' ')
        .replace(/&lt;/ig, '<')
        .replace(/&gt;/ig, '>')
        .replace(/&quot;/ig, '"')
        .replace(/&apos;/ig, '\''); // 转换字符串中的"'"符号
};

export const isEmptyData = (obj) => {
    if (obj === undefined || obj === null || obj === '')
        return true;
    for (let item in obj) {
        return false;
    }
    if (typeof obj === 'number')
        return false;
    return true;
};

export const getDateTimeString = (dateInt) => {
    let date = new Date(dateInt);
    return date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds();
};

export const getDateString = (dateInt) => {
    let date = new Date(dateInt);
    return date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate();
};

export const joinRouteTitles = (matchResults) => {
    let title;
    const lastOne = matchResults[matchResults.length - 1];
    if (lastOne.route.title) {
        const titles = [];
        for (let i = matchResults.length - 1; i >= 0; i--) {
            const r = matchResults[i];
            if (r.route.title) {
                titles.push(r.route.title);
            }
        }
        title = titles.join('-');
    }
    return title;
};

export const cookie = function () {
    if (typeof (document) === 'undefined') {
        return { clear: () => {}, remove: () => {}, add: () => {}, };
    }
    const _cookie = {
        clear: () => {
            let keys = Object.keys(jscookie.get());
            keys.forEach(key => jscookie.remove(key));
        },
        remove: name => {
            jscookie.remove(name);
        },
        add: (name, value) => {
            if (name) {
                jscookie.set(name, value);
            }
        }
    };
    return _cookie;
}();

/* UUID 另一种方法 */
export const uuid = function () {
    let uuid = '';
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    uuid = S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
    return uuid;
};

export const toUpperCaseFirst = function (str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
};

export const toLowerCaseFirst = function (str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
};

/*
    将后端扁平数据转化为树形数据
    data:后端返回数据
    key： 一般是每个data的id字段名，默认是id
    parentKey：子数据对应的父数据的id的字段名，默认是pId
*/
export const transformNormalDataToTreeData = (data, key, parentKey) => {
    /* 添加children */
    const nodeChildren = (node, newChildren) => {
        if (!node) {
            return null;
        }
        let key = 'children';
        if (typeof newChildren !== 'undefined') {
            node[key] = newChildren;
        }
        return node[key];
    };
    /*  */
    key = key || 'id';
    parentKey = parentKey || 'pId';
    let r = [];
    let tmpMap = {};
    for (let i = 0, l = data.length; i < l; i++) {
        tmpMap[data[i][key]] = data[i];
    }
    for (let i = 0, l = data.length; i < l; i++) {
        let p = tmpMap[data[i][parentKey]];
        if (p && data[i][key] != data[i][parentKey]) {
            let children = nodeChildren(p);
            if (!children) {
                children = nodeChildren(p, []);
            }
            children.push(data[i]);
        } else {
            r.push(data[i]);
        }
    }
    return r;
};
/*
    专门对菜单权限数据的转换

*/
export const transformAuthMenuList = (json) => {
    const reducer = array => {
        if (Object.prototype.toString.call(array) !== '[object Array]') {
            return null;
        }
        const result = {};
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            result[item.function.functionType] = {
                title: item.function.functionName,
                name: item.function.functionType,
                id: item.function.functionId,
                notes: item.function.functionNotes,
                functionUrl: item.function.functionUrl,
                children: item.subFunctions && reducer(item.subFunctions)
            };
        }
        return result;
    };
    return reducer(json);
};
/*
    转换千分位
    ----------2018-10-19弃用，原生的方法就能实现
*/
export const formatNumber = (num) => {
    if (!num) {
        return num;
    }
    if (isNaN(num)) {
        return '';
    }
    // eslint-disable-next-line no-useless-escape
    var groups = (/([\-\+]?)(\d*)(\.\d+)?/g).exec('' + num),
        mask = groups[1], //符号位
        integers = (groups[2] || '').split(''), //整数部分
        decimal = groups[3] || '', //小数部分
        remain = integers.length % 3;

    var temp = integers.reduce(function (previousValue, currentValue, index) {
        if (index + 1 === remain || (index + 1 - remain) % 3 === 0) {
            return previousValue + currentValue + ',';
        } else {
            return previousValue + currentValue;
        }
    }, '').replace(/\\,$/g, '');
    return mask + temp + decimal;
};

/* 彻底冻结对象的方法 */
export const constantize = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key, i) => {
        if (typeof obj[key] === 'object') {
            constantize(obj[key]);
        }
    });
};
const resolveUrl = (uri, params, host) => {
    let url = `${host}${uri}`;
    let query = '';
    Object.keys(params).forEach(key => {
        const val = typeof (params[key]) === 'object' ?
            JSON.stringify(params[key]) : params[key];
        if (query.length > 0) {
            query += '&';
        }
        query += `${key}=${val}`;
    });
    return encodeURI(`${url}?${query}`);
};

export {
    resolveUrl
}