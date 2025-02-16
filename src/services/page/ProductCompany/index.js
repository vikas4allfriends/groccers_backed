import { ADD_PRODUCT_COMPANY_REQUESTED, GET_PRODUCT_COMPANY_REQUESTED } from '../../../constants';
import {store} from '../../../redux/store';

const {dispatch} = store;

export const Get_Product_Company = () => {
    dispatch({
        type: GET_PRODUCT_COMPANY_REQUESTED,
        payload: {
            API_SUFFIX: `Product/Company/Search`
        }
    });
}

export const Add_Product_Company = (data,resetForm) => {
    dispatch({
        type: ADD_PRODUCT_COMPANY_REQUESTED,
        payload: {
            API_SUFFIX: `Product/Company/Add`,
            data,
            resetForm
        }
    });
}