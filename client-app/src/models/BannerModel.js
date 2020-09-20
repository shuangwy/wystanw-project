import { schema } from 'normalizr';
import _ from 'lodash';
// import callApi from '../services/call';
// import request from '../utils/request';
import FileModel from './FileModel';
// import RouterModel from './RouterModel';
// import SessionModel from './SessionModel';

const FETCH_BANNERS_REQUEST = 'FETCH_BANNERS_REQUEST';
const FETCH_BANNERS_SUCCESS = 'FETCH_BANNERS_SUCCESS';
const FETCH_BANNERS_FAILURE = 'FETCH_BANNERS_FAILURE';

const BannerModel = function () {
    const name = 'banners';
    const object = new schema.Entity(name, {
        $image_file_id: FileModel.schema.object
    });
    const array = new schema.Array(object);
    return {
        name,
        schema: {
            object,
            array,
        },
        actionTypes: {
            FETCH_BANNERS_REQUEST,
            FETCH_BANNERS_SUCCESS,
            FETCH_BANNERS_FAILURE,
        },
        states: {
            byId: {},
            ids: [],
            isFetching: false,
        },
        selectors: (state) => {
            const currentState = state[name];
            const getFile = FileModel.selectors(state).getFile;
            return {
                getBanners: () => {
                    const banners = currentState.ids.map(id => currentState.byId[id]);
                    return banners.map(banner => {
                        const file = getFile(banner.$image_file_id);
                        return { ...banner, file }
                    });
                }
            }
        },
        api: {
            fetchBanners: {
                uri: '/demo/json/banners',
                method: 'GET'
            },
        },
        actions: {
            fetchBanners: (p, v) => ({ dispatch, state }) => {
                // const host = RouterModel.selectors(state).getHost();
                // const accessToken = SessionModel.selectors(state).getAccessToken();
                // return callApi({
                //     api: BannerModel.api.fetchBanners,
                //     params: { accessToken, host },
                //     schema: BannerModel.schema.array,
                //     REQUEST: FETCH_BANNERS_REQUEST,
                //     SUCCESS: FETCH_BANNERS_SUCCESS,
                //     FAILURE: FETCH_BANNERS_FAILURE,
                //     dispatch
                // });
            }
        },
        reducers: {
            byId: (state = BannerModel.states.byId, action) => {
                const { type, payload } = action;
                switch (type) {
                    case FETCH_BANNERS_SUCCESS: {
                        const { normalized } = payload; 
                        return {
                            ...state,
                            ...normalized.entities[BannerModel.name]
                        }}
                    default:
                        return state;
                }
            },
            ids: (state = BannerModel.states.ids, action) => {
                const { type, payload } = action;
                switch (type) {
                    case FETCH_BANNERS_SUCCESS : {
                        const { normalized } = payload; 
                        return _.union(
                            state,
                            normalized.result
                        )}
                    default:
                        return state;
                }
            },
            isFetching: (state = BannerModel.states.isFetching, action) => {
                switch (action.type) {
                    case FETCH_BANNERS_REQUEST:
                        return true;
                    case FETCH_BANNERS_SUCCESS:
                    case FETCH_BANNERS_FAILURE:
                        return false;
                    default:
                        return state;
                }
            }
        }
    }
}();

export default BannerModel;