import request from './request'
import { baseUrlApi } from './index'

const api = {
  getHomeData: (r) => request.get('/index_data', null, {
    baseURL: baseUrlApi
  }),
  getGoods: (id) => request.get(`/goods_detail?goods_id=${id}`, null, {
    baseURL: baseUrlApi
  }),
  getOrderConfirmData: (data) => request.get(`/order_confirm_data?goods_types=${data}`, null, {
    baseURL: baseUrlApi
  }),
  getQrCode: (data) => request.get('/qrcode_data', data, {
    baseURL: baseUrlApi
  }),
  getAddresses: (r) => request.get('/address_list', null, {
    baseURL: baseUrlApi
  }),
  getAddress: (id) => request.get(`/address_detail?id=${id}`, null, {
    baseURL: baseUrlApi
  }),
  getCartList: (data) => request.get(`/cart_list?goods_types=${data}`, null, {
    baseURL: baseUrlApi
  }),
  getOrderList: (status) => request.get('order_list', {
    status: status
  }, {
    baseURL: baseUrlApi
  }),
  getOrder: (id) => request.get(`order_detail?id=${id}`, null, {
    baseURL: baseUrlApi
  }),
  postAddress: (data) => request.post('/address_edit', data, {
    baseURL: baseUrlApi
  }),
  postOrders: (orderIds, status) => request.post('/order_edit', {
    order_ids: orderIds,
    status: status
  }, {
    baseURL: baseUrlApi
  }),
  postOrderSubmit: (form) => request.post('/order_submit', form, {
    baseURL: baseUrlApi
  })
}

export default api
