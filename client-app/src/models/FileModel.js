import { schema } from 'normalizr';
import SessionModel from './SessionModel';
import RouterModel from './RouterModel';
import BannerModel from './BannerModel';
import MessageModel from './MessageModel';
const {
    addWarningMessage,
    addMessage,
} = MessageModel.actions;

const FileModel = function () {
    const name = 'files';
    const object = new schema.Entity(name);
    const array = new schema.Array(object);
    return {
        name,
        schema: {
            object,
            array
        },
        actionTypes: {
        },
        state: {
            byId: {},
        },
        selectors: (state) => {
            const currentState = state[name];
            return {
                getFile: (id) => currentState.byId[id]
            }
        },
        actions: {
            /* 产生一个文件下载消息 */
            downloadFile: ({ fileId, downloadUrl }) => (dispatch, getState) => {
                const accessToken = SessionModel.selectors(getState()).getAccessToken();
                if (typeof (downloadUrl) === 'undefined') {
                    dispatch(addWarningMessage('缺少下载链接'));
                    return;
                }
                if (typeof (fileId) === 'undefined') {
                    dispatch(addWarningMessage('缺少文件ID'));
                    return;
                }
                const url = new URL(downloadUrl);
                url.searchParams.append(accessToken.name, accessToken.value);
                dispatch(addMessage({
                    type: 'download',
                    fileId,
                    url: url.href,
                    title: '下载文件',
                }));
            },
            /* 浏览器直接读取一个文件原始内容 */
            rawFile: ({ title, fileId }) => (dispatch, getState) => {
                const host = RouterModel.selectors(getState()).getHost();
                const accessToken = SessionModel.selectors(getState()).getAccessToken();
                if (typeof (fileId) === 'undefined') {
                    dispatch(addWarningMessage('缺少文件ID'));
                    return;
                }

                const url = new URL(`${host}/api/files/${fileId}/raw`);
                url.searchParams.append(accessToken.name, accessToken.value);
                window.open(url.href, title, '_blank');
            }
        },
        reducers: {
            byId: (state = FileModel.state.byId, action) => {
                const { type, payload } = action;
                const { FETCH_BANNERS_SUCCESS } = BannerModel.actionTypes;

                switch (type) {
                    case FETCH_BANNERS_SUCCESS: {
                        const { normalized } = payload;
                        return {
                            ...state,
                            ...normalized.entities[FileModel.name]
                        };}
                    default:
                        return state;
                }
            }
        }
    }
}();

export default FileModel;