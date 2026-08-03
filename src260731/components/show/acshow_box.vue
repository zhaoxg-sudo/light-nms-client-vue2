<template>
  <div class="show-area">
    <div class="musicMenuHalf">
      <div class="menuType">
        <!-- <i class="fa fa-list-ul" aria-hidden="true"></i>直流局端电源
        <div class="operate"> -->
          <form class="form-inline">
            <div class="form-group">
              <label>交流电源站点</label>
              <input type="text" v-model="currentCatalogLabel" class="form-control" style="width:200px;">
            </div>
            <button type="button" class="btn btn-info" @click="refresh">
              <i class="fa fa-search" aria-hidden="true"></i>刷新
            </button>
          </form>
        <!-- </div> -->
      </div>
      <div class="inputOutput">
           <div class="menuType">
             <i class="fa fa-list-ul" aria-hidden="true"></i>输出参数
           </div>
           <form class="form-inline">
             <div class="form-group">
               <label>输出电压 ( V )</label>
               <input type="text" v-model="paramShow.out1V" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>输出电流 ( A )</label>
               <input type="text" v-model="paramShow.out1A" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>输出功率(W)</label>
               <input type="text" v-model="paramShow.out1KW" class="form-control" style="width:120px;">
             </div>
           </form>
         </div>
       <!-- </div> -->
       <div class="para-area">
         <div class="menuType">
           <i class="fa fa-list-ul" aria-hidden="true"></i>运行参数
         <div>
           <form class="form-inline">
              <!-- <div class="form-group">
             <label>输出电流百分比</label>
             <input type="text" v-model="paramShow.setparamampercetage" class="form-control" style="width:100px;">
           </div> -->
             <div class="form-group">
               <label>电源输出通断开关</label>
               <el-switch
                 v-model="paramShow.out1Flag"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
             </div>
             <div class="form-group">
               <label>&nbsp;&nbsp;断电故障</label>
               <el-switch
                 v-model="paramShow.shutdownAlarm"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
             <div class="form-group">
               <label>&nbsp;&nbsp;离线故障</label>
               <el-switch
                 v-model="paramShow.com"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
           </form>
         </div>
       </div>
       <div class="set-area">
         <div class="menuType">
           <i class="fa fa-list-ul" aria-hidden="true"></i>参数设置
         </div>
       <div>
          <button type="button" class="btn btn-sm btn-info" @click="setOnOff">控制电源输出通断</button>
      </div>
        <div>
          <div v-if="modolType0!=null && modolType0>-2">
            <boxsetonoff :onoffparameter="onoffparameter" :modolType="modolType" @close="closeModal" @getSetOnOff="getSetOnOff" @downloadSetOnOff="downloadSetOnOff"></boxsetonoff>
          </div>
        </div>
       </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import powersetonoff from './powersetonoff.vue'
import boxsetonoff from './boxsetonoff.vue'
import powersetparam from './setParam.vue'

