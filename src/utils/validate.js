/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
// 这里可以设置前端验证规则
// 比如设置admin：管理员，editor：编辑员，tourist：游客，三种账号
// export function validUsername(str) {
//   const valid_map = ['admin', 'editor','tourist']
//   return valid_map.indexOf(str.trim()) >= 0
// }


// 这里设置非空即可
export function validateAccount(str) {
  return str.trim().length > 0
}