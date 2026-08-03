<template>
  <div class="show-area">
    <div class="musicMenuHalf">
      <div class="menuType">
        <!-- <i class="fa fa-list-ul" aria-hidden="true"></i>直流局端电源
        <div class="operate"> -->
          <form class="form-inline">
            <div class="form-group">
              <label>交流远端站点</label>
              <input type="text" v-model="currentCatalogLabel" class="form-control" style="width:200px;">
              <span :class="autoUpdate == true ? 'selected' : ''" @click="changeType(1)">自动更新</span>
            </div>
            <button type="button" class="btn btn-info" @click="refresh">
              <i class="fa fa-search" aria-hidden="true"></i>刷新
            </button>
          </form>
        <!-- </div> -->
      </div>
      <div class="inputOutput">
        <div class="inputOutputHalf">
           <div class="menuType">
             <i class="fa fa-list-ul" aria-hidden="true"></i>输入输出参数
           </div>
           <form class="form-inline">
             <div class="form-group">
               <label>输入电压 ( V )</label>
               <input type="text" v-model="paramShow.inv" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>输出电压 ( V )</label>
               <input type="text" v-model="paramShow.outv" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>输出功率( W )</label>
               <input type="text" v-model="paramShow.outw" class="form-control" style="width:120px;">
             </div>
           </form>
         </div>
        <div class="inputOutputHalf">
           <div class="menuType">
             <i class="fa fa-list-ul" aria-hidden="true"></i>运行参数
           </div>
           <form class="form-inline">
             <div class="form-group">
               <label>运行时间 ( S )</label>
               <input type="text" v-model="paramShow.runtime" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>工作温度( ℃ )</label>
               <input type="text" v-model="paramShow.temperature" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>工作状态</label>
               <input type="text" v-model="paramShow.runstatus" class="form-control" style="width:152px;">
             </div>
           </form>
         </div>
      </div>
       <!-- </div> -->
       <div class="para-area">
         <div class="menuType">
           <i class="fa fa-list-ul" aria-hidden="true"></i>输出开关状态
         <div>
           <form class="form-inline">
             <div class="form-group">
               <label>主开关</label>
               <el-switch
                 v-model="paramShow.outswitch.msw7"
                 active-color="#13ce66"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>开关6</label>
               <el-switch
                 v-model="paramShow.outswitch.ssw5"
                 active-color="#13ce66"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>开关5</label>
               <el-switch
                 v-model="paramShow.outswitch.ssw4"
                 active-color="#13ce66"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>开关4</label>
               <el-switch
                 v-model="paramShow.outswitch.ssw3"
                 active-color="#13ce66"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>开关3</label>
               <el-switch
                 v-model="paramShow.outswitch.ssw2"
                 active-color="#13ce66"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>开关2</label>
               <el-switch
                 v-model="paramShow.outswitch.ssw1"
                 active-color="#13ce66"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>开关1</label>
               <el-switch
                 v-model="paramShow.outswitch.ssw0"
                 active-color="#13ce66"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
           </form>
         </div>
       </div>
       <div class="para-area">
         <div class="menuType">
           <i class="fa fa-list-ul" aria-hidden="true"></i>故障状态
         <div>
           <form class="form-inline">
             <div class="form-group">
               <label>主开关故障</label>
               <el-switch
                 v-model="paramShow.alarm.mastersw"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>输出过压</label>
               <el-switch
                 v-model="paramShow.alarm.outov"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>输出欠压</label>
               <el-switch
                 v-model="paramShow.alarm.outuv"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>超大负载</label>
               <el-switch
                 v-model="paramShow.alarm.oload"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>过温</label>
               <el-switch
                 v-model="paramShow.alarm.ot"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>过功率</label>
               <el-switch
                 v-model="paramShow.alarm.ow"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>输入过压</label>
               <el-switch
                 v-model="paramShow.alarm.inov"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>输入欠压</label>
               <el-switch
                 v-model="paramShow.alarm.inuv"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>断电故障</label>
               <el-switch
                 v-model="paramShow.shutdownAlarm"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>离线故障</label>
               <el-switch
                 v-model="paramShow.offlineAlarm"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
             <div class="form-group">
               <label>通信故障</label>
               <el-switch
                 v-model="paramShow.comAlarm"
                 active-color="#ff4949"
                 inactive-color="#999"
                 disabled>
               </el-switch>
             </div>
           </form>
         </div>
       </div>
       <div class="set-area">
         <div class="menuType">
           <i class="fa fa-list-ul" aria-hidden="true"></i>参数设置
           <button type="button" class="btn btn-sm btn-info" @click="setOnOff">控制电源输出开关</button>
         </div>
         <!-- <div> -->
          <!-- <button type="button" class="btn btn-sm btn-info" @click="setOnOff">控制电源输出开关</button> -->
         <!-- </div> -->
        <div>
          <div v-if="modolType0!=null && modolType0>-2">
            <clsdsetonoff :onoffparameter="onoffparameter" :modolType="modolType" @close="closeModal" @getSetOnOff="getSetOnOff" @downloadSetOnOff="downloadSetOnOff"></clsdsetonoff>
          </div>
        </div>
       </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'
