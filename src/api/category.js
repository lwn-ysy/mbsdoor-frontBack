import request from '@/utils/request'

// 获取
export function getCategory() {
  return request({
    url: '/vue-admin-template/shop/category',
    method: 'get',
  })
}

// 增加
export function addCategory(data) {
  return request({
    url: '/vue-admin-template/shop/category',
    method: 'post',
    data
  })
}

// 删除
export function deleteCategory(categoryID) {
  return request({
    url: '/vue-admin-template/shop/category',
    method: 'delete',
    params: { categoryID }
  })
}
// 修改
export function updateCategory(data) {
  return request({
    url: '/vue-admin-template/shop/category',
    method: 'put',
    data
  })
}

