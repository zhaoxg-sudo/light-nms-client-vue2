<template>
  <!--修改or新增用户组-->
  <div>
    <div class="popUpbig" STYLE="display: block">
      <div class="popContent">
        <el-form ref="formData" :model="formData" :rules="rules">
          <div class="menuChoose">
            <h5>
              <i class="fa fa-user-plus"></i>
            </h5>
            <div class="row">
              <div class="col-md-7">
                <div class="form-group">
                  <label class="col-sm-2 control-label">用户组名</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" v-model="formData.roleName">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="menuChoose">
            <h5>
              <i class="fa fa-address-card"></i>菜单权限</h5>
            <ol class="menuItem clearfix">
              <li v-for="item in menuList" :key="item.path" :class="{'selected':item.selected}" @click="selectMenu(item)">
                {{item.name}}
              </li>
            </ol>
          </div> -->
          <div class="menuChoose">
            <h5>
              <i class="fa fa-clipboard"></i>设备组权限</h5>
            <div class="row">
              <div class="col-md-6">
                <div class="subItemTitle">
                  设备组列表
                  <label class="checkbox-inline">
                    <input type="checkbox" id="inlineCheckbox1" v-model="isCheckedAll" @click="checkedAll"> 全选
                  </label>
                </div>
                <ol class="menuItem clearfix">
                  <li v-for="item in deviceGroup" :class="{'selected':item.selected}" :key="item.deviceGroupId" @click="selectDeviceGroup(item)">
                    {{item.name}}
                  </li>
                </ol>
              </div>
              <div class="col-md-6">
                <div class="subItemTitle">
                  已选设备分组列表
                  <button type="button" class="btn btn-sm btn-danger" @click="(() => {formData.selectDeviceGroup = []})">全部移除</button>
                </div>
                <ol class="menuItem clearfix">
                  <li v-for="item in formData.selectDeviceGroup" :key="item.deviceGroupId">{{ item.name}}</li>
                </ol>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="btnDiv">
        <button type="submit" class="btn btn-sm btn-info" @click="submitFrom">确定</button>
        <button type="submit" class="btn btn-sm btn-default" @click="close">取消</button>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { GET_USER_INFO } from 'store/getters/type'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    targetGroup: {
      type: Object,
      required: true
    },
    modolType: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      dialogFormVisible: 'dialogFormVisible',
      get_user_info: GET_USER_INFO
    })
  },
  data () {
    return {
      self: this,
      rules: {
        TempName: [{ required: true, message: '用户组名称不能为空' }, { validator: this.defenseSQL }]
      },
      deviceGroup: [],
      menuList: [],
      isCheckedAll: false,
      formData: {
        selectDeviceGroup: [],
        selectMenuList: [],
        roleName: ''
      }
    }
  },
  created () {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight
      $('.popUpbig').css('height', documentHeight * 0.5 + 'px')
      $('.popUpbig').css('top', documentHeight * 0.4 + 'px')
      $('.selectedMember').css('height', documentHeight * 0.8 - 89 + 'px !important')
      this.initData()
    })
  },
  methods: {
    ...mapActions([
      'update'
    ]),
    initData () {
      // 获取所有菜单数据
      let menuList = this.$router.options.routes[2].children
      menuList.forEach((m) => {
        m.selected = false
      })
      this.menuList = menuList

      // 获取所有设备组数据
      this.$ajax.post('DeviceGroup/List')
        .then(res => {
          if (res.data.code === 1) {
            let result = res.data.result
            result.forEach((r) => {
              r.selected = false
            })
            this.deviceGroup = result
            this.refresh()
          }
        })
    },
    refresh () {
      if (this.modolType !== 0) {
        this.$ajax.get(`Role/Detail/${this.targetGroup.roleID}`)
          .then((res) => {
            if (res.data.code === 1) {
              let result = res.data.result
              this.formData = Object.assign(this.formData, result)
            }
          })
        this.$ajax.get(`Role/getDeviceGroup/${this.targetGroup.roleID}`)
          .then((res) => {
            if (res.data.code === 1) {
              let result = res.data.result
              this.deviceGroup.forEach((d, i) => {
                result.map((r, s) => {
                  if (d.deviceGroupId === r.deviceGroupId) {
                    d.selected = true
                  }
                })
              })
              this.formData.selectDeviceGroup = result
            }
          })
      }
    },
    selectDeviceGroup (item) {
      if (!item.selected) {
        let isreal = this.formData.selectDeviceGroup.every((s, i) => {
          if (s.deviceGroupId === item.deviceGroupId) {
            return false
          }
          return true
        })
        if (isreal) {
          this.formData.selectDeviceGroup.push(item)
        }
      }
      item.selected = !item.selected
    },
    selectMenu (item) {
      if (!item.selected) {
        this.formData.selectMenuList.push(item)
      }
      item.selected = !item.selected
    },
    checkedAll () {
      this.isCheckedAll = !this.isCheckedAll
      this.deviceGroup.forEach((d) => {
        d.selected = this.isCheckedAll
      })
      this.formData.selectDeviceGroup = this.formData.selectDeviceGroup.concat(this.deviceGroup)
    },
    close () {
      this.$emit('close')
    },
    submitFrom () {  // 提交当前表单
      let request = {
        roleName: this.formData.roleName,
        childData: false
      }
      this.$ajax.post('Role/Create', request)
        .then(res => {
          if (res.data.code === 1) {
            let result = res.data.result
            if (this.formData.selectDeviceGroup.length !== 0) {
              this.$ajax.post(`Role/opRoleDevice/${result.roleID}`, this.formData.selectDeviceGroup)
                .then(res => {
                  if (res.data.code === 1) {
                    this.close()
                  }
                })
            }
          }
        })
    }
  }
}
</script>