export default {
  name: '',
  components: {
    powersetonoff: powersetonoff,
    boxsetonoff: boxsetonoff,
    powersetparam: powersetparam
  },
  props: ['currentCatalogLabel', 'currentCatalogID'],
  data () {
    return {
      runtime: '1111',
      // currentCatalogID: '',
      currentCatalogLabelDc: '',
      runMsg: 'runstatus',
      paramShow: {
        out1KW: '',
        out1V: '',
        out1A: '',
        out1Flag: false,
        shutdownAlarm: false,
        comAlarm: false,
        portList: [],
        portNum: 0,
        timeStamp: '',
        ipaddress: ''
      },
      onoffparameter: [
        {slot: '01', id: '01', status: '55', actionselected: false, rebootselected: false}
        // {slot: '02', id: '02', status: '55', actionselected: false, rebootselected: false}
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
    'portonoff': {
      handler: async function (data) {
        console.log('portonoff report:=', data)
        let flag = this.status(data.code.port1)
        this.paramShow.out1Flag = flag
        this.onoffparameter[0].status = data.code.port1
        this.$nextTick(function () {
        })
      }
    },
    'portva': {
      handler: async function (data) {
        // console.log('portva report:=', data)
        if (data.code.port1v === '0fff') {
          data.code.port1v = '0000'
        }
        // this.paramShow.out1v = parseInt(data.code.port1v.toString(), 16) / 10
        if (data.code.port1a === '0fff') {
          data.code.port1a = '0000'
        }
        // this.paramShow.out1a = parseInt(data.code.port1a.toString(), 16) / 1000
        // this.paramShow.outKW = this.paramShow.out1v * this.paramShow.out1a
        console.log('portva report0:=', data, this.paramShow.out1v, this.paramShow.out1a)
        this.$nextTick(function () {
          this.paramShow.out1v = parseInt(data.code.port1v.toString(), 16) / 10
          this.paramShow.out1a = parseInt(data.code.port1a.toString(), 16) / 1000
          this.paramShow.outKW = this.paramShow.out1v * this.paramShow.out1a
          console.log('portva report1:=', data, this.paramShow.out1v, this.paramShow.out1a)
        })
      }
    }
  },
  created () {
    this.$nextTick(async () => {
      // this.sockets.subscribe('test', (data) => {
      //   console.log('acshow_box 收到了后台推送test信息！！！！！！！！！！\n', data)
      // })
      // this.sockets.subscribe('onoff', (data) => {
      //   console.log('acshow_box收到了后台推送的端口状态信息！！！！！！！！！！\n', data)
      // })
    })
  },
  beforeMount () {},
  mounted () {},
  methods: {
    async refresh () {
      await this.getva()
      await this.getuploadport()
      // this.subModuleID()
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
        case 'aa':
          status = true
          break
        case '55':
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
      await this.getuploadport()
    },
    // download开关/重启
    downloadSetOnOff (param) {
      console.log('点击了：下发指令的按钮', param)

      if (param[0].rebootselected) {
        this.setOutPortReboot(param)
        // 清掉选中标识
        this.onoffparameter[0].rebootselected = false
      }
      if (param[0].actionselected) {
        if (param[0].status === 'aa') {
          // setOutPortOff
          this.setOutPortOff(param)
          this.onoffparameter[0].actionselected = false
        } else {
          // setOutPortOn
          this.setOutPortOn(param)
          this.onoffparameter[0].actionselected = false
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
    // 读取供电电压与电流
    getva () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次读取供电电压与电流的catalogid：=', catalogid)
      this.instance({
        url: '/devicebox/getva/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res供电电压与电流读取成功！', res)
          let msg = res.data.result
          console.log('msg供电电压与电流读取成功！', msg)
          let msgJson = JSON.parse(msg)
          console.log('msg供电电压与电流读取成功json！', msgJson)
          if (msgJson.port1v.toString() === '0fff') {
            msgJson.port1v = '0000'
          }
          _this.paramShow.out1V = parseInt(msgJson.port1v.toString(), 16) / 10
          if (msgJson.port1a.toString() === '0fff') {
            msgJson.port1a = '0000'
          }
          _this.paramShow.out1A = parseInt(msgJson.port1a.toString(), 16) / 1000
          _this.paramShow.out1KW = _this.paramShow.out1V * _this.paramShow.out1A
          _this.paramShow.portNum = msgJson.portnum.toString()
          _this.paramShow.timeStamp = msgJson.time.toString()
          _this.paramShow.ipaddress = msgJson.address.toString()
          console.log('msg供电电压与电流读取成功！param', _this.paramShow)
        } else {
          console.log('供电电压与电流读取失败？？？', res)
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
    setOutPortReboot (param) {
      let catalogid = this.currentCatalogID
      let _this = this
      let port = 1
      console.log('这次控制输出端口重启的catalogid：=', catalogid)
      this.instance({
        url: '/devicebox/setoutportreboot/' + catalogid + '/' + port,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res控制输出端口重启成功！', res)
          let msg = res.data.result
          console.log('msg控制输出端口重启成功！', msg)
          // let msgJson = JSON.parse(msg)
          this.onoffparameter[0].rebootselected = false
          console.log('msg控制输出端口重启成功！', msg)
          _this.runMsg = '控制输出端口重启: ' + msg
        } else {
          console.log('控制输出端口重启失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '控制输出端口重启: ' + msg
        }
      })
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
          this.onoffparameter[0].status = '55'
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
      portonoff: 'portonoff',
      portva: 'portva'
    })
  }
}
</script>
<style lang='' scoped>
.show-area {
    height: 400px;
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
