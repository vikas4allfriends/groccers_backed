import { 
    GET_MEASURMENT_REQUESTED,
    ADD_MEASURMENT_REQUESTED,
    UPDATE_MEASURMENT_REQUESTED,
    DELETE_MEASURMENT_REQUESTED
} from '../../../constants';
import {store} from '../../../redux/store';

const {dispatch} = store;

export const Get_Measurment_Unit = () => {
    dispatch({
        type: GET_MEASURMENT_REQUESTED,
        payload: {
            API_SUFFIX: `measuringUnit/GetAllMeasuringUnit`
        }
    });
}

export const Add_Measurment_Unit = (data, resetForm) => {
    dispatch({
        type: ADD_MEASURMENT_REQUESTED,
        payload: {
            API_SUFFIX: `measuringUnit/CreateMeasuringUnit`,
            data,
            resetForm
        }
    });
}

export const Update_Measurment_Unit = (data, resetForm) => {
    dispatch({
        type: UPDATE_MEASURMENT_REQUESTED,
        payload: {
            API_SUFFIX: `measuringUnit/UpdateMeasuringUnit`,
            data,
            resetForm
        }
    });
}

export const Delete_Measurment_Unit = (data) => {
    dispatch({
        type: DELETE_MEASURMENT_REQUESTED,
        payload: {
            API_SUFFIX: `measuringUnit/DeleteMeasuringUnit`,
            data,
        }
    });
}