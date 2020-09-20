import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import monitorReducersEnhancer from '../src/enhancers/monitorReducer'
import loggerMiddleware from '../src/middleware/logger'
import rootReducer from '../src/models'

export default function configureStore (preloadedState) {
    const middleware = [loggerMiddleware, thunkMiddleware]
    const middlewareEnhancer = applyMiddleware(...middleware)

    const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
    const composedEnhancers = compose(...enhancers)

    const store = createStore(rootReducer, preloadedState, composedEnhancers)
    return store
}