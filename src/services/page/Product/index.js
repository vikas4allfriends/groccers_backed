import { useCallback } from 'react';
import {
    GET_PRODUCTS_REQUESTED,
    ADD_PRODUCT_REQUESTED
} from '../../../constants';
import { store } from '../../../redux/store';
import { debounce } from 'lodash';
import api from '../../api'
import {Get_Product_Company} from '../ProductCompany';
import {Get_Product_Category} from '../ProductCategory';

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

export const Add_Product = (data, resetForm) => {
    dispatch({
        type: ADD_PRODUCT_REQUESTED,
        payload: {
            API_SUFFIX: `Product/CreateProduct`,
            data,
            resetForm
        }
    });
}

// Debounced shop search
export const handleProductSearchDebounced = debounce(async (query, setShopSuggestions, enqueueSnackbar) => {
    console.log('query==', query)
    if (!query.trim() || query.length <= 2) return;
    try {
        Get_Products({ q: query })
    } catch (error) {
        window.alert('Failed to fetch products.', { variant: 'error' });
    }
    [enqueueSnackbar]
}, 300);

export const GetProductCategories_GetProductCompanies= ()=> {
    Get_Product_Category()
    Get_Product_Company()
}