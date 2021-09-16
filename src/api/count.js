import request from '@/utils/request'

// 获取
// 传shopID获取一个商品信息，
// 不传，获取所有商品信息
export function getShopTotal() {
  return request({
    url: '/vue-admin-template/shop/count',
    method: 'get',
  })
}
