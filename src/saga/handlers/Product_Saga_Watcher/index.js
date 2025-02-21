import { get, post } from '../../requests';
import { call, put, takeEvery } from 'redux-saga/effects'
import {
    GET_MEASURMENT_REQUESTED,
    GET_MEASURMENT_SUCESS,
    GET_PRODUCT_CATEGORY_REQUESTED,
    GET_PRODUCT_CATEGORY_SUCESS,
    GET_PRODUCTS_REQUESTED,
    GET_PRODUCTS_SUCESS,
    GET_SHOPS_REQUESTED,
    GET_SHOPS_SUCESS,
    GET_PURCHASE_ORDER_REQUESTED,
    GET_PURCHASE_ORDER_SUCESS,
    ADD_PRODUCT_REQUESTED,
    ADD_PRODUCT_SUCESS,
    SET_NOTIFICATION,
    ADD_MEASURMENT_REQUESTED,
    ADD_MEASURMENT_SUCESS,
    ADD_PRODUCT_CATEGORY_SUCESS,
    ADD_PRODUCT_CATEGORY_REQUESTED,
    ADD_SHOP_REQUESTED,
    ADD_SHOP_SUCESS,
    ADD_PRODUCT_COMPANY_REQUESTED,
    ADD_PRODUCT_COMPANY_SUCESS,
    GET_PRODUCT_COMPANY_SUCESS,
    GET_PRODUCT_COMPANY_REQUESTED,
    GET_SALES_ORDER_REQUESTED,
    GET_SALES_ORDER_SUCESS,
    UPDATE_MEASURMENT_REQUESTED,
    UPDATE_MEASURMENT_SUCESS,
    DELETE_MEASURMENT_REQUESTED,
    DELETE_MEASURMENT_SUCESS
} from '../../../constants';
import { goBack } from '../../../utils/navigation';
import {store} from '../../../redux/store';

