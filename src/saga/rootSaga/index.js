import {all} from 'redux-saga/effects';
import Product_Saga_Watcher from '../handlers/Product_Saga_Watcher';
import Auth_Saga_Watcher from '../handlers/Auth_Saga_Watcher';
import Common from '../handlers/Common';

export default function* rootSaga(){
    yield all([Product_Saga_Watcher(), Auth_Saga_Watcher(), Common() ])
}