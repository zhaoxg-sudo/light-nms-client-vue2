<template>
  <div>
    <!-- <h3>电源参数设置</h3> -->
    <div class="popUpSet" style="display: block;">
      <div class="popContent">
        <div class="menuType">
          <i class="fa fa-list-ul" aria-hidden="true"></i>控制电源开关机
        </div>
           <div class="table">
      <table class="table">
        <thead>
          <tr>
            <td>槽位</td>
            <td>模块ID</td>
            <td>开关机状态</td>
            <td>开关机操作</td>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="item in onoffparameter" :key="item.slot">
            <td>{{item.slot}}</td>
            <td>{{showChangeOnOffId(item.id)}}</td>
            <td>{{showChangeOnOffStatus(item.status)}}</td>
            <td>
              <input type="checkbox" id="inlineCheckbox" v-model="item.actionselected" @click="actionSeleted(item.slot, item.id, item.status, !item.actionselected)">
              <label for="checkbox">{{ showChangeOnOffActionSelected(item.status) }}</label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      </div>
      <div class="btnDiv">
        <button type="button" class="btn btn-sm btn-info" @click="readParam">读取状态</button>
        <button type="button" class="btn btn-sm btn-info" @click="downloadParam">下发命令</button>
        <button type="button" class="btn btn-sm btn-default" @click="close">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'

export default {
  name: '',
  components: {},
  props: {
    modolType: {type: Number},
    onoffparameter: {type: Array}
  },
  data () {
    return {
      onSelected: '开机',
      rules: {},
      self: this,
      range: '',
      dataAll: [
        {slot: '00', id: 'ff', status: '55', actionselected: false},
        {slot: '01', id: '01', status: '55', actionselected: false}
      ]
    }
  },
  watch: {},
  created () {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight
      $('.popUp').css('top', documentHeight * 0.8 + 'px')
    })
  },
  beforeMount () {},
  mounted () {},
  methods: {
    showChangeOnOffId (e) {
      let show
      show = '00'
      switch (e) {
        case 'ff':
          show = '整机'
          break
        default:
          show = e
      }
      return show
    },
    showChangeOnOffStatus (e) {
      let show
      show = '00'
      switch (e) {
        case '55':
          show = '开机'
          break
        case 'aa':
          show = '关机'
          break
      }
      return show
    },
    showChangeOnOffActionSelected (e) {
      let show
      show = '00'
      switch (e) {
        case '55':
          show = '关机'
          break
        case 'aa':
          show = '开机'
          break
      }
      return show
    },
    readParam () {
      console.log('子组件发送读取设置开关机参数请求')
      this.$emit('getSetOnOff')
    },
    downloadParam () {
      console.log('子组件发送downlod设置开关机参数请求')
      // console.log(this.dataAll)
      this.$emit('downloadSetOnOff', this.dataAll)
    },
    close () {
      this.$emit('close')
    },
    actionSeleted (slot, id, status, selected) {
      console.log('当前选中的槽位：', slot)
      console.log('当前选中的ID：', id)
      console.log('当前选中的开关机状态：', status)
      console.log('当前的选择状态：', selected)
    }
  },
  computed: {}
}
</script>
<style lang='' scoped>
</style>
