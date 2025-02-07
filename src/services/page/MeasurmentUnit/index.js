import { 
    GET_MEASURMENT_REQUESTED,
    ADD_MEASURMENT_REQUESTED
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