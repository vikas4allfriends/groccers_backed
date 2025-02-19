import {GET_PERMISSION_SUCESS, SET_NOTIFICATION, SPINNER_STATUS_REQUESTED} from '../../../constants';

const initialState = {
    SpinnerStatus: false,
    notification:{
        open:false,
        message:'',
        severity:'success'
    },
    permissions:{
        PermissionList:[]
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

        case GET_PERMISSION_SUCESS:
            console.log('GET_PERMISSION_SUCESS payload--', action.payload)
            return{...state, permissions:{...state.permissions, PermissionList:action.payload.permissions, Pagination:action.payload.pagination}}
        default:
            return state;
    }
}