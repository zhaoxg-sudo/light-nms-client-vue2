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
  }
}
