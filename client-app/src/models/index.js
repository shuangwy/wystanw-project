import { combineReducers, bindActionCreators } from 'redux';
import _BannerModel from './BannerModel';
import _MessageModel from './MessageModel'
import _RouterModel from './RouterModel';
import _SessionModel from './SessionModel';

import _ from 'lodash'

const allActions = {};
const allModels = {};
const allReducers = {};
let allApis = [];
const wrapModel = (model, alias) => {
    const selectors = {};
    const actions = {};
    const apis = [];
    const actionTypes = model.actionTypes;

    const modelWrapper = {
        wrappedModel: model,
        selectors,
        actions,
        actionTypes,
        apis
    };
    modelWrapper.selectors = model.selectors;
    Object.keys(model.actions).forEach(key => {
        actions[key] = function () {
            return model.actions[key](...arguments);
        };
    });
    if (model.api) {
        Object.keys(model.api).forEach(key => {
            let funcString = model.api[key].toString();
            let uriStrting = funcString.match(/['"]\/(\S*)[,?/]/);
            if (uriStrting) {
                apis.push(uriStrting[0].slice(2, -2));
            }
        });
    }

    if (typeof model.reducers === 'function') {
        allReducers[model.name] = model.reducers;
    } else if (!_.isEmpty(model.reducers)) {
        allReducers[model.name] = combineReducers(model.reducers);
    }
    Object.assign(allActions, actions);
    allApis = [...allApis, ...apis];
    allModels[alias] = modelWrapper;
    return modelWrapper;
};


export const BannerModel = wrapModel(_BannerModel, 'BannerModel');
export const MessageModel = wrapModel(_MessageModel, 'MessageModel')
export const RouterModel = wrapModel(_RouterModel, 'RouterModel');
export const SessionModel = wrapModel(_SessionModel, 'SessionModel');

export const actions = allActions;
export const rootReducer = combineReducers(allReducers)
export default rootReducer