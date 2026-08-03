
import * as type from './type'
import {cookieStorage} from '../../common/storage/index'
// import 'assets/js/common'

export default {
  // 设置用户信息和是否登录
  [type.SET_USER_INFO] (state, userinfo) {
    state.user_info = userinfo || {}
    if (userinfo === null) {
      cookieStorage.remove('user_info')
    } else {
      cookieStorage.set('user_info', userinfo)
    }
  },
  TREECHANGE (state, val) {
    state.TreeData = val.data
    state.TreeObj = val.node
  },
  ALARMREPORT (state, val) {
    state.alarmReport = val
  },
  PORTONOFF (state, val) {
    state.portonoff = val
  },
  CLSDPORTONOFF (state, val) {
    state.clsdportonoff = val
  },
  PORTVA (state, val) {
    state.portva = val
  },
  updateTime (state, val) {
    state.updateTime = val
  },
  TREE_LIST_OPENED_STATE (state, val) {
    state.treeListOpenedState = val
  }
}
