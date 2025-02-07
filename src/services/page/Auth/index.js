import { LOGIN_REQUESTED, SIGNUP_REQUESTED } from '../../../constants';
import { store } from '../../../redux/store';

const { dispatch } = store;

export const SignUp = (data, resetForm) => {
    dispatch({
        type: SIGNUP_REQUESTED,
        payload: {
            API_SUFFIX:'Auth/signUp',
            data,
            resetForm
        }
    })
}

export const Login = (data, pushToDashboard) => {
    console.log('LOGIN_REQUESTED==', data)
    dispatch({
        type: LOGIN_REQUESTED,
        payload: {
            API_SUFFIX:'Auth/login',
            data,
            pushToDashboard
        }
    })
}
