<template>
  <div>
    <!-- <h3>电源参数设置</h3> -->
    <div class="popUpSet" style="display: block;">
      <div class="popContent">
        <div class="menuType">
          <i class="fa fa-list-ul" aria-hidden="true"></i>控制电源输出通断开关
        </div>
           <div class="table">
      <table class="table">
        <thead>
          <tr>
            <td>开关序号</td>
            <td>开关名称</td>
            <td>通断状态</td>
            <!-- <td>通断操作</td> -->
            <td>重启操作</td>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="item in onoffparameter" :key="item.slot">
            <td>{{item.slot}}</td>
            <td>{{showChangeOnOffId(item.id)}}</td>
            <td>{{showChangeOnOffStatus(item.status)}}</td>
            <!-- <td>
              <input type="checkbox" id="inlineCheckbox" v-model="item.actionselected" @click="actionSeleted(item.slot, item.id, item.status, !item.actionselected)">
              <label for="checkbox">{{ showChangeOnOffActionSelected(item.status) }}</label>
            </td> -->
            <td>
              <input type="checkbox" id="inlineCheckbox" v-model="item.rebootselected" @click="rebootSeleted(item.slot, item.id, item.status, !item.rebootselected)">
              <label for="checkbox">{{ showChangeRebootActionSelected(item.status) }}</label>
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
      onSelected: '吸合',
      selectedRebootSwitch: {
        slot: '00',
        id: '00',
        status: false,
        // actionselected: false,
        rebootselected: false
      },
      selectedRebootSwitchArr: [],
      rules: {},
      self: this,
      range: ''
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
        case '00':
          show = '主开关'
          break
        case '01':
          show = '开关1'
          break
        case '02':
          show = '开关2'
          break
        case '03':
          show = '开关3'
          break
        case '04':
          show = '开关4'
          break
        case '05':
          show = '开关5'
          break
        case '06':
          show = '开关6'
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
        case true:
          show = '吸合'
          break
        case false:
          show = '断开'
          break
      }
      return show
    },
    showChangeOnOffActionSelected (e) {
      let show
      show = '00'
      switch (e) {
        case false:
          show = '断开'
          break
        case true:
          show = '吸合'
          break
      }
      return show
    },
    showChangeRebootActionSelected (e) {
      let show
      show = '00'
      switch (e) {
        case true:
          show = '重启'
          break
        case false:
          show = '重启'
          break
      }
      return show
    },
    readParam () {
      console.log('子组件发送读取设置开关机参数请求')
      this.$emit('getSetOnOff')
    },
    downloadParam () {
      console.log('clsd 子组件发送downlod设置reboot请求')
      this.$emit('downloadSetOnOff', this.onoffparameter)
    },
    close () {
      this.$emit('close')
    },
    actionSeleted (slot, id, status, selected) {
      console.log('当前选中的端口：', slot)
      console.log('当前选中的端口号：', id)
      console.log('当前选中的通断状态：', status)
      console.log('当前的选择状态：', selected)
    },
    rebootSeleted (slot, id, status, selected) {
      console.log('clsd 当前选中的端口：', slot)
      console.log('clsd 当前选中的端口号：', id)
      console.log('clsd 当前选中的reboot状态：', status)
      console.log('clsd 当前的选择状态：', selected)
      this.selectedRebootSwitch.slot = slot
      this.selectedRebootSwitch.id = id
      this.selectedRebootSwitch.status = status
      this.selectedRebootSwitch.rebootselected = selected
      console.log('clsd 当前的选择端口状态：=', this.selectedRebootSwitch)
      // change rebootselected
      for (let i = 0; i < this.onoffparameter.length; i++) {
        if (this.onoffparameter[i].slot === slot) {
          this.onoffparameter[i].rebootselected = selected
        }
      }
    }
  },
  computed: {}
}
</script>
<style lang='' scoped>
</style>