function* handle_Get_MeasurmentUnit(values) {
    try {
        console.log('handle_Add_To_Cart saga===', values.payload)
        const data = yield call(get, values)
        console.log('data===', data)
        yield put({ type: GET_MEASURMENT_SUCESS, payload: data })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Add_MeasurmentUnit(values) {
    try {
        console.log('handle_Add_MeasurmentUnit saga===', values.payload)
        const data = yield call(post, values)
        yield put({ type: ADD_MEASURMENT_SUCESS, payload: data })
        values.payload.resetForm()
        yield put({
            type: SET_NOTIFICATION,
            payload: {
                open: true,
                message: "Measurment Unit data submitted successfully!",
                severity: "success",
            }
        })
        goBack();
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Update_MeasurmentUnit(values) {
    try {
        console.log('handle_Update_MeasurmentUnit saga===', values.payload)
        const data = yield call(post, values)
        // values.payload.resetForm()
        yield put({
            type: SET_NOTIFICATION,
            payload: {
                open: true,
                message: "Measurment Unit data updated successfully!",
                severity: "success",
            }
        })
        yield put({ type: UPDATE_MEASURMENT_SUCESS, payload: data })
        goBack();
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Delete_MeasurmentUnit(values) {
    try {
        console.log('handle_Delete_MeasurmentUnit saga===', values.payload)
        const data = yield call(post, values)
        yield put({
            type: SET_NOTIFICATION,
            payload: {
                open: true,
                message: "Measurment Unit deleted successfully!",
                severity: "success",
            }
        })
        yield put({ type: DELETE_MEASURMENT_SUCESS, payload: {...data, deletedId:values.payload.data.id} })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Product_Categories(values) {
    try {
        console.log('handle_Product_Categories saga===', values.payload)
        const data = yield call(get, values)
        console.log('data===', data)
        yield put({ type: GET_PRODUCT_CATEGORY_SUCESS, payload: data })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Add_Product_Category(values) {
    try {
        console.log('handle_Add_Product_Category saga===', values.payload)
        const data = yield call(post, values)
        yield put({ type: ADD_PRODUCT_CATEGORY_SUCESS, payload: data })
        values.payload.resetForm()
        yield put({
            type: SET_NOTIFICATION,
            payload: {
                open: true,
                message: "Product category data submitted successfully!",
                severity: "success",
            }
        })
    } catch (error) {
        console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Add_Product_Company(values) {
    try {
        console.log('handle_Product_Company saga===', values.payload)
        const data = yield call(post, values)
        yield put({ type: ADD_PRODUCT_COMPANY_SUCESS, payload: data })
        values.payload.resetForm()
        yield put({
            type: SET_NOTIFICATION,
            payload: {
                open: true,
                message: "Product company data submitted successfully!",
                severity: "success",
            }
        })
    } catch (error) {
        console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Get_Product_Company(values) {
    try {
        console.log('handle_Get_Product_Company saga===', values.payload)
        const data = yield call(get, values)
        yield put({ type: GET_PRODUCT_COMPANY_SUCESS, payload: data })
    } catch (error) {
        console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Get_Products(values) {
    try {
        console.log('handle_Product_Categories saga===', values.payload)
        const data = yield call(get, values)
        console.log('data===', data)
        yield put({ type: GET_PRODUCTS_SUCESS, payload: data })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Add_Product(values) {
    try {
        console.log('handle_Add_Product saga===', values.payload)
        const data = yield call(post, values)
        console.log('data===', data)
        yield put({ type: ADD_PRODUCT_SUCESS, payload: data })
        values.payload.resetForm()
        yield put({
            type: SET_NOTIFICATION,
            payload: {
                open: true,
                message: "Product data submitted successfully!",
                severity: "success",
            }
        })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Get_Shop(values) {
    try {
        console.log('handle_Get_Shop saga===', values.payload)
        const data = yield call(get, values)
        console.log('data===', data)
        yield put({ type: GET_SHOPS_SUCESS, payload: data })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Add_Shop(values) {
    try {
        console.log('handle_Add_Shop saga===', values.payload)
        const data = yield call(post, values)
        console.log('data===', data)
        values.payload.resetForm()
        yield put({
            type: SET_NOTIFICATION,
            payload: {
                open: true,
                message: "Shop data submitted successfully!",
                severity: "success",
            }
        })
        // yield put({ type: ADD_SHOP_SUCESS, payload: data })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Get_PurchaseOrder(values) {
    try {
        console.log('handle_Get_Shop saga===', values.payload)
        const data = yield call(get, values)
        console.log('data===', data)
        yield put({ type: GET_PURCHASE_ORDER_SUCESS, payload: data })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* handle_Get_SalesOrder(values) {
    try {
        console.log('handle_Get_SalesOrder saga===', values.payload)
        const data = yield call(get, values)
        console.log('data===', data)
        yield put({ type: GET_SALES_ORDER_SUCESS, payload: data })
    } catch (error) {
        // console.log('handle_Get_Cart Saga Watcher ====>>>>>>', error)
    }
}

function* Product_Saga_Watcher() {
    yield takeEvery(GET_SALES_ORDER_REQUESTED, handle_Get_SalesOrder)

    yield takeEvery(GET_MEASURMENT_REQUESTED, handle_Get_MeasurmentUnit)
    yield takeEvery(ADD_MEASURMENT_REQUESTED, handle_Add_MeasurmentUnit)
    yield takeEvery(UPDATE_MEASURMENT_REQUESTED, handle_Update_MeasurmentUnit)
    yield takeEvery(DELETE_MEASURMENT_REQUESTED, handle_Delete_MeasurmentUnit)

    yield takeEvery(ADD_PRODUCT_COMPANY_REQUESTED, handle_Add_Product_Company)
    yield takeEvery(GET_PRODUCT_COMPANY_REQUESTED, handle_Get_Product_Company)

    yield takeEvery(GET_PRODUCT_CATEGORY_REQUESTED, handle_Product_Categories)
    yield takeEvery(ADD_PRODUCT_CATEGORY_REQUESTED, handle_Add_Product_Category)

    yield takeEvery(GET_PRODUCTS_REQUESTED, handle_Get_Products)
    yield takeEvery(ADD_PRODUCT_REQUESTED, handle_Add_Product)

    yield takeEvery(GET_SHOPS_REQUESTED, handle_Get_Shop)
    yield takeEvery(ADD_SHOP_REQUESTED, handle_Add_Shop)

    yield takeEvery(GET_PURCHASE_ORDER_REQUESTED, handle_Get_PurchaseOrder)
}

export default Product_Saga_Watcher;