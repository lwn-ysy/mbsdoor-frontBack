import request from '@/utils/request'

// 获取
export function getTag() {
  return request({
    url: '/vue-admin-template/shop/tag',
    method: 'get',
  })
}

// 增加
export function addTag(data) {
  return request({
    url: '/vue-admin-template/shop/tag',
    method: 'post',
    data
  })
}

// 删除
export function deleteTag(tagID) {
  return request({
    url: '/vue-admin-template/shop/tag',
    method: 'delete',
    params: { tagID }
  })
}
// 修改
export function updateTag(data) {
  return request({
    url: '/vue-admin-template/shop/tag',
    method: 'put',
    data
  })
}

