<template>
  <div>
    <!-- <h3>电源参数设置</h3> -->
    <div class="popUpSet" style="display: block;">
    <div class="popContent">
      <el-form class="form-horizontal" :v-model="upData" ref="upData" :rules="rules">
        <div class="row">
           <div class="menuType">
             <i class="fa fa-list-ul" aria-hidden="true"></i>电源参数设定
           </div>
           <br>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">设定输出电压</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="powerparameter.setparamv">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">输出电流百分比</label>
              <div class="col-sm-6">
                <input type="text"  class="form-control" v-model="powerparameter.setparamampercetage">
              </div>
            </div>
          </div>
          <div class="col-md-6" >
            <div class="form-group">
              <label class="col-sm-6 control-label">自动均流开关</label>
              <div class="col-sm-6">
                 <label class="radio-inline">
                  <input type="radio" value="55" v-model="powerparameter.setshareamflag">开启
                </label>
                <label class="radio-inline">
                  <input type="radio" value="aa" v-model="powerparameter.setshareamflag">关闭
                </label>
              </div>
            </div>
          </div>
          <div class="col-md-6" >
            <div class="form-group">
              <label class="col-sm-6 control-label">自动开机开关</label>
              <div class="col-sm-6">
                 <label class="radio-inline">
                  <input type="radio" value="55" v-model="powerparameter.setautopoweronflag">开启
                </label>
                <label class="radio-inline">
                  <input type="radio" value="aa" v-model="powerparameter.setautopoweronflag">关闭
                </label>
              </div>
            </div>
          </div>
          <div class="col-md-6" >
            <div class="form-group">
              <label class="col-sm-6 control-label">子模块额定功率</label>
              <div class="col-sm-6">
                 <label class="radio-inline">
                  <input type="radio" value="01" v-model="powerparameter.setsubratedkw">20KW
                </label>
                <label class="radio-inline">
                  <input type="radio" value="02" v-model="powerparameter.setsubratedkw">15KW
                </label>
                 <label class="radio-inline">
                  <input type="radio" value="03" v-model="powerparameter.setsubratedkw">10KW
                </label>
                <label class="radio-inline">
                  <input type="radio" value="04" v-model="powerparameter.setsubratedkw">7.5KW
                </label>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">读取操作次数</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="powerparameter.index">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6" v-if="upData.type==6">
            <div class="form-group">
              <label class="col-sm-6 control-label">设备类型</label>
              <div class="col-sm-6">
                <label class="radio-inline">
                  <input type="radio" value="1" v-model="upData.type">直流电源
                </label>
                <label class="radio-inline">
                  <input type="radio" value="2" v-model="upData.type">交流电源
                </label>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btnDiv">
      <button type="button" class="btn btn-sm btn-info" @click="readParam">读取参数</button>
      <button type="button" class="btn btn-sm btn-info" @click="downloadParam">下发参数</button>
      <button type="button" class="btn btn-sm btn-default" @click="close">取消</button>
    </div>
  </div>
  </div>
</template>
<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'

export default {
  name: '',
  components: {},
  props: {
    modolType: {type: Number},
    powerparameter: {type: Object}
  },
  data () {
    return {
      upData: {
        setparamv: '2300',
        setparamampercetage: '55%',
        setshareamflag: '55',
        setautopoweronflag: 'aa',
        setsubratedkw: '03',
        type: 0
      },
      setvalue: '',
      setoption: [
        {text: '20KW', value: '20KW'},
        {text: '15KW', value: '15KW'},
        {text: '10KW', value: '10KW'},
        {text: '7.5KW', value: '7.5KW'}
      ],
      rules: {},
      self: this,
      range: '',
      temSetParam: {}
    }
  },
  computed: {
    ...mapGetters({
    })
  },
  watch: {
  },
  created () {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight
      $('.popUp').css('top', documentHeight * 0.8 + 'px')
    })
  },
  beforeMount () {},
  mounted () {},
  methods: {
    readParam () {
      this.$emit('getParam')
      console.log('子组件发送刷新设置参数请求')
    },
    downloadParam () {
      console.log(this.powerparameter)
      let downloadParam
      downloadParam = this.powerparameter
      this.$emit('setParam', downloadParam)
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang='' scoped>
</style>
