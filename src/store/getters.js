/* eslint-disable */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立用户token的映射
  name: state => state.user.userInfo.username, // 建立用户名的映射
  userId: state => state.user.userInfo.userId, // 建立用户id的映射
  staffPhoto: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId, // 建立对于User模块的companyId的快捷访问
  routes: state => state.permission.routes // state下routes的快捷访问
}
export default getters
