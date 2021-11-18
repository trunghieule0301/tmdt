import axios from 'axios'

const callApi = async (url, method, params) => {
    try {
        const response = await axios.request({
            url,
            method,
            params: params,
            headers: {
                'token': 'a7abca62-46b1-11ec-ac64-422c37c6de1b'
            }
        })
        //console.log(response)
        return response.data.data
    }
    catch (err) {
        console.log(err)
    }
}

export const getProvince = async () => callApi(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
    'get'
)

export const getDistrict = async (province_id) => callApi(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
    'get',
    {
        province_id: province_id
    }
)

export const getWard = async (district_id) => callApi(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward',
    'get',
    {
        district_id: district_id
    }
)

export const getService = async (shop_id, from_district, to_district) => callApi(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
    'get',
    {
        "shop_id": shop_id,
        "from_district": from_district,
        "to_district": to_district
    }
)

export const calculateTheExpectedDeliveryTime = async (
    from_district_id,
    from_ward_code,
    to_district_id,
    to_ward_code,
    service_id
) => callApi(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime',
    'get',
    {
        "from_district_id": from_district_id,
        "from_ward_code": from_ward_code,
        "to_district_id": to_district_id,
        "to_ward_code": to_ward_code,
        "service_id": service_id
    }
)
