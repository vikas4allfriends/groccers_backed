import { SET_NOTIFICATION } from '../../../constants';
import { store } from '../../../redux/store';

const { dispatch } = store;

export const Set_Notification = (params) => {
    dispatch({
        type: SET_NOTIFICATION,
        payload: {
            open: params.open,
            message: params.message,
            severity: params.severity,
        }
    })
}