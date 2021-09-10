import request from '@/utils/request'

// 获取
export function getBanner() {
  return request({
    url: '/vue-admin-template/activity/banner',
    method: 'get',
  })
}

// 增加
export function addBanner(data) {
  return request({
    url: '/vue-admin-template/activity/banner',
    method: 'post',
    data
  })
}

// 删除
export function deleteBanner(bannerID) {
  return request({
    url: '/vue-admin-template/activity/banner',
    method: 'delete',
    params: { bannerID }
  })
}
// 修改
export function updateBanner(data) {
  return request({
    url: '/vue-admin-template/activity/banner',
    method: 'put',
    data
  })
}

