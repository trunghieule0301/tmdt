import axios from 'axios'

const HTTP = axios.create('https://dev-online-gateway.ghn.vn/shiip/public-api/')
axios.create({
    baseURL: 'https://dev-online-gateway.ghn.vn/shiip/public-api/'
});

export default HTTP