<template>
  <!--设备信息新增-->
  <div class="popUp" style="display: block;">
    <div class="popContent">
      <el-form class="form-horizontal" :model="formData" ref="formData" :rules="rules">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">设备号</label>
              <div class="col-sm-8">
                <input type="text" placeholder="1000-1100" class="form-control" v-model="formData.deviceCode">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">添加范围</label>
              <div class="col-sm-8">
                <input type="text" placeholder="添加设备时填写，默认为1" class="form-control" v-model="range">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">设备名称</label>
              <div class="col-sm-8">
                <input type="text" placeholder="" class="form-control" v-model="formData.deviceName">
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
              <label class="col-sm-4 control-label">设备类型</label>
              <div class="col-sm-8">
                <label class="radio-inline">
                  <input type="radio" value="0" v-model="formData.type">单话机

                </label>
                <label class="radio-inline">
                  <input type="radio" value="1" v-model="formData.type">视频终端
                </label>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btnDiv">
      <button type="button" class="btn btn-sm btn-info" @click="userEdit"
      >确定</button>
      <button type="button" class="btn btn-sm btn-default" @click="close">取消</button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapActions } from 'vuex'
export default {
  props: {
    modolType:{type:Number},
    transferdata:{type:Object}
  },
  data () {
    return {
      formData: {
        devicecode: '',
        devicename: '',
	password:'',
        type: 0,
        devicevedios: [{ vedioUrl: '' }, { vedioUrl: '' }, { vedioUrl: '' }, { vedioUrl: '' }],
        feature:{ organizationid :  this.transferdata.targetMenuId }

      },
      rules: {},
      self: this,
      range:1,
    }
  },
  created () {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight
      $('.popUp').css('top', documentHeight * 0.3 + 'px')
      if (this.modolType === -2) {
        this.$ajax.get(`Device/Detail/${this.transferdata.deviceid}`)
          .then(res => {
            if (res.data.code === 1) {
              this.formData = res.data.result
              this.formData.feature.organizationid = this.transferdata.targetMenuId
              /*this.$ajax.get(`Feature/Detail/${this.transferdata.deviceid}`)
              .then(res => {
                  if (res.data.code === 1) {
                    this.formData.feature.organizationid = res.data.result.organizationid
                  }
              })*/
            }
          })
      }
    })
  },
  methods: {
    ...mapActions([
      'update'
    ]),
    close () {
      this.$emit('close')
    },
    userEdit () {
       if (this.modolType!=-2) {
       let axios = []
       for(let i = 0;i < parseInt(this.range);i++){
        temp = new Object()
        temp.deviceCode = String(parseInt(this.formData.devicecode)+i)
        deviceName = this.formData.devicename
	password = this.formData.password
        type = this.formData.type
        deviceVedios = this.formData.devicevedios
        feature = this.formData.feature
        axios.push(this.$ajax.post('Device/Create',temp))
       }
       this.$ajax.all(axios).then(res => {
         console.log(res)
       })
    }
    else{
        let request = Object.assign(this.formData,{deviceId:this.transferdata.deviceid})
        this.$ajax.put(`Device/Edit`,request)
          .then(res => {
            if (res.data.code === 1) {
              console.log(修改成功)
            }
          })
      }
    },
  }
}
</script>
