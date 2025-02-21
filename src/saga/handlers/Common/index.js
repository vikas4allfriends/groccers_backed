import {get, post} from '../../requests';
import { call, put, takeEvery } from 'redux-saga/effects'
import { 
    ADD_PERMISSION_REQUESTED, 
    ADD_PERMISSION_SUCESS, 
    ADD_ROLE_REQUESTED, 
    ADD_ROLE_SUCESS, 
    GET_PERMISSION_REQUESTED, 
    GET_PERMISSION_SUCESS, 
    GET_ROLE_REQUESTED, 
    GET_ROLE_SUCESS, 
    SET_NOTIFICATION, 
    SIGNUP_SUCESS 
} from '../../../constants';

function* handle_AddPermission(values) {
    try {
        console.log('handle_AddPermission saga===', values.payload)
        const data = yield call(post, values)
        yield put({ type: ADD_PERMISSION_SUCESS, payload: data })
        values.payload.resetForm()
        yield put({
            type: SET_NOTIFICATION, 
            payload: {
                open: true,
                message: "Permission data submitted successfully!",
                severity: "success",
            }
        })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_GetPermission(values) {
    try {
        console.log('handle_GetPermission saga===', values.payload)
        const data = yield call(post, values)
        yield put({ type: GET_PERMISSION_SUCESS, payload: data })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_GetRole(values) {
    try {
        const data = yield call(post, values)
        yield put({ type: GET_ROLE_SUCESS, payload: data })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_AddRole(values) {
    try {
        console.log('handle_AddRole saga===', values.payload)
        const data = yield call(post, values)
        yield put({ type: ADD_ROLE_SUCESS, payload: data })
        values.payload.resetForm()
        yield put({
            type: SET_NOTIFICATION, 
            payload: {
                open: true,
                message: "Role data submitted successfully!",
                severity: "success",
            }
        })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}


function* Common() {
    yield takeEvery(GET_PERMISSION_REQUESTED, handle_GetPermission)
    yield takeEvery(ADD_PERMISSION_REQUESTED, handle_AddPermission)
    yield takeEvery(GET_ROLE_REQUESTED, handle_GetRole)
    yield takeEvery(ADD_ROLE_REQUESTED, handle_AddRole)
}

export default Common;