import powersetonoff from './powersetonoff.vue'
import clsdsetonoff from './clsdsetonoff.vue'
import powersetparam from './setParam.vue'

export default {
  name: '',
  components: {
    powersetonoff: powersetonoff,
    clsdsetonoff: clsdsetonoff,
    powersetparam: powersetparam
  },
  props: ['currentCatalogLabel', 'currentCatalogID'],
  data () {
    return {
      runtime: '1111',
      // currentCatalogID: '',
      currentCatalogLabelDc: '',
      runMsg: 'runstatus',
      autoUpdate: false,
      updatetime: 5000,
      updateTimer: null,
      paramShow: {
        outw: '',
        outv: '',
        inv: '',
        temperature: '',
        runstatus: '',
        alarmall: '',
        outswitchall: '',
        shutdownAlarm: false,
        offlineAlarm: false,
        comAlarm: false,
        portList: [],
        portNum: 0,
        runtime: '',
        ipaddress: '',
        alarm: {
          mastersw: false,
          outov: false,
          outuv: false,
          oload: false,
          ot: false,
          ow: false,
          inov: false,
          inuv: false
        },
        outswitch: {
          msw7: false,
          ssw5: false,
          ssw4: false,
          ssw3: false,
          ssw2: false,
          ssw1: false,
          ssw0: false
        }
      },
      onoffparameter: [
        {slot: '00', id: '00', status: false, actionselected: false, rebootselected: false},
        {slot: '06', id: '06', status: false, actionselected: false, rebootselected: false},
        {slot: '05', id: '05', status: false, actionselected: false, rebootselected: false},
        {slot: '04', id: '04', status: false, actionselected: false, rebootselected: false},
        {slot: '03', id: '03', status: false, actionselected: false, rebootselected: false},
        {slot: '02', id: '02', status: false, actionselected: false, rebootselected: false},
        {slot: '01', id: '01', status: false, actionselected: false, rebootselected: false}
      ],
      showSetOnOff: true,
      showSetParam: true,
      modolType: null,
      modolType0: null,
      instance: this.$ajax.create({
        baseURL: 'http://123.57.87.144:7001/'
      })
    }
  },
  watch: {
    'clsdportonoff': {
      handler: async function (data) {
        console.log('clsdportonoff report:=', data)
        if (data.code.catalogid === this.currentCatalogID) {
          this.translateToSwitch(data.code.outswitch)
        }
        this.$nextTick(function () {
        })
      }
    },
    'alarmReport': {
      handler: async function (data) {
        console.log('clsd alarmReport +++++++++++:=', data)
        if (data.catalogid === this.currentCatalogID) {
          this.translateToClsdAlarm(data)
        }
        this.$nextTick(function () {
        })
      }
    },
    'TreeData': {
      handler: async function (data) {
        console.log('clsd run has watched  tree data id ,labal:=', data.catalogid, data.label)
        // this.currentTreeData = data
        this.$nextTick(async function () {
          // this.getHeightsWidths()
          this.refresh()
        })
      },
      deep: true
    }
  },
  created () {
    let _this = this
    this.updatetime = this.$store.state.updateTime
    this.$nextTick(async () => {
      this.refresh()
      if (this.autoUpdate === true) {
        if (this.updateTimer) {
          console.log('created() updateTimer is exist!!!', this.updateTimer)
        } else {
          this.updateTimer = setInterval(() => {
            console.log('acshow-clsd发起参数更新')
            this.refresh()
          }, _this.updatetime)
          console.log('acshow-clsd 开启了定时器++++++++=', this.updateTimer)
        }
      } else if (this.autoUpdate === false) {
        console.log('acshow-clsd 进入了关掉自动读取定时器')
        if (this.updateTimer) {
          clearInterval(this.updateTimer)
          this.updateTimer = null
        }
      }
    })
  },
  beforeMount () {},
  mounted () {},
  beforeDestroy () {
    if (this.updateTimer) {
      console.log('acshow-clsd 关掉自动读取定时器--------------------:', this.updateTimer)
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }
  },
  methods: {
    changeType (type) {
      let _this = this
      this.autoUpdate = !this.autoUpdate
      if (this.autoUpdate === true) {
        console.log('acshow-clsd开启自动读取定时器')
        if (this.updateTimer) {
        } else {
          this.updateTimer = setInterval(() => {
            console.log('acshow-clsd发起参数更新请求')
            this.refresh()
          }, _this.updatetime)
          console.log('aacshow-clsd开启了定时器++++++++=', this.updateTimer)
        }
      } else if (this.autoUpdate === false) {
        console.log('acshow-clsd进入了关掉自动读取定时器')
        if (this.updateTimer) {
          console.log('acshow-clsd关掉自动读取定时器', this.updateTimer)
          clearInterval(this.updateTimer)
          this.updateTimer = null
        }
      }
      $('.selected').removeClass('selected')
    },
    async refresh () {
      await this.getparams()
      // await this.getuploadport()
      // this.subModuleID()
    },
    showClose (s) {
      let flag = s
      s = !s
      flag ? s = true : s = false
    },
    // 设置参数组件关闭
    closeModal () {
      this.modolType = null
      this.modolType0 = null
    },
    // 故障状态转换
    status (a) {
      let status = false
      switch (a) {
        case true:
          status = true
          break
        case false:
          status = false
          break
      }
      return status
    },
    // set组件刷新配置参数
    refreshSetParam () {
      console.log('收到子组件发送的刷新指令')
      this.refresh()
    },
    // du读取通道吸合断开状态
    async getSetOnOff () {
      console.log('点击了：读取通道吸合断开状态的按钮')
      await this.getparams()
    },
    // download开关/重启
    async downloadSetOnOff (param) {
      console.log('clsd 点击了：下发指令的按钮', param)
      // 逐个下发reboot指令
      for (let i = 0; i < param.length; i++) {
        if (param[i].rebootselected) {
          await this.setOutPortReboot(param[i])
          // 清掉选中标识
          param[i].rebootselected = false
        }
      }
    },
    // 设置开关机按钮
    setOnOff () {
      console.log('点击了：设置电源开关机的按钮')
      this.modolType0 = -1
    },
    // 设置电源参数按钮
    setParam (param) {
      console.log('点击了：设置电源参数的按钮')
      this.modolType = -1
    },
    // download设置电源参数
    downloadSetParam (param) {
      console.log('点击了：download设置电源参数的按钮')
      this.setPowerParam(param)
    },
    translateToClsdAlarm (a) {
      switch (a.functioncode) {
        case 'com':
          this.paramShow.comAlarm = a.alarmfired
          break
        case 'shutdown':
          this.paramShow.shutdownAlarm = a.alarmfired
          break
        case 'offline':
          this.paramShow.offlineAlarm = a.alarmfired
          break
      }
    },
    translateToAlarm (a) {
      console.log('clsd 收到的alarm原始值:=', a)
      a = parseInt(a, 16)
      let inuvbit = ((a & 0x01) === 0x01)
      this.paramShow.alarm.nuv = inuvbit
      let inovbit = ((a & 0x02) === 0x02)
      this.paramShow.alarm.inov = inovbit
      let owbit = ((a & 0x04) === 0x04)
      this.paramShow.alarm.ow = owbit
      let otbit = ((a & 0x08) === 0x08)
      this.paramShow.alarm.ot = otbit
      let oloadbit = ((a & 0x10) === 0x10)
      this.paramShow.alarm.oload = oloadbit
      let outuvbit = ((a & 0x20) === 0x20)
      this.paramShow.alarm.outuv = outuvbit
      let outovbit = ((a & 0x40) === 0x40)
      this.paramShow.alarm.outov = outovbit
      let masterswbit = ((a & 0x80) === 0x80)
      this.paramShow.alarm.mastersw = masterswbit
    },
    translateToSwitch (s) {
      console.log('clsd 收到的switch原始值:=', s)
      let a = s.slice(2, 4)
      console.log('clsd 收到的switch原始值:=', a)
      a = parseInt(a, 16)
      let ssw0bit = ((a & 0x01) === 0x01)
      this.paramShow.outswitch.ssw0 = ssw0bit
      this.onoffparameter[6].status = ssw0bit
      let ssw1bit = ((a & 0x02) === 0x02)
      this.paramShow.outswitch.ssw1 = ssw1bit
      this.onoffparameter[5].status = ssw1bit
      let ssw2bit = ((a & 0x04) === 0x04)
      this.paramShow.outswitch.ssw2 = ssw2bit
      this.onoffparameter[4].status = ssw2bit
      let ssw3bit = ((a & 0x08) === 0x08)
      this.paramShow.outswitch.ssw3 = ssw3bit
      this.onoffparameter[3].status = ssw3bit
      let ssw4bit = ((a & 0x10) === 0x10)
      this.paramShow.outswitch.ssw4 = ssw4bit
      this.onoffparameter[2].status = ssw4bit
      let ssw5bit = ((a & 0x20) === 0x20)
      this.paramShow.outswitch.ssw5 = ssw5bit
      this.onoffparameter[1].status = ssw5bit
      let msw7bit = ((a & 0x80) === 0x80)
      this.paramShow.outswitch.msw7 = msw7bit
      this.onoffparameter[0].status = msw7bit
    },
    // 读取clsd设备电压等参数
    getparams () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('cls-d 这次读取供电电压与电流的catalogid：=', catalogid)
      this.instance({
        url: '/deviceclsd/getparams/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('clsd res params读取成功！', res)
          let msg = res.data.result
          console.log('clsd msg params读取成功！', msg)
          let msgJson = JSON.parse(msg)
          console.log('clsd msg params读取成功json！', msgJson)
          _this.paramShow.inv = parseInt(msgJson.inv.toString(), 16)
          _this.paramShow.outv = parseInt(msgJson.outv.toString(), 16) / 10
          _this.paramShow.outw = parseInt(msgJson.outw.toString(), 16)
          _this.paramShow.temperature = parseInt(msgJson.temperature.toString(), 16)
          _this.paramShow.alarmall = parseInt(msgJson.alarm.toString(), 16)
          _this.translateToAlarm(msgJson.alarm.toString())
          _this.paramShow.outswitchall = msgJson.outswitch.toString()
          _this.translateToSwitch(msgJson.outswitch.toString())
          _this.paramShow.runstatus = msgJson.runstatus.toString()
          _this.paramShow.runtime = parseInt(msgJson.runtime.toString(), 16)
          _this.paramShow.ipaddress = msgJson.ipaddress.toString()
          _this.paramShow.comAlarm = msgJson.com
          _this.paramShow.shutdownAlarm = msgJson.shutdown
          _this.paramShow.offlineAlarm = msgJson.offline
          console.log('clsd msg params读取成功！param', _this.paramShow)
        } else {
          console.log('clsd params读取失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '供电电压与电流: ' + msg
        }
      })
    },
    // 读取供电端口开关状态
    getuploadport () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次供电端口开关状态的catalogid：=', catalogid)
      this.instance({
        url: '/devicebox/getuploadport/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res供电端口开关状态读取成功！', res)
          let msg = res.data.result
          console.log('msg供电端口开关状态读取成功！', msg)
          let msgJson = JSON.parse(msg)
          console.log('msg供电端口开关状态读取成功json！', msgJson)
          let flag = this.status(msgJson.port1.toString())
          _this.paramShow.out1Flag = flag
          _this.onoffparameter[0].status = msgJson.port1.toString()
          // console.log('_this.onoffparameter[0].status=', _this.onoffparameter[0].status)
          _this.paramShow.timeStamp = msgJson.time.toString()
          _this.paramShow.ipaddress = msgJson.address.toString()
          console.log('msg供电端口开关状态读取成功！param', _this.paramShow)
        } else {
          console.log('供电端口开关状态读取失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '供电端口开关状态: ' + msg
        }
      })
    },
    // 控制输出端口重启
    async setOutPortReboot (param) {
      let catalogid = this.currentCatalogID
      let port = param.id
      console.log('clsd 这次控制输出端口重启的catalogid,port ：=', catalogid, port)
      let res = await this.instance({
        url: '/deviceclsd/setoutportreboot/' + catalogid + '/' + port,
        method: 'get'
      })
      // console.log('clsd res控制输出端口重启成功！', res)
      if (res.data.code === 1) {
        console.log('clsd res控制输出端口重启成功！', res)
        let msg = res.data.result
        console.log('clsd msg控制输出端口重启成功的结果！', msg)
        this.$message.success(port + '控制输出端口复位重启成功')
      } else {
        console.log('clsd 控制输出端口重启失败？？？', res)
        this.$message.warning(port + '控制输出端口复位重启失败!!!!!!!')
      }
    },
    // 控制输出端口吸合
    setOutPortOn (param) {
      let catalogid = this.currentCatalogID
      let _this = this
      let port = 1
      console.log('这次控制输出端口吸合的catalogid：=', catalogid)
      this.instance({
        url: '/devicebox/setoutporton/' + catalogid + '/' + port,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res控制输出端口吸合成功！', res)
          let msg = res.data.result
          console.log('msg控制输出端口吸合成功！', msg)
          // let msgJson = JSON.parse(msg)
          this.onoffparameter[0].rebootselected = false
          console.log('msg控制输出端口吸合成功！', msg)
          this.onoffparameter[0].status = 'aa'
          this.paramShow.out1Flag = true
          _this.runMsg = '控制输出端口吸合: ' + msg
        } else {
          console.log('控制输出端口吸合失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '控制输出端口吸合: ' + msg
        }
      })
    },
    // 控制输出端口断开
    setOutPortOff (param) {
      let catalogid = this.currentCatalogID
      let _this = this
      let port = 1
      console.log('这次控制输出端口断开的catalogid：=', catalogid)
      this.instance({
        url: '/devicebox/setoutportoff/' + catalogid + '/' + port,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res控制输出端口断开成功！', res)
          let msg = res.data.result
          console.log('msg控制输出端口断开成功！', msg)
          // let msgJson = JSON.parse(msg)
          this.onoffparameter[0].rebootselected = false
          console.log('msg控制输出端口断开成功！', msg)
          _this.runMsg = '控制输出端口断开: ' + msg
          this.onoffparameter[0].status = false
          this.paramShow.out1Flag = false
        } else {
          console.log('控制输出端口断开失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '控制输出端口断开: ' + msg
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      clsdportonoff: 'clsdportonoff',
      alarmReport: 'alarmReport',
      TreeData: 'TreeData'
    })
  }
}
</script>
<style lang='' scoped>
.show-area {
    height: 450px;
    background: dimgray;
}

.para-area {
    height: 70px;
    margin: 3px;
    border-radius: 4px;
    background: #313439;
}

.module-area {
    height: 115px;
    margin: 3px;
    border-radius: 4px;
    background: #313439;
}
.set-area {
    height: 30px;
    margin: 3px;
    border-radius: 4px;
    background: #313439;
}
.inputOutput {
    height: 150px;
    margin: 3px;
    background: #313439;
}
/* .el-table {
    background:#313439;
    color: #fff;
} */
</style>
