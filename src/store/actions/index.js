
import * as actions from './type'
import * as mutations from '@/store/mutations/type'

export default {
  // 设置用户信息和登录
  [actions.SET_USER_INFO] ({commit}, userinfo) {
    commit(mutations.SET_USER_INFO, userinfo)
  },
  //  刷新页面和树
  update ({commit}, val) {
    commit('UPDATE', val)
  },
  // 单击树
  TreeChange ({commit}, val) {
    commit('TREECHANGE', val)
  },
  // 报警
  alarmReport ({commit}, val) {
    commit('ALARMREPORT', val)
  },
  portonoff ({commit}, val) {
    commit('PORTONOFF', val)
  },
  clsdportonoff ({commit}, val) {
    commit('CLSDPORTONOFF', val)
  },
  portva ({commit}, val) {
    commit('PORTVA', val)
  },
  // 刷新电源设置参数
  updateTime ({commit}, val) {
    commit('updateTime', val)
  },
  treeListOpenedState ({commit}, status) {
    commit('TREE_LIST_OPENED_STATE', status)
  }
}
