<template>
  <div class="show-area">
    <div class="musicMenuHalf">
      <div class="menuType">
        <!-- <i class="fa fa-list-ul" aria-hidden="true"></i>交流局端电源 -->
        <!-- <div class="operateAc"> -->
          <form class="form-inline">
            <div class="form-group">
              <label>交流电源站点</label>
              <input type="text" v-model="currentCatalog.label" class="form-control" style="width:200px;">
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
             <i class="fa fa-list-ul" aria-hidden="true"></i>输入相电压
           </div>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输入A相电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.inav" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输入B相电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.inbv" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输入C相电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.incv" class="form-control" style="width:120px;">
             </div>
           </form>
         </div>
         <div class="inputOutputHalf">
           <div class="menuType">
             <i class="fa fa-list-ul" aria-hidden="true"></i>输出相电压
           </div>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输出A相电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.outav" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输出B相电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.outbv" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输出C相电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.outcv" class="form-control" style="width:120px;">
             </div>
           </form>
         </div>
         <div class="inputOutputHalf">
           <div class="menuType">
             <i class="fa fa-list-ul" aria-hidden="true"></i>输入线电压
           </div>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输入AB线电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.inuab" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输入BC线电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.inubc" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输入CA线电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.inuca" class="form-control" style="width:120px;">
             </div>
           </form>
         </div>
         <div class="inputOutputHalf">
           <div class="menuType">
             <i class="fa fa-list-ul" aria-hidden="true"></i>输出线电压
           </div>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输出AB线电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.outuab" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输出BC线电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.outubc" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输出CA线电压(V)&nbsp;</label>
               <input type="text" v-model="paramShow.outuca" class="form-control" style="width:120px;">
             </div>
           </form>
         </div>
         <div class="inputOutputHalf">
           <div class="menuType">
             <i class="fa fa-list-ul" aria-hidden="true"></i>输入相电流
           </div>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输入A相电流(A)&nbsp;</label>
               <input type="text" v-model="paramShow.aa" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输入B相电流(A)&nbsp;</label>
               <input type="text" v-model="paramShow.ba" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;输入C相电流(A)&nbsp;</label>
               <input type="text" v-model="paramShow.ca" class="form-control" style="width:120px;">
             </div>
           </form>
         </div>
       </div>
       <div class="run-area">
         <div class="menuType">
           <i class="fa fa-list-ul" aria-hidden="true"></i>运行参数
         </div>
        <div>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;市电指示</label>
               <el-switch
                 v-model="paramShow.mainstatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
             </div>
              <div class="form-group">
               <label>稳压指示</label>
               <el-switch
                 v-model="paramShow.stabilestatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
             </div>
              <div class="form-group">
               <label>输出开关</label>
               <el-switch
                 v-model="paramShow.outswitchstatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
             </div>
           </form>
         </div>
       </div>
         <div class="alarm-area">
           <div class="menuType">
             <i class="fa fa-list-ul" aria-hidden="true"></i>故障状态
           </div>
         <div>
           <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;A相欠压</label>
               <el-switch
                 v-model="paramShow.auv"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
              <div class="form-group">
               <label>B相欠压</label>
               <el-switch
                 v-model="paramShow.buv"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
               <div class="form-group">
               <label>C相欠压</label>
               <el-switch
                 v-model="paramShow.cuv"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
              <div class="form-group">
               <label>A相过压</label>
               <el-switch
                 v-model="paramShow.aov"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
             <div class="form-group">
               <label>B相过压</label>
               <el-switch
                 v-model="paramShow.bov"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
              <div class="form-group">
               <label>C相过压</label>
               <el-switch
                 v-model="paramShow.cov"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
           </form>
            <form class="form-inline">
             <div class="form-group">
               <label>&nbsp;&nbsp;A相过流</label>
               <el-switch
                 v-model="paramShow.aoa"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
              <div class="form-group">
               <label>B相过流</label>
               <el-switch
                 v-model="paramShow.boa"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
               <div class="form-group">
               <label>C相过流</label>
               <el-switch
                 v-model="paramShow.coa"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
              <div class="form-group">
               <label>A相缺相</label>
               <el-switch
                 v-model="paramShow.apl"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
             <div class="form-group">
               <label>B相缺相</label>
               <el-switch
                 v-model="paramShow.bpl"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
              <div class="form-group">
               <label>C相缺相</label>
               <el-switch
                 v-model="paramShow.cpl"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
           </form>
           <form class="form-inline">
                <div class="form-group">
               <label>&nbsp;&nbsp;A相保险</label>
               <el-switch
                 v-model="paramShow.afu"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
             <div class="form-group">
               <label>B相保险</label>
               <el-switch
                 v-model="paramShow.bfu"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
              <div class="form-group">
               <label>C相保险</label>
               <el-switch
                 v-model="paramShow.cfu"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
             <div class="form-group">
               <label>相序错误</label>
               <el-switch
                 v-model="paramShow.phaseloss"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
             <div class="form-group">
               <label>通信故障</label>
               <el-switch
                 v-model="paramShow.com"
                 active-color="#ff4949"
                 inactive-color="#999">
               </el-switch>
             </div>
           </form>
         </div>
       </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'

