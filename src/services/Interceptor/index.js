import axiosInstance from "../api";
import { store } from '../../redux/store';
import { SPINNER_STATUS_REQUESTED, LOGOUT_USER } from "../../constants";

let alertShown = false;

// Function to show an error alert
const errorDialogBox = (error) => {
    if (!alertShown) {
        alertShown = true;
        window.alert(
            'Network Error',
            `${error.message} \n \n ${JSON.stringify(error.response)}`,
            [{ text: 'OK', onPress: () => { alertShown = false; } }],
            { cancelable: false }
        );
    }
};

const setup = (axiosInstance) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const { dispatch } = store;
            const csrf_token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;
            if (csrf_token) {
                config.headers["Authorization"] = 'Bearer ' + csrf_token;
            }
            dispatch({ type: SPINNER_STATUS_REQUESTED, payload: true });
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            const { dispatch } = store;
            dispatch({ type: SPINNER_STATUS_REQUESTED, payload: false });
            return response;
        },
        async (error) => {
            const { dispatch } = store;
            dispatch({ type: SPINNER_STATUS_REQUESTED, payload: false });

            if (!error.response) {
                errorDialogBox({ message: "Network error: Check your internet connection!" });
            } else {
                const status = error.response.status;
                console.log('status==', status)
                if(status==401){
                    localStorage.removeItem('token')
                    //Redirect to login page
                    dispatch({ type: LOGOUT_USER });
                    //Remove token
                }
                if ([400, 401, 403, 404, 500].includes(status)) {
                    errorDialogBox(error);
                }
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default setup;
