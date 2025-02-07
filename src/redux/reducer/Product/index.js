import { ADD_MEASURMENT_SUCESS, ADD_PRODUCT_CATEGORY_SUCESS, ADD_PRODUCT_SUCESS, ADD_SHOP_SUCESS, GET_MEASURMENT_SUCESS, GET_PRODUCT_CATEGORY_SUCESS, GET_PRODUCTS_SUCESS, GET_PURCHASE_ORDER_SUCESS, GET_SHOPS_SUCESS } from "../../../constants";

const initialState = {
    measurmentUnit: [],
    productCategories: [],
    ProductList: [],
    ShopsList: [],
    PurchaseOrder: { orders: [], totalRecords: 0 }
}

export const Product_Data = (state = initialState, action) => {
    switch (action.type) {

        case GET_MEASURMENT_SUCESS:
            // console.log('payload---', action.payload.data.data)
            return { ...state, measurmentUnit: action.payload.data.data }

        case ADD_MEASURMENT_SUCESS:
            console.log('ADD_MEASURMENT_SUCESS payload---', action.payload)
            return { ...state }

        case GET_PRODUCT_CATEGORY_SUCESS:
            // console.log('payload---', action.payload.data)
            return { ...state, productCategories: action.payload.data.data }

        case ADD_PRODUCT_CATEGORY_SUCESS:
            console.log('ADD_PRODUCT_CATEGORY_SUCESS payload==', action.payload)
            return { ...state }

        case GET_PRODUCTS_SUCESS:
            console.log('payload---', action.payload)
            return { ...state, ProductList: action.payload.products }

        case ADD_PRODUCT_SUCESS:
            console.log('ADD_PRODUCT_SUCESS payload---', action.payload)
        // return { ...state, ProductList: action.payload.products }

        case GET_SHOPS_SUCESS:
            // console.log('payload====', action.payload)
            return { ...state, ShopsList: action.payload.shops }

        case ADD_SHOP_SUCESS:
            console.log('action.payload--', action.payload)
            return { ...state }

        case GET_PURCHASE_ORDER_SUCESS:
            console.log('payload====', action.payload.data)
            return { ...state, PurchaseOrder: { ...state.PurchaseOrder, orders: action.payload.data.orders, totalRecords: action.payload.data.totalRecords } }
        default:
            return state;
    }
}