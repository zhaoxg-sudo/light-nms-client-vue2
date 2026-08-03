<template>
  <!--新增用户至用户组-->
  <div class="popUpbig" id="add" style="display: block">
    <div class="groupName">
      <i class="fa fa-user-plus"></i>用户组分配</div>
    <div class="orgDisplay">
      <form class="form-inline">
        <div class="form-group" style="width: calc(100% - 90px)">
          <input class="form-control" v-model='fuzzyQuery' style="width: 100%" type="text" placeholder="快速查找用户">
        </div>
        <button type="button" class="btn btn-sm btn-info" @click="refresh(fuzzyQuery)">
          <i aria-hidden="true" class="fa fa-search"></i>查询
        </button>
      </form>
      <div class="orgList">
        <tree :addr="OrgUrl" ref="tree" :lable="labels" @setInitData="initDatas"></tree>
      </div>
      <div class="orgMember">
        <ul class="userList">
          <li :class="[{selected: item.selected}]" v-for="item in ungroupedUser" :key='item.userID'>
            <i class="fa fa-user"></i>
            {{item.userName}}
            <span class="fa fa-check-circle" @click='checkUngroupedUser(item)'></span>
          </li>
        </ul>
        <div class="selectAll" @click="checkAllUngroupedUser">全选</div>
      </div>
    </div>

    <div class="selectedMember">
      <div class="groupName">
        <i class="fa fa-users"></i>{{ targetGroup.roleName }}</div>
      <ul class="userList">
        <li v-for='(user, index) in targetGroupUser' :key='user.userID'>
          <i class="fa fa-user"></i>{{ user.userName }}
          <span class="fa fa-times-circle" @click='removeGroupUser(user, index)'></span>
        </li>

      </ul>
      <div class="selectAll" @click='removeAllGroupUser'>全部移除</div>
    </div>

    <div class="btnDiv">
      <button type="button" class="btn btn-sm btn-info" @click="submitForm()">确定</button>
      <button type="button" class="btn btn-sm btn-default" @click="(() => $emit('close', 1))">取消</button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { GET_USER_INFO } from 'store/getters/type'
import tree from '../structureTree/index.vue'
const labels = {
  defaultId: 'OrganizationID',
  treeName: 'OrgName'
}
export default {
  props: {
    targetGroup: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO,
      pageData: 'pageData',
      updateState: 'updateState',
      TreeData: 'TreeData'
    })
  },
  data () {
    return {
      OrgUrl: 'Organization/TreeRoot/' + this.$store.state.user_info.user.OrganizationID,
      labels,
      ungroupedUser: [], //  每个组织机构对应未分组的用户
      targetGroupUser: [], // 已分组的用户
      userData: {
        OrganizationID: ''
      },
      fuzzyQuery: '',
      targetMenu: {},
      self: this
    }
  },
  watch: {
    'updateState': function () {
      if (this.updateState === 1) {
        this.refresh()
      } else if (this.updateState === 2) {
        this.refresh()
        this.$refs.tree.refresh(this.targetMenu)
      }
      this.$store.state.updateState = 0
    },
    'TreeData': {
      handler: function (data) {
        this.initParentID = null
        this.targetMenu = data
        this.orgData = data
        this.orgData.OrganizationID = data.OrganizationID
        this.$nextTick(function () {
          this.refresh()
        })
      },
      deep: true
    }
  },
  components: {
    tree
  },
  created () {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight
      $('.popUpbig').css('height', documentHeight * 0.8 + 'px')
      $('.popUpbig').css('top', documentHeight * 0.5 + 'px')
      $('.selectedMember').css('height', documentHeight * 0.8 - 89 + 'px !important')
      this.initTargetGoupUser()
    })
  },
  methods: {
    ...mapActions([
      'update'
    ]),
    //  查询当前用户组下的用户数据
    initTargetGoupUser () {
      this.$ajax.post('User/List', { roleID: this.targetGroup.roleID })
        .then((res) => {
          if (res.data.code === 1) {
            let result = res.data.result
            this.targetGroupUser = result
          }
        })
    },
    //  获取默认选中组织机构下的用户
    initDatas (data) {
      if (!this.targetMenu.hasOwnProperty('OrganizationID') && data) {
        this.targetMenu = data
        this.refresh()
      }
    },
    // 获取默认组织机构下面的用户数据
    refresh (fuzzyQuery) {
      let request
      if (!fuzzyQuery) {
        request = {
          OrganizationID: this.targetMenu.OrganizationID
        }
      } else {
        request = {
          userName: fuzzyQuery
        }
      }

      this.$ajax.post('User/List', request)
        .then((res) => {
          if (res.data.code === 1) {
            let result = res.data.result
            result.forEach((r, i) => {    // 为ungroupedUser添加勾选属性
              r.selected = false
            })
            this.ungroupedUser = result
          }
        })
    },
    // 未分组单个勾选事件
    checkUngroupedUser (item) {
      // 判断已分组的数组中，是否有当前勾选用户
      if (item.selected) { // 已勾选勾选
        item.selected = false
      } else { // 未勾选
        let isreal = this.targetGroupUser.every((t, i) => {
          if (t.userID === item.userID) {
            return false
          }
          return true
        })
        if (isreal) {  // 不存在
          item.selected = false
          this.targetGroupUser.push(item)
          item.selected = true
        }
      }

    },
    // 未分组全部勾选事件
    checkAllUngroupedUser () {
      if (this.ungroupedUser.length == 0) {
        return
      } else {
        if (this.targetGroupUser.length == 0) {
          this.targetGroupUser = Object.assign([], this.ungroupedUser)
        } else {
          this.ungroupedUser.forEach((u, i) => {
            let isreal = this.targetGroupUser.every((t, i) => {
              if (t.userID === u.userID) {
                return false
              }
              return true
            })
            if (isreal) {
              this.targetGroupUser.push(u)
            }
          })
        }
      }
    },
    // 删除单个已分组用户
    removeGroupUser (user, index) {
      this.targetGroupUser.splice(index, 1)
    },
    // 移除全部已分组用户
    removeAllGroupUser () {
      this.targetGroupUser = []
    },
    submitForm () {
      this.targetGroupUser.forEach((t) => {
        t.roleID = this.targetGroup.roleID
      })
      this.$ajax.post('Role/addUserRoles', this.targetGroupUser)
        .then((res) => {
          if (res.data.code === 1) {
            this.$store.dispatch('update', 1)
            this.removeAllGroupUser()
          }
        })
    }
  }
}
</script>

