import api from '../../services/api';

export const get = async (data) => {
    // console.log('get values---', data.payload)
    try {
        const res = await api.get(data.payload.API_SUFFIX, {params: data.payload.params})
        // console.log('res==>>>>>>>>>>', res)
        return res.data
    } catch (err) {
        throw err
    }

}

export const post = async (data) => {
    // console.log('crete values---', data.payload)
    // console.log('api==', api)
    try {
        const res = await api.post(data.payload.API_SUFFIX, data.payload.data)
        console.log('res==', res.data)
        return res.data
    } catch (err) {
        throw err
    }

}