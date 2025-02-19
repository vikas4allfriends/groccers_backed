import {
    ADD_ROLE_REQUESTED,
    GET_ROLE_REQUESTED
} from '../../../constants';
import { store } from '../../../redux/store';

const { dispatch } = store;

export const Get_Role = (data) => {
    dispatch({
        type: GET_ROLE_REQUESTED,
        payload: {
            API_SUFFIX: `permission/SearchPermission`,
            data
        }
    });
}

export const Add_Role = (data, resetForm) => {
    dispatch({
        type: ADD_ROLE_REQUESTED,
        payload: {
            API_SUFFIX: `role/addRole`,
            data,
            resetForm
        }
    });
}