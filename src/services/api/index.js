import axios from 'axios';
import axiosRetry from 'axios-retry';
// import { Alert } from 'react-native';
import setupInerceptor from '../Interceptor';
import {store} from '../../redux/store';

const retries = 2
const instance = axios.create({
    baseURL: 'http://localhost:3000/api/', // Leave blank, it will be set dynamically
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + csrf_token
    }
});
axiosRetry(instance, {
    retries: retries,
    retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 1000),
    retryCondition(error) {
        switch (error.response.status) {
            //retry only if status is 500 or 501
            case 500:
                return false;
            case 501:
                return true;
            case 404:
                return true;
            default:
                return false;
        }
    },
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`retry count: `, retryCount);
        // console.log('error--', error)
        // console.log('requestConfig==', requestConfig)
        if (retryCount === retries) {
            // requestConfig.url = 'https://postman-echo.com/status/200';
            // errorDialogBox(error)
            setTimeout(() => {
                return (
                    alert(
                        JSON.stringify(error)
                    )
                )
            }, 4000)
        }
    },
});

export const controller = new AbortController();
export const source = axios.CancelToken.source()

const axiosInstance = setupInerceptor(instance)
export default axiosInstance;