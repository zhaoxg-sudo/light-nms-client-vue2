<template>
  <!--站点新增-->
  <div class="popUp" style="display: block;">
    <div class="popContent">
      <el-form class="form-horizontal" :model="upData" ref="upData" :rules="rules">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">站点ID</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="upData.catalogid" style="width:130px;">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">父节点</label>
              <div class="col-sm-6">
                <input type="text"  class="form-control" v-model="parentID" :disabled="true" style="width:130px;">
              </div>
            </div>
          </div>
          <div class="col-md-6" >
            <div class="form-group">
              <label class="col-sm-6 control-label">站点名称</label>
              <div class="col-sm-6">
                <input type="text" placeholder="" class="form-control" v-model="upData.label" style="width:130px;">
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="upData.stationtype!=0">
            <div class="form-group">
              <label class="col-sm-6 control-label">协议类型</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="upData.protocoltype" style="width:130px;">
              </div>
            </div>
          </div>
          <!-- <div class="col-md-6 control-label" v-if="upData.stationtype!=0">
            <div class="form-group">
              <el-form-item  label="IP地址" prop="ipAddress">
                <div class="col-sm-6">
                  <el-input
                  type="text"
                  class="form-control"
                  v-model="upData.ipaddress"
                  placeholder="必填"
                  style="width:130px"
                ></el-input>
                </div>
             </el-form-item>
            </div>
          </div> -->
          <div class="col-md-6" v-if="upData.stationtype!=0" prop="ipAddress">
            <div class="form-group">
              <label class="col-sm-6 control-label">IP地址</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="upData.ipaddress" style="width:130px;">
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="upData.stationtype!=0">
            <div class="form-group">
              <label class="col-sm-6 control-label">IP端口</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="upData.ipport" style="width:130px;">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">站点类型</label>
              <div class="col-sm-6">
                <label class="radio-inline">
                  <input type="radio" value="0" v-model="upData.stationtype">站点组织
                </label>
                <label class="radio-inline">
                  <input type="radio" value="1" v-model="upData.stationtype">电源发生器
                </label>
                <label class="radio-inline">
                  <input type="radio" value="2" v-model="upData.stationtype">电源转换器
                </label>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btnDiv">
      <button type="button" class="btn btn-sm btn-info" @click="stationAdd">确定</button>
      <button type="button" class="btn btn-sm btn-default" @click="close">取消</button>
    </div>
  </div>
</template>

<script type="text/javascript">
import $ from 'jquery'
import { mapActions } from 'vuex'
export default {
  props: {
    changedNode: {type: Object}
  },
  data () {
    return {
      upData: {
        catalogid: '',
        parentid: '',
        label: '',
        stationtype: 0,
        commtype: '',
        protocoltype: '',
        positioninfo: '',
        addinfo: '',
        ipaddress: '',
        ipport: '',
        childrennum: ''
      },
      returnData: {node: null, data: null, addNodeData: null},
      rules: {
        ipAddress: [{
          required: true,
          pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
          message: '填写正确格式的IP地址',
          trigger: 'blur'
        }]
      },
      self: this,
      parentID: ''
    }
  },
  created () {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight
      $('.popUp').css('top', documentHeight * 0.3 + 'px')
      this.parentID = this.changedNode.data.catalogid + this.changedNode.data.label
    })
  },
  methods: {
    ...mapActions([
      'update'
    ]),
    close () {
      this.$message.warning('站点添加取消')
      this.$emit('close')
    },
    stationAdd () {
      this.$message.success('站点添加成功')
      this.returnData.node = this.changedNode.node
      this.returnData.data = this.changedNode.data
      this.upData.parentid = this.changedNode.data.catalogid
      this.returnData.addNodeData = this.upData
      console.log('returnData=', this.returnData)
      this.$emit('append', this.returnData)
    }
  }
}
</script>
