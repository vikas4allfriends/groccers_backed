import { DELETE_PERMISSION_SUCESS, GET_PERMISSION_SUCESS, GET_ROLE_SUCESS, SET_NOTIFICATION, SPINNER_STATUS_REQUESTED } from '../../../constants';
import { goBack } from '../../../utils/navigation';

const initialState = {
    SpinnerStatus: false,
    notification: {
        open: false,
        message: '',
        severity: 'success'
    },
    permissions: {
        PermissionList: []
    },
    roles: {
        RolesList: []
    }
}

export const Common_Data = (state = initialState, action) => {
    switch (action.type) {
        case SPINNER_STATUS_REQUESTED:
            // console.log('spinner payload--', action.payload)
            return { ...state, SpinnerStatus: action.payload }

        case SET_NOTIFICATION:
            // console.log('SET_NOTIFICATION payload--', action.payload)
            return { ...state, notification: action.payload }

        case GET_PERMISSION_SUCESS:
            // console.log('GET_PERMISSION_SUCESS payload--', action.payload)
            return { ...state, permissions: { ...state.permissions, PermissionList: action.payload.permissions, Pagination: action.payload.pagination } }

        case DELETE_PERMISSION_SUCESS:
            // console.log('DELETE_PERMISSION_SUCESS==', action.payload)
            // console.log('state.permissions.PermissionList==', state.permissions.PermissionList)
            let finalList = state.permissions.PermissionList.filter((item) => {
                return item._id !== action.payload.data.id
            })
            return { ...state, permissions: { ...state.permissions, PermissionList: finalList } }

        case GET_ROLE_SUCESS:
            // console.log('GET_ROLE_SUCESS payload--', action.payload)
            return { ...state, roles: { ...state.roles, RolesList: action.payload.roles, Pagination: action.payload.pagination } }

        default:
            return state;
    }
}