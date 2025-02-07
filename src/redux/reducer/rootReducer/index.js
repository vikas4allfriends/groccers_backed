import {combineReducers} from 'redux';
import {Product_Data} from '../Product';
import {Common_Data} from '../Common';
import {Auth_Data} from '../Auth';

export default combineReducers({
    Product_Data,
    Common_Data,
    Auth_Data
})