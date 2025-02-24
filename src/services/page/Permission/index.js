import { ADD_PERMISSION_REQUESTED, DELETE_PERMISSION_REQUESTED, GET_PERMISSION_REQUESTED, UPDATE_PERMISSION_REQUESTED } from '../../../constants';
import {store} from '../../../redux/store';

const {dispatch} = store;

export const Get_Permission = (data) => {
    dispatch({
        type: GET_PERMISSION_REQUESTED,
        payload: {
            API_SUFFIX: `permission/SearchPermission`,
            data
        }
    });
}

export const Add_Permission = (data,resetForm) => {
    dispatch({
        type: ADD_PERMISSION_REQUESTED,
        payload: {
            API_SUFFIX: `permission/addPermission`,
            data,
            resetForm
        }
    });
}

export const Update_Permission = (data) => {
    dispatch({
        type: UPDATE_PERMISSION_REQUESTED,
        payload: {
            API_SUFFIX: `permission/UpdatePermission`,
            data,
        }
    });
}

export const Delete_Permission = (data,resetForm) => {
    dispatch({
        type: DELETE_PERMISSION_REQUESTED,
        payload: {
            API_SUFFIX: `permission/DeletePermission`,
            data,
            // resetForm
        }
    });
}