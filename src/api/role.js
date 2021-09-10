import request from '@/utils/request'

// 获取
export function getRole() {
  return request({
    url: '/vue-admin-template/role',
    method: 'get',
  })
}

// // 增加
// export function addAccount(data) {
//   return request({
//     url: '/vue-admin-template/role',
//     method: 'post',
//     data
//   })
// }

// 删除
export function deleteRole(userID) {
  return request({
    url: '/vue-admin-template/role',
    method: 'delete',
    params: { userID }
  })
}
// 修改
export function updateRole(data) {
  return request({
    url: '/vue-admin-template/role',
    method: 'put',
    data
  })
}

