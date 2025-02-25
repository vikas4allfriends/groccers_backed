import {
    ADD_MEASURMENT_SUCESS,
    ADD_PRODUCT_CATEGORY_SUCESS,
    ADD_PRODUCT_COMPANY_SUCESS,
    ADD_PRODUCT_SUCESS, ADD_SHOP_SUCESS,
    DELETE_MEASURMENT_SUCESS,
    DELETE_SHOP_SUCESS,
    GET_MEASURMENT_SUCESS,
    GET_PRODUCT_CATEGORY_SUCESS,
    GET_PRODUCT_COMPANY_SUCESS,
    GET_PRODUCTS_SUCESS,
    GET_PURCHASE_ORDER_SUCESS,
    GET_SALES_ORDER_SUCESS,
    GET_SHOPS_SUCESS,
    UPDATE_MEASURMENT_SUCESS
} from "../../../constants";
import { navigate } from '../../../utils/navigation';

const initialState = {
    measurmentUnit: [],
    productCategories: [],
    ProductList: { products: [], pagination: { totalPages: 1, currentPage: 1, totalItems: 0 } },
    ShopsList: [],
    PurchaseOrder: { orders: [], totalRecords: 0 },
    SalesOrder: { orders: [], totalRecords: 0 },
    productCompanies: []
}

export const Product_Data = (state = initialState, action) => {
    switch (action.type) {

        case GET_MEASURMENT_SUCESS:
            // console.log('payload---', action.payload.data.data)
            return { ...state, measurmentUnit: action.payload.data.data }

        case ADD_MEASURMENT_SUCESS:
            console.log('ADD_MEASURMENT_SUCESS payload---', action.payload)
            return { ...state }

        case UPDATE_MEASURMENT_SUCESS:
            console.log('UPDATE_MEASURMENT_SUCESS payload---', action.payload)
            return { ...state }

        case DELETE_MEASURMENT_SUCESS:
            console.log('DELETE_MEASURMENT_SUCESS==', action.payload)
            let finalList = state.measurmentUnit.filter((item) => {
                return item._id !== action.payload.deletedId
            })
            console.log('finalList==', finalList)
            return { ...state, measurmentUnit: finalList }

        case GET_PRODUCT_CATEGORY_SUCESS:
            // console.log('payload---', action.payload.data)
            return { ...state, productCategories: action.payload.data.data }

        case ADD_PRODUCT_COMPANY_SUCESS:
            console.log('payload---', action.payload.data)
            return { ...state }

        case ADD_PRODUCT_CATEGORY_SUCESS:
            console.log('ADD_PRODUCT_CATEGORY_SUCESS payload==', action.payload)
            return { ...state }

        case GET_PRODUCTS_SUCESS:
            console.log('GET_PRODUCTS_SUCESS---', action.payload)
            return { ...state, ProductList: { products: action.payload.products, pagination: action.payload.pagination } }

        case GET_PRODUCT_COMPANY_SUCESS:
            console.log('GET_PRODUCT_COMPANY_SUCESS data===', action.payload.data.data)
            return { ...state, productCompanies: action.payload.data.data }

        case ADD_PRODUCT_SUCESS:
            console.log('ADD_PRODUCT_SUCESS payload---', action.payload)
            return { ...state }

        case GET_SHOPS_SUCESS:
            // console.log('payload====', action.payload)
            return { ...state, ShopsList: action.payload.shops }

        case ADD_SHOP_SUCESS:
            console.log('action.payload--', action.payload)
            return { ...state }

            case DELETE_SHOP_SUCESS:
            // console.log('payload====', action.payload)
            return { ...state, ShopsList: action.payload.shops }

        case GET_SALES_ORDER_SUCESS:
            console.log('GET_SALES_ORDER_SUCESS payload====', action.payload)
            return { ...state, SalesOrder: { ...state.SalesOrder, orders: action.payload.data.orders, totalRecords: action.payload.data.totalRecords } }

        case GET_PURCHASE_ORDER_SUCESS:
            console.log('payload====', action.payload.data)
            return { ...state, PurchaseOrder: { ...state.PurchaseOrder, orders: action.payload.data.orders, totalRecords: action.payload.data.totalRecords } }

        default:
            return state;
    }
}