export default {
  name: '',
  components: {
  },
  props: ['currentCatalog', 'allChildrenList'],
  data () {
    return {
      runtime: '1111',
      readErrorNum: 0,
      autoUpdate: false,
      updatetime: 5000,
      updateTimer: null,
      acCurrentCatalogID: '',
      currentCatalogLabelAc: '',
      showTable: [],
      currentAlarmTable: [],
      paramShow: {
        station: '',
        type: '',
        com: true,
        auv: true,
        buv: true,
        cuv: true,
        aov: true,
        bov: true,
        cov: true,
        aoa: true,
        boa: true,
        coa: true,
        apl: true,
        bpl: true,
        cpl: true,
        afu: true,
        bfu: true,
        cfu: true,
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
        mainstatus: true,
        stabilestatus: true,
        stepstatus: true,
        syncstatus: true,
        autostatus: true,
        reserved1: '',
        reserved2: '',
        ymdhms: '',
        electricaltimeswitch: '',
        electricaltimeswitchtime: '',
        outswitchstatus: ''
      },
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  watch: {
    'TreeData': {
      handler: async function (data) {
        // console.log('acshow_ab show model has watched  tree data id ,labal:=', data.catalogid, data.label)
        // console.log('this.acCurrentCatalogID==', this.currentCatalogID)
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
    this.$nextTick(async () => {
      this.refresh()
      if (this.autoUpdate === true) {
        if (this.updateTimer) {
          console.log('created() updateTimer is exist!!!', this.updateTimer)
        } else {
          this.updateTimer = setInterval(() => {
            console.log('acshow发起参数更新')
            this.refresh()
          }, _this.updatetime)
          console.log('acshow开启了定时器++++++++=', this.updateTimer)
        }
      } else if (this.autoUpdate === false) {
        console.log('acshow进入了关掉自动读取定时器')
        if (this.updateTimer) {
          clearInterval(this.updateTimer)
          this.updateTimer = null
        }
      }
    })
  },
  beforeDestroy () {
    if (this.updateTimer) {
      console.log('acshow关掉自动读取定时器--------------------:', this.updateTimer)
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }
  },
  methods: {
    changeType (type) {
      this.autoUpdate = !this.autoUpdate
      if (this.autoUpdate === true) {
        console.log('acshow开启自动读取定时器')
        if (this.updateTimer) {
        } else {
          this.updateTimer = setInterval(() => {
            console.log('acshow发起参数更新请求')
            this.refresh()
          }, 5000)
          console.log('acshow开启了定时器++++++++=', this.updateTimer)
        }
      } else if (this.autoUpdate === false) {
        console.log('acshow进入了关掉自动读取定时器')
        if (this.updateTimer) {
          console.log('acshow关掉自动读取定时器', this.updateTimer)
          clearInterval(this.updateTimer)
          this.updateTimer = null
        }
      }
      $('.selected').removeClass('selected')
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
    // 设置参数组件关闭
    closeModal () {
      this.modolType = null
      this.modolType0 = null
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
    // 读取运行状态
    async refresh () {
      let catalogid = this.currentCatalog.id
      let _this = this
      // catalogid = '4444'
      let ipaddress = this.currentCatalog.ipaddress
      await this.getAllCurrentAlarm()
      console.log('acshow_ab 这次读取运行状态的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getacparamfromagent/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          // console.log('res电源运行状态读取成功！', res)
          let msg = res.data.result
          // console.log('msg电源运行状态读取成功！', msg)
          let msgJson = JSON.parse(msg)
          let receivedAddress = msgJson.ipaddress.toString()
          if (ipaddress === receivedAddress) {
            console.log('acshow_ab电源运行状态读取成功json！', msgJson, catalogid)
          } else {
            console.log('acshow_ab电源运行状态读取失败？？？？？？？？？json！', msgJson, catalogid)
          }
          _this.paramShow.catalogid = catalogid
          _this.paramShow.station = _this.currentCatalog.label
          _this.paramShow.type = '交流'
          _this.paramShow.com = _this.alarmStatus(msgJson.com.toString())
          _this.paramShow.auv = _this.alarmStatus(msgJson.auv.toString())
          _this.paramShow.buv = _this.alarmStatus(msgJson.buv.toString())
          _this.paramShow.cuv = _this.alarmStatus(msgJson.cuv.toString())
          _this.paramShow.aov = _this.alarmStatus(msgJson.aov.toString())
          _this.paramShow.bov = _this.alarmStatus(msgJson.bov.toString())
          _this.paramShow.cov = _this.alarmStatus(msgJson.cov.toString())
          _this.paramShow.aoa = _this.alarmStatus(msgJson.aoa.toString())
          _this.paramShow.boa = _this.alarmStatus(msgJson.boa.toString())
          _this.paramShow.coa = _this.alarmStatus(msgJson.coa.toString())
          _this.paramShow.apl = _this.alarmStatus(msgJson.apl.toString())
          _this.paramShow.bpl = _this.alarmStatus(msgJson.bpl.toString())
          _this.paramShow.cpl = _this.alarmStatus(msgJson.cpl.toString())
          _this.paramShow.afu = _this.alarmStatus(msgJson.afu.toString())
          _this.paramShow.bfu = _this.alarmStatus(msgJson.bfu.toString())
          _this.paramShow.cfu = _this.alarmStatus(msgJson.cfu.toString())
          _this.paramShow.phaseloss = _this.alarmStatus(msgJson.phaseloss.toString())
          _this.paramShow.inav = parseInt(msgJson.inav.toString(), 16)
          _this.paramShow.inbv = parseInt(msgJson.inbv.toString(), 16)
          _this.paramShow.incv = parseInt(msgJson.incv.toString(), 16)
          _this.paramShow.outav = parseInt(msgJson.outav.toString(), 16)
          _this.paramShow.outbv = parseInt(msgJson.outbv.toString(), 16)
          _this.paramShow.outcv = parseInt(msgJson.outcv.toString(), 16)
          _this.paramShow.inuab = parseInt(msgJson.inuab.toString(), 16)
          _this.paramShow.inubc = parseInt(msgJson.inubc.toString(), 16)
          _this.paramShow.inuca = parseInt(msgJson.inuca.toString(), 16)
          _this.paramShow.outuab = parseInt(msgJson.outuab.toString(), 16)
          _this.paramShow.outubc = parseInt(msgJson.outubc.toString(), 16)
          _this.paramShow.outuca = parseInt(msgJson.outuca.toString(), 16)
          _this.paramShow.abcv = parseInt(msgJson.abcv.toString(), 16) / 10
          _this.paramShow.av = parseInt(msgJson.av.toString(), 16) / 10
          _this.paramShow.bv = parseInt(msgJson.bv.toString(), 16) / 10
          _this.paramShow.cv = parseInt(msgJson.cv.toString(), 16) / 10
          _this.paramShow.abca = parseInt(msgJson.abca.toString(), 16) / 10
          _this.paramShow.aa = parseInt(msgJson.aa.toString(), 16)
          _this.paramShow.ba = parseInt(msgJson.ba.toString(), 16)
          _this.paramShow.ca = parseInt(msgJson.ca.toString(), 16)
          _this.paramShow.mainstatus = _this.indStatus(msgJson.mainstatus.toString())
          _this.paramShow.stabilestatus = _this.indStatus(msgJson.stabilestatus.toString())
          _this.paramShow.outswitchstatus = _this.indStatus(msgJson.outswitchstatus.toString())
          _this.paramShow.stepstatus = _this.indStatus(msgJson.stepstatus.toString())
          _this.paramShow.syncstatus = _this.indStatus(msgJson.syncstatus.toString())
          _this.paramShow.autostatus = _this.indStatus(msgJson.autostatus.toString())
          _this.paramShow.time = msgJson.time.toString()
          // alarm restore
          for (let i = 0; i < _this.currentAlarmTable.length; i++) {
            if (this.currentAlarmTable[i].alarmmudid === _this.paramShow.catalogid) {
              console.log('acShow发现当前告警记录已存在.............\n', this.currentAlarmTable[i], _this.paramShow)
              let restoreTable = _this.alarmRestoreCheck(this.currentAlarmTable[i], _this.paramShow)
              console.log('acShow找到了告警恢复了嘛？？=', restoreTable)
              if (restoreTable.length > 0) {
                this.restoreProcess(restoreTable)
              }
            }
          }
          let exist = false
          for (let i = 0; i < _this.showTable.length; i++) {
            if (_this.showTable[i].station === _this.paramShow.station) {
              // for restore
              // let restoreTable = _this.alarmRestoreCheck(_this.paramShow)
              // if (restoreTable.length > 0) {
              //   this.restoreProcess(restoreTable)
              // }
              // end for restore
              _this.showTable[i] = _this.paramShow
              exist = true
              break
            }
          }
          if (!exist) _this.showTable.push(_this.paramShow)
          console.log('acShow电源AC参数读取成功！param', _this.paramShow)
          // alarm process
          let alarmTable = this.alarmCheck(_this.paramShow)
          if (alarmTable) {
            this.alarmProcess(alarmTable)
          }
          // console.log('msg电源AC参数读取成功！param', _this.paramShow)
        } else {
          console.log('本次电源AC参数读取失败？？？', res)
          _this.readErrorNum = _this.readErrorNum + 1
          console.log('累计参数读取失败次数==', _this.readErrorNum)
        }
      })
    },
    // restoreProcess
    restoreProcess (r) {
      console.log('acShow 查询到了告警恢复！！！！！！！！！！\n', r)
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
    // alarmProcess
    alarmProcess (a) {
      console.log('acShow查询到了告警！！！！！！！！！！\n', a)
      // 向上级vue发送alarmFired消息
      // this.$emit('alarmFired', a)
    },
    // alarm check
    alarmCheck (a) {
      let alarmFired = false
      alarmFired = a.auv | a.buv | a.cuv | a.aov | a.bov | a.cov | a.aoa | a.boa | a.coa | a.afu | a.bfu | a.cfu
      let alarmTable0 = []
      let arrayData = new Array(13)
      for (let i = 0; i < 13; i++) {
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
        if (a.afu) {
          arrayData[9].alarmdetail = 'afu'
          arrayData[9].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[9].alarmdetail
          arrayData[9].alarmStatus = true
          arrayData[9].time = a.time
          console.log('afu', arrayData[9])
          alarmTable0.push(arrayData[9])
          console.log('afu后', alarmTable0)
        }
        if (a.bfu) {
          arrayData[10].alarmdetail = 'bfu'
          arrayData[10].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[10].alarmdetail
          arrayData[10].alarmStatus = true
          arrayData[10].time = a.time
          console.log('bfu', arrayData[10])
          alarmTable0.push(arrayData[10])
          console.log('bfu后', alarmTable0)
        }
        if (a.cfu) {
          arrayData[11].alarmdetail = 'cfu'
          arrayData[11].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[11].alarmdetail
          arrayData[11].alarmStatus = true
          arrayData[11].time = a.time
          console.log('cfu', arrayData[11])
          alarmTable0.push(arrayData[11])
          console.log('cfu后', alarmTable0)
        }
        if (a.com) {
          arrayData[12].alarmdetail = 'com'
          arrayData[12].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[12].alarmdetail
          arrayData[12].alarmStatus = true
          arrayData[12].time = a.time
          console.log('com', arrayData[12])
          alarmTable0.push(arrayData[12])
          console.log('com后', alarmTable0)
        }
        console.log('acShow查询到了告警！！！！！！！！！！\n', alarmTable0)
        return alarmTable0
      }
      return null
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
/* .show-area {
    height: 420px;
    background: dimgray;
}

.run-area {
    height: 75px;
    margin: 3px;
    border-radius: 4px;
    background: #313439;
}

.alarm-area {
   height: 70px;
   margin: 3px;
   border-radius: 4px;
   background: #313439;
}

.inputOutput {
    height: 185px;
    background: dimgray;
} */
/* .el-table {
    background:#313439;
    color: #fff;
} */
</style>
