<template>
  <!--新增用户-->
  <div class="popUp">
    <div class="popContent">
      <el-form class="form-horizontal" :model="formData" ref="formData" :rules="rules">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">用户名</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model="formData.userName">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">密码</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model="formData.password">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">用户级别</label>
              <div class="col-sm-8">
                <label class="radio-inline">
                  <input type="radio" value="0" v-model="formData.type">管理员
                </label>
                <label class="radio-inline">
                  <input type="radio" value="1" v-model="formData.type">操作员
                </label>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btnDiv">
      <button type="button" class="btn btn-sm btn-info" @click="submitForm(self, modolType, 'user/useradd', 'user/useredit', formData,1); refresh()">确定</button>
      <button type="button" class="btn btn-sm btn-default" @click="close">取消</button>
    </div>
  </div>
</template>

<script type="text/javascript">
import $ from 'jquery'
export default {
  props: {
    targetMenu: {
      type: Object,
      required: true
    },
    modolType: {
      type: Number,
      required: true
    },
    targetUserGroupId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      self: this,
      formData: {
        userName: '',
        password: '',
        type: 0,
        userOrg: '',
        userRoles: []
      },
      groupList: [],
      rules: {
        userName: [{required: true, message: '用户名不能为空'}, {validator: this.defenseSQL}],
        userPassword: [{required: true, message: '密码不能为空'}, {validator: this.defenseSQL}]
      }
    }
  },
  created () {
    let documentHeight = document.documentElement.clientHeight
    $('.popUp').css('top', documentHeight * 0.3 + 'px')
    let userroleid = this.targetUserGroupId
    this.formData.userRoles = [{roleID: userroleid}]
    if (this.modolType === 0) { // 如果为新增，拿到当前的组织机构ID
      console.log('modal.vue of this.targetMenu', this.targetMenu)
      this.formData.userOrg = this.targetMenu.catalogid
    } else { // 如果为编辑，拿到当前的用户的userId
      this.$ajax.get(`User/Detail/${this.targetMenu.userid}`)
        .then((res) => {
          if (res.data.code === 1) {
            let result = res.data.result
            this.formData = result
          }
        })
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    refresh () {
      this.$emit('refresh')
    }
  }
}
</script>
