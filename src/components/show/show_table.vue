<template>
  <div class="show-area-table">
     <div class="tableTool">
      <form class="form-inline">
            <div class="form-group">
              <label>电源站点</label>
              <input type="text" v-model="currentCatalogLabel" class="form-control" style="width:200px;">
              <span :class="autoUpdate == true ? 'selected' : ''" @click="changeType(1)">自动更新</span>
            </div>
            <button type="button" class="btn btn-info" @click="refresh">
              <i class="fa fa-search" aria-hidden="true"></i>刷新
            </button>
          </form>
    </div>
    <table class="table">
        <thead>
          <tr>
            <td>电源名称</td>
            <td>电源类型</td>
            <td>输入A相电压</td>
            <td>输入B相电压</td>
            <td>输入C相电压</td>
            <td>输出A相电压</td>
            <td>输出B相电压</td>
            <td>输出C相电压</td>
            <td>输入UAB线电压</td>
            <td>输入UBC线电压</td>
            <td>输入UCA线电压</td>
            <td>输出UAB线电压</td>
            <td>输出UBC线电压</td>
            <td>输出UCA线电压</td>
            <td>输入A相电流</td>
            <td>输入B相电流</td>
            <td>输入C相电流</td>
            <td>市电指示</td>
            <td>稳压指示</td>
            <td>输出开关</td>
            <!-- <td>同调指示</td>
            <td>自动指示</td> -->
            <td>告警状态</td>
          </tr>
        </thead>
        <tbody v-for="item in showTable" :key="item.station">
          <tr>
            <td>
              {{item.station}}
              <input type="checkbox" id="inlineCheckbox" v-model="item.expendFlag" @click="remoteExpand(item, !item.expendFlag)">
              <!-- <label for="checkbox">{{expandView(item.expendFlag)}}</label> -->
            </td>
            <td>{{item.type}}</td>
            <td>{{item.inav + 'V'}}</td>
            <td>{{item.inbv + 'V'}}</td>
            <td>{{item.incv + 'V'}}</td>
            <td>{{item.outav + 'V'}}</td>
            <td>{{item.outbv + 'V'}}</td>
            <td>{{item.outcv + 'V'}}</td>
            <td>{{item.inuab + 'V'}}</td>
            <td>{{item.inubc + 'V'}}</td>
            <td>{{item.inuca + 'V'}}</td>
            <td>{{item.outuab + 'V'}}</td>
            <td>{{item.outubc + 'V'}}</td>
            <td>{{item.outuca + 'V'}}</td>
            <td>{{item.aa + 'A'}}</td>
            <td>{{item.ba + 'A'}}</td>
            <td>{{item.ca + 'A'}}</td>
            <td>
              <el-switch
                 v-model="item.mainstatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
            </td>
            <td>
              <el-switch
                 v-model="item.stabilestatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
            </td>
            <td>
              <el-switch
                 v-model="item.outswitchstatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
            </td>
            <td :style="{backgroundColor:item.alarmstatus!=''?'#ff4949':'#999'}">{{item.alarmstatus}}</td>
          </tr>
          <tr>
            <td v-show="item.expendFlag">
              <table class="childrentable">
                <thead>
                <tr>
                  <!-- <th rowspan="3">{{item.station}}</th> -->
                  <th scope="col">远端名称</th>
                  <th scope="col">输入电压</th>
                  <th scope="col">输出电压</th>
                  <th scope="col">输出功率</th>
                  <th scope="col">工作温度</th>
                  <th scope="col">开关状态</th>
                  <th scope="col">告警状态</th>
                </tr>
                </thead>
                <tbody>
                 <tr v-for="items in item.remote" :key="items.station">
                  <!-- <td>{{item.station}}</td> -->
                  <td>{{items.station}}</td>
                  <td>{{items.inv + 'V'}}</td>
                  <td>{{items.outv + 'V'}}</td>
                  <td>{{items.outw + 'W'}}</td>
                  <td>{{items.temperature}}</td>
                  <td>{{clsdswitchview(items.switch)}}</td>
                  <td :style="{backgroundColor:clsdalarmView(items.alarm)!=''?'#ff4949':'#999'}">{{clsdalarmView(items.alarm)}}</td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'

