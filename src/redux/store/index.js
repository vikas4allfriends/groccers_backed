import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../reducer/rootReducer';
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../../saga/rootSaga';

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer:rootReducer, 
    middleware:()=>[sagaMiddleware] 
})

sagaMiddleware.run(rootSaga)
