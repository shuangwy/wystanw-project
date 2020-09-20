import { combineReducers } from 'redux';
import _BannerModel from './BannerModel';
import _MessageModel from './MessageModel'
// import _RouterModel from './RouterModel';
import _SessionModel from './SessionModel';

import _ from 'lodash'

const allActions = {};
const allModels = {};
const allReducers = {};
const allActionsObj = {}
const wrapModel = (model, alias) => {
    const selectors = {};
    const actions = {};
    const modelWrapper = {
        wrappedModel: model,
        selectors,
        actions,
    };
    modelWrapper.selectors = model.selectors;
    allActionsObj[alias] = actions
    Object.keys(model.actions).forEach(key => {
        actions[key] = (params) => {
            return (dispatch, getState) => model.actions[key](params)({ dispatch, state: getState(), actions: allActionsObj, [alias]: actions })
        };      
    });

    if (typeof model.reducers === 'function') {
        allReducers[model.name] = model.reducers;
    } else if (!_.isEmpty(model.state)) {
        let temp = {}
        if (model.state) {
            Object.keys(model.state).forEach(key => {
                const obj = {
                    [key]: (state = model.state[key].defaultState, action) => {
                        for (let idx in model.state[key].reducers) {
                            if (typeof idx === 'string') {
                                if (idx === action.type) {
                                    return model.state[key].reducers[idx](state, action)
                                } else {
                                    return state
                                }
                            } else {
                                // wait
                            }
                        }
                    }
                }
                temp = { ...temp, ...obj }
            })
        }
        allReducers[model.name] = combineReducers({ ...model.reducers, ...temp });
    }
    Object.assign(allActions, actions);
    allModels[alias] = modelWrapper;
    return modelWrapper;
};

export const BannerModel = wrapModel(_BannerModel, 'BannerModel');
export const MessageModel = wrapModel(_MessageModel, 'MessageModel')
// export const RouterModel = wrapModel(_RouterModel, 'RouterModel');
export const SessionModel = wrapModel(_SessionModel, 'SessionModel');

// console.log('allActions', allActions)
export const actions = allActions;
export const rootReducer = combineReducers(allReducers)
export default rootReducer