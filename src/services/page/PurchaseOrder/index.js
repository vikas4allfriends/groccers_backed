import { type } from 'os';
import {store} from '../../../redux/store';
import { GET_PURCHASE_ORDER_REQUESTED } from '../../../constants';

const {dispatch} = store;

export const Get_Purchase_Order =(parameters)=>{
    dispatch({
        type:GET_PURCHASE_ORDER_REQUESTED,
        payload:{
            API_SUFFIX: `PurchaseOrder/Search`,
            params:parameters
        }
    })
}