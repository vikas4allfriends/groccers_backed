import { 
    ADD_SHOP_REQUESTED,
    GET_SHOPS_REQUESTED
 } from '../../../constants';
import { store } from '../../../redux/store';

const { dispatch } = store;

export const Get_Shops = () => {
    dispatch({
        type: GET_SHOPS_REQUESTED,
        payload: {
            API_SUFFIX: `Shop/Search`
        }
    });
}

export const Add_Shop = (data,resetForm) => {
    console.log('Add_Shop serv')
    dispatch({
        type: ADD_SHOP_REQUESTED,
        payload: {
            API_SUFFIX: `Shop/Add`,
            data,
            resetForm
        }
    });
}