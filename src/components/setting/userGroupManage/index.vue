<template>
  <!--用户组管理-->
  <div>
    <div>
      <div class="groupList">
        <div class="menuType">
          <i class="fa fa-list-ul" aria-hidden="true"></i>用户组列表
          <p @click="openModal(0)">
            <i class="fa fa-plus" aria-hidden="true"></i>
          </p>
        </div>
        <form>
          <input type="text" class="form-control form-lighter" placeholder="快速查找组" />
        </form>
        <ul id="height01" class="devGroup">
          <li v-for="item in groupList" :key='item.roleID' :class="[ (targetGroup.roleID && item.roleID == targetGroup.roleID) ? 'selected' : '' ]">
            <p @click="queryTable(item)">{{item.roleName}}</p>
            <ul>
              <li @click="openModal(item)">
                <i class="fa fa-edit"></i>
              </li>
              <li @click="deleteItems(item)">
                <i class="fa fa-times"></i>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="singleDevice">
        <div class="tableTool">
          <div class="operate">
            <button type="submit" class="btn btn-info" @click="(() => {dialog = true})">
              <i class="fa fa-search" aria-hidden="true"></i>用户分组
            </button>
            <!--<button type="submit" class="btn btn-info">
            <i class="fa fa-search" aria-hidden="true"></i>批量删除
          </button>-->
          </div>
        </div>
        <div class="table">
          <table class="table">
            <thead>
              <tr>
                <td>用户名</td>
                <td>所属机构</td>
                <td>操作</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in dataAll" :key='item.userID'>
                <td>{{item.userName}}</td>
                <td>{{item.orgName}}</td>
                <td width="170">
                  <button type="button" class="btn btn-sm btn-info">移动到</button>
                  <button type="button" class="btn btn-sm btn-default" @click="deleteGroupUser(item)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="modolType != null">
      <modal :targetGroup='targetGroup' :modolType="modolType" @close="close"></modal>

    </div>
    <div v-if="dialog">
      <edit @close="close" :targetGroup='targetGroup'></edit>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { GET_USER_INFO } from 'store/getters/type'
import paging from "../paging/index.vue"
import edit from './edit.vue'
import modal from './modal.vue'
import {getHeights} from 'utils/page/setting'
export default {
  computed: {
    ...mapGetters({
      dialogFormVisible: 'dialogFormVisible',
      get_user_info: GET_USER_INFO,
      pageData: 'pageData',
      updateState: 'updateState'
    })
  },
  data () {
    return {
      groupList: [],
      targetGroup: '',
      dataAll: [],
      TempGroup: {},
      userData: {},
      orgData: {
        pid: 0,
        OrganizationID: this.$store.state.user_info.user.OrganizationID,
        orgId: '',
        DepartmentID: '',
        TempGroupID: ''
      },
      modolType: null,
      //请求时的loading效果
      loading: true,
      dialog: false,
      dialogShow: false,
      //批量选择数组
      batch_select: [],
      self: this,
    }
  },
  watch: {
    'pageData.pageSize': function () {
      this.refresh()
    },
    'pageData.pageIndex': function () {
      this.refresh()
    },
    'updateState': function () {
      if (this.updateState === 1) {
        this.refresh()
      } else if (this.updateState === 2) {
        this.refresh()
        this.$refs.tree.refresh(this.targetMenu)
      }
      this.$store.state.updateState = 0
    }
  },
  components: {
    edit,
    modal,
    paging
  },
  created () {
    this.initData()
    this.$nextTick(()=> {
     this.refresh()
     getHeights()
    })
  },
  methods: {
    openModal (id) { //  编辑或新增用户组
      if (id === 0) {
        this.modolType = 0
      } else {
        this.modolType = 1
        this.targetGroup = id
      }
    },
    initData () {
      this.$ajax.post(`Role/List`)
        .then((res) => {
          if (res.data.code === 1) {
            this.groupList = res.data.result
            this.targetGroup = res.data.result[0]
            this.refresh()
          }
        })
    },
    // 获取数据
    refresh (item) {
      let request = {
        roleID: item ? item.roleID : this.targetGroup.roleID
      }
      this.$ajax.post('User/List', request)
        .then((res) => {
          if (res.data.code === 1) {
            this.dataAll = res.data.result
          }
        })
    },
    queryTable (item) {
      this.targetGroup = item
      this.refresh(item)
    },
    close (type) {
      if (type === 1) {
        this.dialog = false
      } else {
        this.modolType = null
      }
    },
    deleteItems (item) {
      this.$ajax.delete(`Role/Remove/${item.roleID}`)
        .then(res => {
          if (res.data.code === 1) {
            this.initData()
          }
        })
    },
    deleteGroupUser (item) {
      this.$ajax.post('User/EditRelation', item)
        .then(res => {
          if (res.data.code === 1) {
            this.initData()
          }
        })
    }
  }
}
</script>
roleID
