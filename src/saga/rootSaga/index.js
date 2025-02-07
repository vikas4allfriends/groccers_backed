import {all} from 'redux-saga/effects';
import Product_Saga_Watcher from '../handlers/Product_Saga_Watcher';
import Auth_Saga_Watcher from '../handlers/Auth_Saga_Watcher';

export default function* rootSaga(){
    yield all([Product_Saga_Watcher(), Auth_Saga_Watcher() ])
}