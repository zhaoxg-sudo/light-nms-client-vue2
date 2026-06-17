<template>
  <div class="content">
    <div class="groupList">
      <div class="menuType">
        <i class="fa fa-list-ul" aria-hidden="true"></i>组织机构
      </div>
      <tree :addr="OrgUrl" ref="tree" :lable="labels" @setInitData="initDatas"></tree>
    </div>
    <div class="singleDevice">
      <div class="tableTool">
        <div class="operate">
          <button type="primary" class="btn btn-sm btn-info" @click="openModal(0)">
            新增机构
          </button>
          <!--<button type="danger" class="btn btn-sm btn-info" :disabled="batch_select.length === 0">
            <i class="fa fa-search" aria-hidden="true"></i>批量删除
          </button>-->
        </div>
      </div>
      <div class="table">
        <table class="table">
          <thead>
            <tr>
              <td>所属机构</td>
              <td>机构编码</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody v-if="dataAll.length != 0">
            <tr v-for='data in dataAll' :key='data.OrganizationID'>
              <td>{{ data.OrgName }}</td>
              <td>{{ data.OrgCode }}</td>
              <td width="170">
                <button type="button" class="btn btn-sm btn-info" @click="openModal(data.OrganizationID)">修改</button>
                <button type="button" class="btn btn-sm btn-default" @click="deleteItems(self, 'Organization/Remove', data)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="dialogFormVisible">
        <modal :orgData="orgData" :modalType='modalType'></modal>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import tree from '../structureTree/index.vue'
import modal from './modal.vue'
import { GET_USER_INFO } from 'store/getters/type'
const labels = {
  defaultId: 'OrganizationID',
  treeName: 'OrgName'
}
export default {
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO,
      dialogFormVisible: 'dialogFormVisible',
      updateState: 'updateState',
      TreeData: 'TreeData'
    })
  },
  data () {
    return {
      labels,
      modalType: null,
      dataAll: [],
      orgData: {},
      self: this,
      OrgUrl: '',
      targetMenu: {}
    }
  },
  components: {
    modal,
    tree
  },
  created () {
    this.OrgUrl = `Organization/TreeRoot/${this.get_user_info.user.OrganizationID}`
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
        this.parentID = data.OrganizationID
        this.targetMenu = data
        this.orgData = data
        this.$nextTick(function () {
          this.refresh()
        })
      },
      deep: true
    }
  },
  methods: {
    // 组织机构树初始化
    initDatas (data) {
      if (!this.targetMenu.hasOwnProperty('OrganizationID') && data) {
        this.parentID = data.OrganizationID
        this.orgData = data
        this.refresh()
      }
    },
    // 渲染表格数据
    refresh () {
      this.$ajax.get(`Organization/TreeItem/${this.orgData.OrganizationID}`)
        .then((res) => {
          if (res.data.code === 1) {
            let result = res.data.result
            this.dataAll = result
          }
        })
    },
    // 打开编辑框
    openModal (id) {
      this.$store.state.dialogFormVisible = true
      if (id === 0) { // 新增
        this.modalType = 0
      } else {
        this.modalType = 1
        this.orgData.orgId = id
      }
    }
/*     close () {
      if (this.dialogFormVisible) {
        this.$store.state.dialogFormVisible = false
        this.$refs.tree.refresh(this.targetMenu)
        this.refresh();
      }
    } */
  }
}
</script>
