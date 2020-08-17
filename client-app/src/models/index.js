import { combineReducers } from 'redux'

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
            // actions暂时不进行额外处理
            // const ctx = { models:allModels, self:modelWrapper, actions };// FIXME
            return model.actions[key](...arguments);
        };
    });
    /* apis 收集项目中所有使用到的后端接口*/
    if (model.api) {
        Object.keys(model.api).forEach(key => {
            let funcString = model.api[key].toString();
            let uriStrting = funcString.match(/['"]\/(\S*)[,?/]/);
            if (uriStrting) {
                apis.push(uriStrting[0].slice(2,-2));
            }
        });
    }

    if (typeof model.reducers === 'function') {
        allReducers[model.name] = model.reducers;
    } else if (!_.isEmpty(model.reducers)) {
        allReducers[model.name] = combineReducers(model.reducers);
    }

    // 暂时主要目的是为了收集所有model的action、reducer
    Object.assign(allActions, actions);
    /*  */
    // Object.assign(allApis, apis);
    allApis =[...allApis,...apis];
    allModels[alias] = modelWrapper;

    return modelWrapper;
};
export const apis = allApis;
export const actions = allActions;
export const reducers = combineReducers(allReducers);

const rootReducer = combineReducers(allReducers)
export default rootReducer