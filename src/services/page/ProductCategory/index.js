import { ADD_PRODUCT_CATEGORY_REQUESTED, GET_PRODUCT_CATEGORY_REQUESTED } from '../../../constants';
import {store} from '../../../redux/store';

const {dispatch} = store;

export const Get_Product_Category = () => {
    dispatch({
        type: GET_PRODUCT_CATEGORY_REQUESTED,
        payload: {
            API_SUFFIX: `Product/GetCategories`
        }
    });
}

export const Add_Product_Category = (data,resetForm) => {
    dispatch({
        type: ADD_PRODUCT_CATEGORY_REQUESTED,
        payload: {
            API_SUFFIX: `Product/CreateCategory`,
            data,
            resetForm
        }
    });
}