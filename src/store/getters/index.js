import * as type from './type'
export default {
  // 获取用户信息
  [type.GET_USER_INFO]: state => {
    return state.user_info
  },
  updateState: state => {
    return state.updateState
  },
  treeListOpenedState: state => {
    return state.treeListOpenedState
  },
  TreeData: state => {
    return state.TreeData
  },
  updatePoint: state => {
    return state.updatePoint
  },
  alarmReport: state => {
    return state.alarmReport
  },
  portonoff: state => {
    return state.portonoff
  },
  clsdportonoff: state => {
    return state.clsdportonoff
  },
  portva: state => {
    return state.portva
  },
  updateTime: state => {
    return state.updateTime
  },
  TreeObj: state => {
    return state.TreeObj
  },
  // ====下面新增三个权限getter====
  permissionObj (state, getters) {
    const userInfo = getters[type.GET_USER_INFO]
    if (!userInfo || !userInfo.user || !userInfo.user.userright) {
      return {
        menuList: [],
        btnList: []
      }
    }
    const str = userInfo.user.userright
    try {
      const res = typeof str === 'string' ? JSON.parse(str) : str
      // 兜底字段不存在则赋值空数组
      res.menuList = res.menuList || []
      res.btnList = res.btnList || []
      return res
    } catch (err) {
      return {
        menuList: [],
        btnList: []
      }
    }
  },
  getMenuList (state, getters) {
    return getters.permissionObj.menuList
  },
  getBtnList (state, getters) {
    return getters.permissionObj.btnList
  }
}