export default {
  name: '',
  components: {
  },
  props: ['currentCatalogLabel', 'currentCatalogID', 'allChildrenList'],
  data () {
    return {
      autoUpdate: true,
      updatetime: 5000,
      currentCatalogLabelAc: '',
      runMsg: 'runstatus',
      readErrorNum: 0,
      showTable: [],
      rowlength: 2,
      currentAlarmTable: [],
      paramShow0: {
        station: '',
        type: '',
        com: '',
        auv: '',
        buv: '',
        cuv: '',
        aov: '',
        bov: '',
        cov: '',
        aoa: '',
        boa: '',
        coa: '',
        apl: '',
        bpl: '',
        cpl: '',
        afu: '',
        bfu: '',
        cfu: '',
        phaseloss: '',
        inav: '',
        inbv: '',
        incv: '',
        outav: '',
        outbv: '',
        outcv: '',
        inuab: '',
        inubc: '',
        inuca: '',
        outuab: '',
        outubc: '',
        outuca: '',
        abcv: '',
        av: '',
        bv: '',
        cv: '',
        abca: '',
        aa: '',
        ba: '',
        ca: '',
        mainstatus: '',
        stabilestatus: '',
        outswitchstatus: '',
        stepstatus: '',
        syncstatus: '',
        autostatus: '',
        reserved1: '',
        reserved2: '',
        ymdhms: '',
        electricaltimeswitch: '',
        electricaltimeswitchtime: '',
        alarmstatus: ''
      },
      setpowerparam: {
        setparamv: '',
        setparamampercetage: '',
        setshareamflag: '',
        setautopoweronflag: '',
        setsubratedkw: '',
        index: 0
      },
      powerparameter: {
        setparamv: '',
        setparamampercetage: '',
        setshareamflag: '',
        setautopoweronflag: '',
        setsubratedkw: '',
        index: 8
      },
      onoffparameter: [
        {slot: '00', id: 'ff', status: '55', actionselected: false},
        {slot: '01', id: '01', status: '55', actionselected: false}
      ],
      showSetOnOff: true,
      showSetParam: true,
      modolType: null,
      modolType0: null,
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  watch: {
    'TreeData': {
      handler: async function (data) {
        console.log('show_table show model has watched  tree data id ,labal:=', data.catalogid, data.label)
        // this.currentCatalogID = data.catalogid
        // this.currentCatalogLabelAc = data.label
        this.$nextTick(async function () {
          this.refresh()
        })
      },
      deep: true
    },
    'updateTime': {
      handler: async function (data) {
        console.log('show_table show has watched  updateTime:=', data)
        this.updatetime = data
        this.$nextTick(async function () {
          // this.refresh()
        })
      }
    }
  },
  created () {
    let _this = this
    this.updatetime = this.$store.state.updateTime
    this.refresh()
    if (this.autoUpdate === true) {
      if (this.updateTimer) {
        console.log('created() updateTimer is exist!!!', this.updateTimer)
      } else {
        this.updateTimer = setInterval(() => {
          console.log('show_table发起参数更新')
          _this.refresh()
        }, _this.updatetime)
        console.log('show_table开启了定时器++++++++=', this.updatetime)
      }
    } else if (this.autoUpdate === false) {
      console.log('show_table进入了关掉自动读取定时器')
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }
    }
  },
  beforeMount () {},
  mounted () {},
  beforeDestroy () {
    if (this.updateTimer) {
      console.log('show_table 关掉自动读取定时器--------------------:', this.updatetime)
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }
  },
  methods: {
    changeType (type) {
      let _this = this
      this.autoUpdate = !this.autoUpdate
      if (this.autoUpdate === true) {
        this.refresh()
        console.log('show_table开启自动读取定时器')
        if (this.updateTimer) {
        } else {
          this.updateTimer = setInterval(() => {
            console.log('show_table发起参数更新请求')
            _this.refresh()
          }, _this.updatetime)
          console.log('show_table开启了定时器++++++++=', this.updateTimer)
        }
      } else if (this.autoUpdate === false) {
        console.log('show_table进入了关掉自动读取定时器')
        if (this.updateTimer) {
          console.log('show_table关掉自动读取定时器', this.updateTimer)
          clearInterval(this.updateTimer)
          this.updateTimer = null
        }
      }
      $('.selected').removeClass('selected')
    },
    expandView (v) {
      let view = ''
      // console.log('mudid in ', v)
      if (v) {
        view = '远端已展开'
      } else {
        view = '远端未展开'
      }
      return view
    },
    remoteExpand (e, visible) {
      if (visible) {
        e.expendFlag = true
      }
    },
    // 指示状态转换
    indStatus (a) {
      let status = false
      switch (a) {
        case '0001':
          status = true
          break
        case '0000':
          status = false
          break
        case '0055':
          status = true
          break
        case '00aa':
          status = false
          break
      }
      return status
    },
    // 故障状态转换
    alarmStatus (a) {
      let status = false
      switch (a) {
        case '00aa':
          status = true
          break
        case '0055':
          status = false
          break
      }
      return status
    },
    // 故障显示
    clsdalarmView (alarm) {
      // let a = alarm
      // console.log('clsd alarm view=', a)
      let view = ''
      if (alarm.mastersw) {
        view = view + '主开关故障' + ','
      }
      if (alarm.outov) {
        view = view + '输出过压' + ','
      }
      if (alarm.outuv) {
        view = view + '输出欠压' + ','
      }
      if (alarm.oload) {
        view = view + '超大负载' + ','
      }
      if (alarm.ot) {
        view = view + ' 过温' + ','
      }
      if (alarm.ow) {
        view = view + '过功率' + ','
      }
      if (alarm.inov) {
        view = view + '输入过压' + ','
      }
      if (alarm.inuv) {
        view = view + ' 输入欠压' + ','
      }
      if (alarm.com) {
        view = view + ' 通信故障' + ','
      }
      if (alarm.offline) {
        view = view + ' 离线故障' + ','
      }
      if (alarm.shutdown) {
        view = view + ' 断电故障' + ','
      }
      // console.log('clsd alarm view return =', view)
      return view
    },
    clsdswitchview (s) {
      let view = ''
      // console.log('clsd switch view=', s)
      if (!s.msw7) {
        view = view + '主开关断开' + ','
      }
      if (!s.ssw5) {
        view = view + '开关6断开' + ','
      }
      if (!s.ssw4) {
        view = view + '开关5断开' + ','
      }
      if (!s.ssw3) {
        view = view + '开关4断开' + ','
      }
      if (!s.ssw2) {
        view = view + '开关3断开' + ','
      }
      if (!s.ssw1) {
        view = view + '开关2断开' + ','
      }
      if (!s.ssw0) {
        view = view + '开关1断开' + ','
      }
      if (view === '') {
        view = '开关正常'
      }
      return view
    },
    // 故障显示
    alarmView (alarm) {
      let a = alarm
      // console.log('aaaaaaaaaaaaaaaaaaaaaaa=', a)
      let view = ''
      if (a !== []) {
        for (let i = 0; i < a.length; i++) {
          switch (a[i].alarmdetail) {
            case 'com' :
              view = view + '通信故障' + ','
              break
            case 'auv' :
              view = view + 'A相欠压' + ','
              break
            case 'buv' :
              view = view + 'B相欠压' + ','
              break
            case 'cuv' :
              view = view + 'C相欠压' + ','
              break
            case 'aov' :
              view = view + 'A相过压' + ','
              break
            case 'bov' :
              view = view + 'B相过压' + ','
              break
            case 'cov' :
              view = view + 'C相过压' + ','
              break
            case 'aoa' :
              view = view + 'A相过流' + ','
              break
            case 'boa' :
              view = view + 'B相过流' + ','
              break
            case 'coa' :
              view = view + 'C相过流' + ','
              break
            case 'apl' :
              view = view + 'A相缺相' + ','
              break
            case 'bpl' :
              view = view + 'B相却相' + ','
              break
            case 'cpl' :
              view = view + 'C相却相' + ','
              break
            case 'afu' :
              view = view + 'A相保险' + ','
              break
            case 'bfu' :
              view = view + 'B相保险' + ','
              break
            case 'cfu' :
              view = view + 'C相保险' + ','
              break
            case 'phaseloss' :
              view = view + '相序错误' + ','
              break
          }
        }
        return view
      } else {
        return view
      }
    },
    async refresh () {
      await this.getAllCurrentAlarm()
      console.log('showTable当前的children=', this.allChildrenList)
      for (let i = 0; i < this.allChildrenList.length; i++) {
        if (this.allChildrenList[i].protocoltype === '2') {
          console.log('本次读取的data node======', this.allChildrenList[i])
          // 临时引掉20240416
          await this.readAcParam(this.allChildrenList[i])
          await this.readAcOfRemoteParam(this.allChildrenList[i])
        }
      }
    },
    // get all current alarm
    async getAllCurrentAlarm () {
      let _this = this
      this.instance({
        'url': '/getallcurrentalarm',
        'method': 'get'
      }).then((res) => {
        console.log('\npower all current alarm db:')
        console.log(res.data)
        _this.currentAlarmTable = res.data
      })
    },
    // get all remote catalogid
    async getAllRemoteList (data) {
      // let _this = this
      return this.instance({
        'url': '/childrenall/' + data.catalogid,
        'method': 'get'
      // }).then((res) => {
      //   console.log('\npower all remote  db:', res.data)
        // console.log(res.data)
        // return res.data
      })
    },
    // get all params of remote device
    async readAcOfRemoteParam (data) {
      // let _this = this
      let remote = await this.getAllRemoteList(data)
      console.log('readAcOfRemoteParam 这次读取的children：=', remote.data)
      if (remote.data instanceof Array) {
        for (let i = 0; i < remote.data.length; i++) {
          let catalogid = remote.data[i].catalogid
          let remoteParams = await this.instance({
            url: '/deviceclsd/getparams/' + catalogid,
            method: 'get'
          })
          // console.log('readAcOfRemoteParam 这次读取clsd：=', remoteParams)
          if (remoteParams.data.code === 1) {
            let msg = remoteParams.data.result
            console.log('readAcOfRemoteParam 这次读取clsd远端电源返回：=', msg)
            let msgJson = JSON.parse(msg)
            console.log('readAcOfRemoteParam读取成功json！', msgJson)
            let param = {}
            param.inv = parseInt(msgJson.inv.toString(), 16)
            param.outv = parseInt(msgJson.outv.toString(), 16) / 10
            param.outw = parseInt(msgJson.outw.toString(), 16)
            param.temperature = parseInt(msgJson.temperature.toString(), 16)
            param.alarmall = parseInt(msgJson.alarm.toString(), 16)
            param.alarm = this.translateToAlarm(msgJson.alarm.toString())
            param.outswitchall = msgJson.outswitch.toString()
            param.switch = this.translateToSwitch(msgJson.outswitch.toString())
            param.runstatus = msgJson.runstatus.toString()
            param.runtime = parseInt(msgJson.runtime.toString(), 16)
            param.ipaddress = msgJson.ipaddress.toString()
            param.comAlarm = msgJson.com
            param.shutdownAlarm = msgJson.shutdown
            param.offlineAlarm = msgJson.offline
            param.catalogid = catalogid
            param.station = remote.data[i].label
            param.type = remote.data[i].protocoltype
            param.parentid = remote.data[i].parentid
            param.alarm.offline = param.offlineAlarm
            param.alarm.shutdown = param.shutdownAlarm
            param.alarm.com = param.comAlarm
            console.log('readAcOfRemoteParam读取成功！param', param)
            // set to table param
            let exist = false
            for (let k = 0; k < this.showTable.length; k++) {
              if (this.showTable[k].catalogid === param.parentid) {
                console.log('readAcOfRemoteParam 发现父电源已存在', this.showTable[i], param)
                if (this.showTable[k].remote === []) {
                  exist = false
                } else if (this.showTable[k].remote instanceof Array) {
                  // 找到存在的远端,并替换数据
                  for (let j = 0; j < this.showTable[k].remote.length; j++) {
                    if (this.showTable[k].remote[j].catalogid === param.catalogid) {
                      this.showTable[k].remote[j].catalogid = param.catalogid
                      this.showTable[k].remote[j].station = param.station
                      this.showTable[k].remote[j].type = param.type
                      this.showTable[k].remote[j].inv = param.inv
                      this.showTable[k].remote[j].outv = param.outv
                      this.showTable[k].remote[j].outw = param.outw
                      this.showTable[k].remote[j].temperature = param.temperature
                      this.showTable[k].remote[j].alarm = param.alarm
                      this.showTable[k].remote[j].switch = param.switch
                      this.showTable[k].remote[j].runstatus = param.runstatus
                      this.showTable[k].remote[j].runtime = param.runtime
                      this.showTable[k].remote[j].ipaddress = param.ipaddress
                      this.showTable[k].remote[j].parentid = param.parentid
                      exist = true
                      break
                    }
                  }
                }
                if (!exist) {
                  this.showTable[k].remote.push(param)
                  console.log('readAcOfRemoteParame电源AC参数,remote push+++++++++++++++后\n', this.showTable[k])
                }
              }
              break
            }
            // set to table param end
          }
        }
      }
    },
    translateToAlarm (a) {
      console.log('clsd 收到的alarm原始值:=', a)
      a = parseInt(a, 16)
      let alarm = {}
      let inuvbit = ((a & 0x01) === 0x01)
      alarm.inuv = inuvbit
      let inovbit = ((a & 0x02) === 0x02)
      alarm.inov = inovbit
      let owbit = ((a & 0x04) === 0x04)
      alarm.ow = owbit
      let otbit = ((a & 0x08) === 0x08)
      alarm.ot = otbit
      let oloadbit = ((a & 0x10) === 0x10)
      alarm.oload = oloadbit
      let outuvbit = ((a & 0x20) === 0x20)
      alarm.outuv = outuvbit
      let outovbit = ((a & 0x40) === 0x40)
      alarm.outov = outovbit
      let masterswbit = ((a & 0x80) === 0x80)
      alarm.mastersw = masterswbit
      return alarm
    },
    translateToSwitch (s) {
      console.log('clsd 收到的switch原始值:=', s)
      let a = s.slice(2, 4)
      console.log('clsd 收到的switch原始值:=', a)
      a = parseInt(a, 16)
      let outswitch = {}
      let ssw0bit = ((a & 0x01) === 0x01)
      outswitch.ssw0 = ssw0bit
      let ssw1bit = ((a & 0x02) === 0x02)
      outswitch.ssw1 = ssw1bit
      let ssw2bit = ((a & 0x04) === 0x04)
      outswitch.ssw2 = ssw2bit
      let ssw3bit = ((a & 0x08) === 0x08)
      outswitch.ssw3 = ssw3bit
      let ssw4bit = ((a & 0x10) === 0x10)
      outswitch.ssw4 = ssw4bit
      let ssw5bit = ((a & 0x20) === 0x20)
      outswitch.ssw5 = ssw5bit
      let msw7bit = ((a & 0x80) === 0x80)
      outswitch.msw7 = msw7bit
      return outswitch
    },
    // 读取运行状态
    readAcParam (data) {
      let _this = this
      console.log('show_table 这次读取运行状态的catalogid：=', data.catalogid)
      let catalogid = data.catalogid
      let station = data.label
      let ipaddress = data.ipaddress
      // let paramShow = {}
      this.instance({
        url: '/device/local/getacparamfromagent/' + data.catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          // console.log('res电源运行状态读取成功！', res)
          let msg = res.data.result
          let receivedCatalogID = res.data.catalogid
          let paramShow = {}
          // console.log('msg电源运行状态读取成功！', msg)
          let msgJson = JSON.parse(msg)
          let receivedAddress = msgJson.ipaddress.toString()
          if (ipaddress === receivedAddress) {
            console.log('show_table电源运行状态读取成功json！', msgJson, catalogid, receivedCatalogID)
          } else {
            console.log('show_table电源运行状态读取失败？？？？？？？？？json！', msgJson, catalogid)
          }
          paramShow.catalogid = catalogid
          paramShow.station = station
          if (data.protocoltype === '2') {
            paramShow.type = '交流'
          } if (data.protocoltype === '1') {
            paramShow.type = '直流'
          }
          paramShow.com = _this.alarmStatus(msgJson.com.toString())
          paramShow.auv = _this.alarmStatus(msgJson.auv.toString())
          // param.auv = true
          paramShow.buv = _this.alarmStatus(msgJson.buv.toString())
          paramShow.cuv = _this.alarmStatus(msgJson.cuv.toString())
          paramShow.aov = _this.alarmStatus(msgJson.aov.toString())
          paramShow.bov = _this.alarmStatus(msgJson.bov.toString())
          paramShow.cov = _this.alarmStatus(msgJson.cov.toString())
          paramShow.aoa = _this.alarmStatus(msgJson.aoa.toString())
          paramShow.boa = _this.alarmStatus(msgJson.boa.toString())
          paramShow.coa = _this.alarmStatus(msgJson.coa.toString())
          paramShow.apl = _this.alarmStatus(msgJson.apl.toString())
          paramShow.bpl = _this.alarmStatus(msgJson.bpl.toString())
          paramShow.cpl = _this.alarmStatus(msgJson.cpl.toString())
          paramShow.afu = _this.alarmStatus(msgJson.afu.toString())
          paramShow.bfu = _this.alarmStatus(msgJson.bfu.toString())
          paramShow.cfu = _this.alarmStatus(msgJson.cfu.toString())
          paramShow.phaseloss = _this.alarmStatus(msgJson.phaseloss.toString())
          paramShow.inav = parseInt(msgJson.inav.toString(), 16)
          paramShow.inbv = parseInt(msgJson.inbv.toString(), 16)
          paramShow.incv = parseInt(msgJson.incv.toString(), 16)
          paramShow.outav = parseInt(msgJson.outav.toString(), 16)
          paramShow.outbv = parseInt(msgJson.outbv.toString(), 16)
          paramShow.outcv = parseInt(msgJson.outcv.toString(), 16)
          paramShow.inuab = parseInt(msgJson.inuab.toString(), 16)
          paramShow.inubc = parseInt(msgJson.inubc.toString(), 16)
          paramShow.inuca = parseInt(msgJson.inuca.toString(), 16)
          paramShow.outuab = parseInt(msgJson.outuab.toString(), 16)
          paramShow.outubc = parseInt(msgJson.outubc.toString(), 16)
          paramShow.outuca = parseInt(msgJson.outuca.toString(), 16)
          paramShow.abcv = parseInt(msgJson.abcv.toString(), 16) / 10
          paramShow.av = parseInt(msgJson.av.toString(), 16) / 10
          paramShow.bv = parseInt(msgJson.bv.toString(), 16) / 10
          paramShow.cv = parseInt(msgJson.cv.toString(), 16) / 10
          paramShow.abca = parseInt(msgJson.abca.toString(), 16) / 10
          paramShow.aa = parseInt(msgJson.aa.toString(), 16)
          paramShow.ba = parseInt(msgJson.ba.toString(), 16)
          paramShow.ca = parseInt(msgJson.ca.toString(), 16)
          paramShow.mainstatus = _this.indStatus(msgJson.mainstatus.toString())
          paramShow.stabilestatus = _this.indStatus(msgJson.stabilestatus.toString())
          paramShow.outswitchstatus = _this.indStatus(msgJson.outswitchstatus.toString())
          paramShow.stepstatus = _this.indStatus(msgJson.stepstatus.toString())
          paramShow.syncstatus = _this.indStatus(msgJson.syncstatus.toString())
          paramShow.autostatus = _this.indStatus(msgJson.autostatus.toString())
          paramShow.alarmstatus = ''
          paramShow.time = msgJson.time.toString()
          paramShow.receivedCatalogID = receivedCatalogID
          paramShow.expendFlag = true
          paramShow.remote = []
          // alarm process
          let alarmTable = this.alarmCheck(paramShow)
          // console.log('alarmTable============', alarmTable)
          if (alarmTable !== null) {
            this.alarmProcess(alarmTable)
            let alarm = this.alarmView(alarmTable)
            console.log('alarm============', alarm)
            paramShow.alarmstatus = alarm
          }
          // alarm restore
          for (let i = 0; i < _this.currentAlarmTable.length; i++) {
            if (this.currentAlarmTable[i].alarmmudid === paramShow.catalogid) {
              console.log('show_table发现当前告警记录已存在.............\n', this.currentAlarmTable[i], paramShow)
              let restoreTable = _this.alarmRestoreCheck(this.currentAlarmTable[i], paramShow)
              console.log('找到了告警恢复了嘛？？=', restoreTable)
              if (restoreTable.length > 0) {
                this.restoreProcess(restoreTable)
              }
            }
          }
          let exist = false
          for (let i = 0; i < _this.showTable.length; i++) {
            if (_this.showTable[i].station === paramShow.station) {
              console.log('show_table 发现电源已存在+——+——+——+——+——+——+——', _this.showTable[i], paramShow)
              // _this.showTable.splice(i, 1)
              _this.showTable[i].catalogid = paramShow.catalogid
              _this.showTable[i].station = paramShow.station
              _this.showTable[i].type = paramShow.type
              _this.showTable[i].com = paramShow.com
              _this.showTable[i].auv = paramShow.auv
              _this.showTable[i].buv = paramShow.buv
              _this.showTable[i].cuv = paramShow.cuv
              _this.showTable[i].aov = paramShow.aov
              _this.showTable[i].bov = paramShow.bov
              _this.showTable[i].cov = paramShow.cov
              _this.showTable[i].aoa = paramShow.aoa
              _this.showTable[i].boa = paramShow.boa
              _this.showTable[i].coa = paramShow.coa
              _this.showTable[i].afu = paramShow.afu
              _this.showTable[i].bfu = paramShow.bfu
              _this.showTable[i].cfu = paramShow.cfu
              _this.showTable[i].abcv = paramShow.abcv
              _this.showTable[i].av = paramShow.av
              _this.showTable[i].bv = paramShow.bv
              _this.showTable[i].cv = paramShow.cv
              _this.showTable[i].abca = paramShow.abca
              _this.showTable[i].aa = paramShow.aa
              _this.showTable[i].ba = paramShow.ba
              _this.showTable[i].ca = paramShow.ca
              _this.showTable[i].mainstatus = paramShow.mainstatus
              _this.showTable[i].stabilestatus = paramShow.stabilestatus
              _this.showTable[i].stepstatus = paramShow.stepstatus
              _this.showTable[i].syncstatus = paramShow.syncstatus
              _this.showTable[i].autostatus = paramShow.autostatus
              _this.showTable[i].alarmstatus = paramShow.alarmstatus
              _this.showTable[i].time = paramShow.time
              exist = true
              break
            }
          }
          if (!exist) {
            _this.showTable.unshift(paramShow)
            console.log('show_table电源AC参数push+++++++++++++++\n', paramShow)
          }
          for (let i = 0; i < _this.showTable.length; i++) {
            console.log('show_table电源AC参数表当前数据\n', _this.showTable[i])
          }
          console.log('show_table电源AC参数读取成功！param', paramShow)
        } else {
          console.log('show_table本次电源AC参数读取失败？？？', res)
          _this.readErrorNum = _this.readErrorNum + 1
          console.log('show_table累计参数读取失败次数==', _this.readErrorNum)
        }
      })
    },
    // alarmProcess
    alarmProcess (a) {
      console.log('show_table 查询到了告警！！！！！！！！！！\n', a)
      // 向上级vue发送alarmFired消息
      // this.$emit('alarmFired', a)
      // 查询当前告警列表
      // 新告警写入当前告警数据库
      // 跳转到当前告警界面并处理
    },
    // restoreProcess
    restoreProcess (r) {
      console.log('show_table 查询到了告警恢复！！！！！！！！！！\n', r)
      // 向上级vue发送alarmRestore消息
      // this.$emit('alarmRestored', r)
    },
    // alarm restore check
    alarmRestoreCheck (oldAlarm, newAlarm) {
      let restoredTable = []
      let arrayData = new Array(13)
      console.log('alarmRestoreCheck', oldAlarm, newAlarm)
      for (let i = 0; i < 13; i++) {
        arrayData[i] = {
          alarmid: '',
          alarmrestoreflag: false,
          alarmrestoreinfo: ''
        }
      }
      if (oldAlarm.alarmdetail === 'auv' && newAlarm.auv === false) {
        arrayData[0].alarmid = oldAlarm.alarmid
        arrayData[0].alarmrestoreflag = true
        arrayData[0].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[0])
      }
      if (oldAlarm.alarmdetail === 'buv' && newAlarm.buv === false) {
        arrayData[1].alarmid = oldAlarm.alarmid
        arrayData[1].alarmrestoreflag = true
        arrayData[1].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[1])
      }
      if (oldAlarm.alarmdetail === 'cuv' && newAlarm.cuv === false) {
        arrayData[2].alarmid = oldAlarm.alarmid
        arrayData[2].alarmrestoreflag = true
        arrayData[2].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[2])
      }
      if (oldAlarm.alarmdetail === 'aov' && newAlarm.aov === false) {
        arrayData[3].alarmid = oldAlarm.alarmid
        arrayData[3].alarmrestoreflag = true
        arrayData[3].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[3])
      }
      if (oldAlarm.alarmdetail === 'bov' && newAlarm.bov === false) {
        arrayData[4].alarmid = oldAlarm.alarmid
        arrayData[4].alarmrestoreflag = true
        arrayData[4].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[4])
      }
      if (oldAlarm.alarmdetail === 'cov' && newAlarm.cov === false) {
        arrayData[5].alarmid = oldAlarm.alarmid
        arrayData[5].alarmrestoreflag = true
        arrayData[5].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[5])
      }
      if (oldAlarm.alarmdetail === 'aoa' && newAlarm.aoa === false) {
        arrayData[6].alarmid = oldAlarm.alarmid
        arrayData[6].alarmrestoreflag = true
        arrayData[6].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[6])
      }
      if (oldAlarm.alarmdetail === 'boa' && newAlarm.boa === false) {
        arrayData[7].alarmid = oldAlarm.alarmid
        arrayData[7].alarmrestoreflag = true
        arrayData[7].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[7])
      }
      if (oldAlarm.alarmdetail === 'coa' && newAlarm.coa === false) {
        arrayData[8].alarmid = oldAlarm.alarmid
        arrayData[8].alarmrestoreflag = true
        arrayData[8].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[8])
      }
      if (oldAlarm.alarmdetail === 'afu' && newAlarm.afu === false) {
        arrayData[9].alarmid = oldAlarm.alarmid
        arrayData[9].alarmrestoreflag = true
        arrayData[9].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[9])
      }
      if (oldAlarm.alarmdetail === 'bfu' && newAlarm.bfu === false) {
        arrayData[10].alarmid = oldAlarm.alarmid
        arrayData[10].alarmrestoreflag = true
        arrayData[10].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[10])
      }
      if (oldAlarm.alarmdetail === 'cfu' && newAlarm.cfu === false) {
        arrayData[11].alarmid = oldAlarm.alarmid
        arrayData[11].alarmrestoreflag = true
        arrayData[11].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[11])
      }
      if (oldAlarm.alarmdetail === 'com' && newAlarm.com === false) {
        arrayData[12].alarmid = oldAlarm.alarmid
        arrayData[12].alarmrestoreflag = true
        arrayData[12].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[12])
      }
      return restoredTable
    },
    // alarm fired check
    alarmCheck (a) {
      let alarmFired = false
      alarmFired = a.auv | a.buv | a.cuv | a.aov | a.bov | a.cov | a.aoa | a.boa | a.coa | a.afu | a.bfu | a.cfu | a.com | a.apl | a.bpl | a.cpl | a.phaseloss
      let alarmTable0 = []
      let arrayData = new Array(17)
      for (let i = 0; i < 17; i++) {
        arrayData[i] = {
          alarmid: '',
          alarmstation: a.station,
          alarmmudid: a.catalogid,
          alarmreceivedtime: a.time,
          alarmfiredtime: a.time,
          alarmdetail: '',
          alarmreason: '',
          alarmlevel: '',
          alarmconfirmedflag: '',
          alarmconfirmedtime: '',
          alarmconfirmedinfo: '',
          alarmrestoreflag: '',
          alarmrestoreinfo: '',
          alarmsourceip: '',
          alarmaddition: ''
        }
      }
      if (alarmFired) {
        if (a.auv) {
          arrayData[0].alarmdetail = 'auv'
          arrayData[0].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[0].alarmdetail
          arrayData[0].alarmStatus = true
          arrayData[0].time = a.time
          console.log('auv', arrayData[0])
          alarmTable0.push(arrayData[0])
          console.log('auv后', alarmTable0)
        }
        if (a.buv) {
          arrayData[1].alarmdetail = 'buv'
          arrayData[1].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[1].alarmdetail
          arrayData[1].alarmStatus = true
          arrayData[1].time = a.time
          console.log('buv', arrayData[1])
          alarmTable0.push(arrayData[1])
          console.log('buv后', alarmTable0)
        }
        if (a.cuv) {
          arrayData[2].alarmdetail = 'cuv'
          arrayData[2].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[2].alarmdetail
          arrayData[2].alarmStatus = true
          arrayData[2].time = a.time
          console.log('cuv', arrayData[2])
          alarmTable0.push(arrayData[2])
          console.log('cuv后', alarmTable0)
        }
        if (a.aov) {
          arrayData[3].alarmdetail = 'aov'
          arrayData[3].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[3].alarmdetail
          arrayData[3].alarmStatus = true
          arrayData[3].time = a.time
          console.log('aov', arrayData[3])
          alarmTable0.push(arrayData[3])
          console.log('aov后', alarmTable0)
        }
        if (a.bov) {
          arrayData[4].alarmdetail = 'bov'
          arrayData[4].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[4].alarmdetail
          arrayData[4].alarmStatus = true
          arrayData[4].time = a.time
          console.log('buv', arrayData[4])
          alarmTable0.push(arrayData[4])
          console.log('buv后', alarmTable0)
        }
        if (a.cov) {
          arrayData[5].alarmdetail = 'cov'
          arrayData[5].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[5].alarmdetail
          arrayData[5].alarmStatus = true
          arrayData[5].time = a.time
          console.log('cov', arrayData[5])
          alarmTable0.push(arrayData[5])
          console.log('cov后', alarmTable0)
        }
        if (a.aoa) {
          arrayData[6].alarmdetail = 'aoa'
          arrayData[6].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[6].alarmdetail
          arrayData[6].alarmStatus = true
          arrayData[6].time = a.time
          console.log('aoa', arrayData[6])
          alarmTable0.push(arrayData[6])
          console.log('aoa后', alarmTable0)
        }
        if (a.boa) {
          arrayData[7].alarmdetail = 'boa'
          arrayData[7].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[7].alarmdetail
          arrayData[7].alarmStatus = true
          arrayData[7].time = a.time
          console.log('boa', arrayData[7])
          alarmTable0.push(arrayData[7])
          console.log('boa后', alarmTable0)
        }
        if (a.coa) {
          arrayData[8].alarmdetail = 'coa'
          arrayData[8].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[8].alarmdetail
          arrayData[8].alarmStatus = true
          arrayData[8].time = a.time
          console.log('coa', arrayData[8])
          alarmTable0.push(arrayData[8])
          console.log('coa后', alarmTable0)
        }
        if (a.apl) {
          arrayData[9].alarmdetail = 'apl'
          arrayData[9].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[9].alarmdetail
          arrayData[9].alarmStatus = true
          arrayData[9].time = a.time
          console.log('apl', arrayData[9])
          alarmTable0.push(arrayData[9])
          console.log('apl后', alarmTable0)
        }
        if (a.bpl) {
          arrayData[10].alarmdetail = 'bpl'
          arrayData[10].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[10].alarmdetail
          arrayData[10].alarmStatus = true
          arrayData[10].time = a.time
          console.log('bpl', arrayData[10])
          alarmTable0.push(arrayData[10])
          console.log('bpl后', alarmTable0)
        }
        if (a.cpl) {
          arrayData[11].alarmdetail = 'cpl'
          arrayData[11].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[11].alarmdetail
          arrayData[11].alarmStatus = true
          arrayData[11].time = a.time
          console.log('cpl', arrayData[11])
          alarmTable0.push(arrayData[11])
          console.log('cpl后', alarmTable0)
        }
        if (a.afu) {
          arrayData[12].alarmdetail = 'afu'
          arrayData[12].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[12].alarmdetail
          arrayData[12].alarmStatus = true
          arrayData[12].time = a.time
          console.log('afu', arrayData[12])
          alarmTable0.push(arrayData[12])
          console.log('afu后', alarmTable0)
        }
        if (a.bfu) {
          arrayData[13].alarmdetail = 'bfu'
          arrayData[13].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[13].alarmdetail
          arrayData[13].alarmStatus = true
          arrayData[13].time = a.time
          console.log('bfu', arrayData[13])
          alarmTable0.push(arrayData[13])
          console.log('bfu后', alarmTable0)
        }
        if (a.cfu) {
          arrayData[14].alarmdetail = 'cfu'
          arrayData[14].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[14].alarmdetail
          arrayData[14].alarmStatus = true
          arrayData[14].time = a.time
          console.log('cfu', arrayData[14])
          alarmTable0.push(arrayData[14])
          console.log('cfu后', alarmTable0)
        }
        if (a.phaseloss) {
          arrayData[15].alarmdetail = 'phaseloss'
          arrayData[15].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[15].alarmdetail
          arrayData[15].alarmStatus = true
          arrayData[15].time = a.time
          console.log('phaseloss', arrayData[15])
          alarmTable0.push(arrayData[15])
          console.log('phaseloss后', alarmTable0)
        }
        if (a.com) {
          arrayData[16].alarmdetail = 'com'
          arrayData[16].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[16].alarmdetail
          arrayData[16].alarmStatus = true
          arrayData[16].time = a.time
          console.log('com', arrayData[16])
          alarmTable0.push(arrayData[16])
          console.log('com后', alarmTable0)
        }
        console.log('查询到了告警！！！！！！！！！！\n', alarmTable0)
        return alarmTable0
      }
      return null
    },
    // 设置参数组件关闭
    closeModal () {
      this.modolType = null
      this.modolType0 = null
    }
  },
  computed: {
    ...mapGetters({
      TreeData: 'TreeData',
      updateTime: 'updateTime'
    })
  }
}
</script>
<style lang='' scoped>
table {
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;
}
tbody {
  display: block;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
thead,
tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
  word-break: break-all;
}
.childrentable {
  border-collapse: collapse;
  border: 1px solid  #409EFF;
}
.childrentable tr td {
  border-collapse: collapse;
  border: 1px solid  #4E545A;
}
.childrentable tr th {
  border-collapse: collapse;
  border: 1px solid  #4E545A;
}
.childrentable thead tr {
  background: #222428;
}

table tbody::-webkit-scrollbar {
  width: 6px;
}
table tbody::-webkit-scrollbar-thumb {
  background-color: #01f5f1;
  border-radius: 5px;
}
table tbody::-webkit-scrollbar-track {
  background-color: #004453;
}
table tbody::-webkit-scrollbar-thumb:hover {
  background-color: rgb(17, 177, 174);
}
table tbody::-webkit-scrollbar-thumb:active {
  background-color: rgb(9, 136, 134);
}
::-webkit-scrollbar{
  width: 5px;
  background: #4E545A
}
</style>
