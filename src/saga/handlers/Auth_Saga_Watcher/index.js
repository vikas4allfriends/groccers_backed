import {get, post} from '../../requests';
import { call, put, takeEvery } from 'redux-saga/effects'
import { LOGIN_REQUESTED, LOGIN_SUCESS, SET_NOTIFICATION, SIGNUP_REQUESTED, SIGNUP_SUCESS } from '../../../constants';

function* handle_Login(values) {
    try {
        const data = yield call(post, values)
        localStorage.setItem('token', JSON.stringify(data.token));
        yield put({ type: LOGIN_SUCESS, payload: data })
        window.location.replace("/product/dashboard");
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_SignUp(values) {
    try {
        console.log('SignUp saga===', values.payload)
        const data = yield call(post, values)
        yield put({ type: SIGNUP_SUCESS, payload: data })
        values.payload.resetForm()
        yield put({
            type: SET_NOTIFICATION, 
            payload: {
                open: true,
                message: "SignUp data submitted successfully!",
                severity: "success",
            }
        })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}


function* Auth_Saga_Watcher() {
    yield takeEvery(SIGNUP_REQUESTED, handle_SignUp)
    yield takeEvery(LOGIN_REQUESTED, handle_Login)
}

export default Auth_Saga_Watcher;