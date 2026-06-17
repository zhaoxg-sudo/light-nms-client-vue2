<template>
  <div class="content">
    <div v-if="modolType!=null && modolType >=0 ">
      <modal :targetUserGroupId="targetUserGroupId" :targetMenu="targetMenu" :modolType='modolType' @close="closeModal" @refresh="refreshUser"></modal>
    </div>
    <div class="groupList">
      <div class="menuType">
        <i class="fa fa-list-ul" aria-hidden="true"></i>远程供电设备列表
        <span><button type="button" class="btn btn-sm btn-info" @click="changeStatus">修改</button></span>
      </div>
      <tree :stationStatus="stationStatus"></tree>
    </div>
    <params :targetMenu="targetMenu" v-if="time_show" @close = "closeTimeMessage"></params>
    <div class="singleDevice">
      <div class="table">
        <!-- <h5> 工作参数 </h5> -->
        <table class="table">
         <caption>
        </caption>
          <thead>
            <tr>
              <!-- <td>默认电源站点
                <button type="button" class="btn btn-sm btn-info default-center"  @click = "enable_default_center==true?editDefaultCenter():setDefaultCenterState(true)" > {{enable_default_center==true?"修改默认电源站点":"启用默认模式"}}</button>
                <button type="button" v-if = "enable_default_center"  class="btn btn-sm btn-info default-center"  @click = "setDefaultCenterState(false)" > {{"关闭默认模式"}}</button>
              </td> -->
              <td>刷新时间
                <button type="button" class="btn btn-sm btn-info alarm_control"  @click = "changeTimeMessage()" > 刷新时间设置</button>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
               <!-- <td  :contenteditable = "defaultcenter_contenteditable" @blur="editDefaultCenterFinished($event)" @keydown.13 = "editDefaultCenterFinished($event)" v-focus = "editdefaultcenter"   >{{defaultCenter}}</td> -->
              <td>{{refreshtime}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table">
        <!-- <h5> 用户 </h5> -->
        <span style="float:right"><button type="submit" class="btn btn-sm btn-info" @click="openModal(1 ,0)">新增用户</button></span>
        <table class="table">
          <caption>
          </caption>
          <thead>
            <tr>
              <td>用户名</td>
              <td>用户类型</td>
              <td>所属站点ID</td>
              <td>创建时间</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in dataAll"  :key = "data.userid" >
              <td>{{ data.username }}</td>
              <td>{{ showusertype(data.usertype) }}</td>
              <td>{{ data.userorg }}</td>
              <td>{{ data.createdat }}</td>
              <td width="170">
                <!-- <button type="button" class="btn btn-sm btn-info" @click="openModal( 1 ,data.userid)">修改</button> -->
                <button type="button" class="btn btn-sm btn-default" @click="deleteUser(data.username)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
       <div class="middleCon">
         <topo ></topo>
       </div>
  </div>
</template>
<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'
import tree from '../structureTree/index.vue'
import topo from '../../topo/topo-edit.vue'
// import paging from '../paging/index.vue'
import modal from './modal.vue'
import params from './default.vue'
// import {getHeights} from 'utils/page/setting'
// import { GET_USER_INFO } from 'store/getters/type'
export default {
  directives: {
    focus: {
      update: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      // get_user_info: GET_USER_INFO,
      updateState: 'updateState',
      TreeData: 'TreeData'
    })
  },
  data () {
    return {
      alarm: '',
      refreshtime: 5,
      defaultshow: 1,
      defaultshowenabled: true,
      time_show: false,
      stationStatus: 'show',
      showDeviceList: false,
      selectUser: [],
      dataAll: [],
      deviceGroups: [],
      targetMenu: {},
      self: this,
      modolType: null,
      topoType: 0,
      targetUserGroup: null,
      allDevices: [],
      targetUserGroupId: '',
      transferdata: {deviceId: '', targetMenuId: ''},
      enable_default_center: '',
      defaultCenter: '默认',
      defaultcenter_contenteditable: false,
      editdefaultcenter: false,
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  watch: {
    'TreeData': {
      handler: function (data) {
        this.targetMenu = data
        this.transferdata.targetMenuId = data.catalogid
        this.targetUserGroup = data.orgname
        this.modolType = null
        console.log('edit刷新用户数据.......')
        this.instance({
          'url': '/user/' + this.targetMenu.catalogid,
          'method': 'get'
        }).then((res) => {
          console.log('\nget user by catalogid:', this.targetMenu.catalogid)
          console.log(res.data)
          if (res.data.code === 1) {
            this.dataAll = res.data.result
          } else this.dataAll = {}
        })
        this.$nextTick(function () {
          // this.refresh()
        })
      },
      deep: true
    },
    'updateState': function (e) {
      console.log('update changed :', e)
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
    tree,
    modal,
    topo,
    params
  },
  created () {
    this.targetMenu = this.TreeData
    // if (!this.targetMenu.hasOwnProperty('catalogid')) {
    //   this.targetMenu = { catalogid: 'b202669251a046bbbc727ff3fb25f9f4' }
    // }
    this.targetUserGroup = this.$store.state.user_info.userOrg
    this.$nextTick(() => {
      this.refresh()
      this.getHeights()
    })
  },
  methods: { // 组织机构树默认选中
    editDefaultCenter () {
      this.defaultcenter_contenteditable = true
      this.editdefaultcenter = true
    },
    editDefaultCenterFinished (event) {
      this.defaultcenter_contenteditable = false
      event.target.textContent = event.target.textContent.trim()
      let text = event.target.textContent
      if (isNaN(Number(text))) {
        this.$message.success('输入格式错误，请重新输入')
      } else {
        this.editdefaultcenter = false
        this.defaultCenter = text
        this.$message.success('默认电源站点修改正确')
        console.log('默认电源站点修改为:', text)
        this.defaultshow = text
        // 更新default数据库
        let defaultP = {}
        defaultP.catalogid = 1
        defaultP.defaultshowenabled = true
        defaultP.defaultshow = this.defaultshow
        defaultP.refreshtime = this.refreshtime
        this.updateDefaultDB(defaultP)
      }
    },
    updateDefaultDB (d) {
      let defaultP = {}
      defaultP.catalogid = d.catalogid
      defaultP.defaultshowenabled = d.defaultshowenabled
      defaultP.defaultshow = d.defaultshow
      defaultP.refreshtime = d.refreshtime
      this.instance({
        url: '/default/update',
        method: 'post',
        data: defaultP
      })
        .then((res) => {
          if (res.data.code === 1) {
            this.$message.success('更新成功')
          } else {
            this.$message.success('更新失败，请检查数据库')
          }
        })
    },
    setDefaultCenterState (state) {
      this.enable_default_center = state
      let defaultP = {}
      defaultP.catalogid = 1
      defaultP.defaultshowenabled = this.enable_default_center
      defaultP.defaultshow = this.defaultshow
      defaultP.refreshtime = this.refreshtime
      this.updateDefaultDB(defaultP)
    },
    showusertype (type) {
      let typeReturn = '未知'
      switch (type) {
        case '0' :
          typeReturn = '管理员'
          break
        case '1' :
          typeReturn = '操作员'
          break
      }
      return typeReturn
    },
    closeTimeMessage () {
      this.time_show = false
      this.refresh()
    },
    changeTimeMessage () {
      this.time_show = true
    },
    // 渲染表格数据
    refresh () {
      console.log('refresh刷新用户数据.......')
      this.instance({
        'url': '/user/' + this.targetMenu.catalogid,
        'method': 'get'
      }).then((res) => {
        console.log('\nget user by orgid:', this.targetMenu.catalogid)
        console.log(res.data)
        if (res.data.code === 1) {
          this.dataAll = res.data.result
        } else this.dataAll = {}
      })
      // 刷新工作参数
      console.log('refresh刷新default工作参数.......')
      this.instance({
        url: '/default/get/' + '1',
        method: 'get'
      })
        .then((res) => {
          if (res.data.length > 0) {
            console.log('default/get=:', res.data)
            this.defaultshowenabled = res.data[0].defaultshowenabled
            this.defaultshow = res.data[0].defaultshow
            this.refreshtime = res.data[0].refreshtime
          //   this.defaultCenter = this.defaultshow
          //   this.enable_default_center = this.defaultshowenabled
          //   console.log('this.enable_default_center', this.enable_default_center)
          }
        })
    },
    openModal (status, id) {
      // 编辑或新增
      if (status === 1) {
        if (id === 0) {
          this.modolType = 0
        } else {
          this.modolType = 1
          this.targetMenu.userid = id
        }
      }
      if (status === -1) {
        if (id === 0) {
          this.modolType = -1
        } else {
          this.modolType = -2
          this.transferdata.deviceid = id
        }
      }
    },
    refreshUser () {
      console.log('更新用户操作后........')
      setTimeout(() => {
        this.refresh()
      }, 1000)
    },
    closeModal () {
      console.log('取消了用户操作界面........')
      this.modolType = null
    },
    deleteUser (username) {
      let userName = {}
      userName.username = username
      this.instance({
        'url': '/user/userdel',
        data: userName,
        'method': 'post'
      }).then((res) => {
        // console.log(res.data)
        if (res.data.code === 1) {
          console.log('\ndel user by username is ok:', username)
          this.refresh()
        }
      })
    },
    open () {
      this.showDeviceList = true
      $('.singleDevice').removeClass('moveRightMiddle').addClass('moveLeftMiddle')
      $('.allDevice').removeClass('moveRightDev').addClass('moveLeftDev')
    },
    close () {
      this.showDeviceList = false
      $('.singleDevice').removeClass('moveLeftMiddle').addClass('moveRightMiddle')
      $('.allDevice').removeClass('moveLeftDev').addClass('moveRightDev')
    },
    changeStatus () {
      if (this.stationStatus === 'show') {
        this.stationStatus = 'change'
      } else {
        this.stationStatus = 'show'
      }
      console.log('userManager.vue now update status =', this.stationStatus)
    },
    getHeights () {
      //  高度判断
      var windowHeight = $(window).height()
      $('.content').height(windowHeight - 120)
      $('.middleCon').css('marginLeft', '251px')
      // var maxHeight = windowHeight - $('.sysName').outerHeight()
      // var contentHeight = $('.content').outerHeight()
    }
  }
}

</script>
<style  scoped>
.default-center{
  margin-left: 5px;
}
</style>
