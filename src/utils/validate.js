/* eslint-disable */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}


export function validMobile(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  return /^1[3-9]\d{9}$/.test(str) // 校验手机号
}
