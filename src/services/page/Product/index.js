import { 
    GET_PRODUCTS_REQUESTED,
    ADD_PRODUCT_REQUESTED
 } from '../../../constants';
import { store } from '../../../redux/store';

const { dispatch } = store;

export const Get_Products = (params) => {
    dispatch({
        type: GET_PRODUCTS_REQUESTED,
        payload: {
            API_SUFFIX: `Product/SearchProduct`,
            params
        }
    });
}

export const Add_Product = (data,resetForm) => {
    dispatch({
        type: ADD_PRODUCT_REQUESTED,
        payload: {
            API_SUFFIX: `Product/CreateProduct`,
            data,
            resetForm
        }
    });
}