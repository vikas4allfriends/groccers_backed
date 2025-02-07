import { 
    LOGIN_SUCESS,
    LOGOUT_USER,
    SIGNUP_SUCESS,
} from "../../../constants";

const initialState = {
    token:null,
    isLoggedOut:false
}

export const Auth_Data = (state = initialState, action) => {
    switch (action.type) {

        case LOGIN_SUCESS:
            console.log('LOGIN_SUCESS---',action.payload)
            return {...state, token:action.payload.token, isLoggedOut:false }
            
        case SIGNUP_SUCESS:
            console.log('Signup data--', action.payload)
            return { ...state }

        case LOGOUT_USER:
            console.log('LOGOUT_USER reducer')
            window.location.replace("/auth/Login");
            return{...state, isLoggedOut: true}
        default:
            return state;
    }
}