import request from '@/utils/request'

// 获取
export function getShop() {
  return request({
    url: '/vue-admin-template/shop/page',
    method: 'get',
  })
}

// 增加
export function addShop(data) {
  return request({
    url: '/vue-admin-template/shop/page',
    method: 'post',
    data
  })
}

// 删除
export function deleteShop(shopID) {
  return request({
    url: '/vue-admin-template/shop/page',
    method: 'delete',
    params: { bannerID }
  })
}
// 修改
export function updateShop(data) {
  return request({
    url: '/vue-admin-template/shop/page',
    method: 'put',
    data
  })
}

