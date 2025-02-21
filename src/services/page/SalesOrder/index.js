import {
    GET_SALES_ORDER_REQUESTED
} from '../../../constants';
import { store } from '../../../redux/store';

const { dispatch } = store;

export const Get_SalesOrder = (data) => {
    dispatch({
        type: GET_SALES_ORDER_REQUESTED,
        payload: {
            API_SUFFIX: `SalesOrder/Search`,
            data
        }
    });
}

