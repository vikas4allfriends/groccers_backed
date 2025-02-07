import {SET_NOTIFICATION, SPINNER_STATUS_REQUESTED} from '../../../constants';

const initialState = {
    SpinnerStatus: false,
    notification:{
        open:false,
        message:'',
        severity:'success'
    }
}

export const Common_Data = (state = initialState, action) => {
    switch (action.type) {
        case SPINNER_STATUS_REQUESTED:
            console.log('spinner payload--', action.payload)
            return {...state, SpinnerStatus:action.payload}

        case SET_NOTIFICATION:
            console.log('SET_NOTIFICATION payload--', action.payload)
            return {...state, notification:action.payload}
        default:
            return state;
    }
}