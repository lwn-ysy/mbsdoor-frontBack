import request from '@/utils/request'

// 获取
export function getAccount() {
  return request({
    url: '/vue-admin-template/account/info',
    method: 'get',
  })
}

// 增加
export function addAccount(data) {
  return request({
    url: '/vue-admin-template/account/info',
    method: 'post',
    data
  })
}

// 删除
export function deleteAccount(userID) {
  return request({
    url: '/vue-admin-template/account/info',
    method: 'delete',
    params: { userID }
  })
}
// 修改
export function updateAccount(data) {
  return request({
    url: '/vue-admin-template/account/info',
    method: 'put',
    data
  })
}

