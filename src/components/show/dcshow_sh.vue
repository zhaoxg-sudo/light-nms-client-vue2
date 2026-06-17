<template>
  <div class="show-area">
    <div class="musicMenuHalf">
      <div class="menuType">
        <!-- <i class="fa fa-list-ul" aria-hidden="true"></i>直流局端电源
        <div class="operate"> -->
          <form class="form-inline">
            <div class="form-group">
              <label>直流电源站点</label>
              <input type="text" v-model="currentCatalogLabel" class="form-control" style="width:200px;">
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
             <i class="fa fa-list-ul" aria-hidden="true"></i>输入参数
           </div>
           <form class="form-inline">
             <div class="form-group">
               <label>A相电压(V)</label>
               <input type="text" v-model="paramShow.inAv" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>B相电压(V)</label>
               <input type="text" v-model="paramShow.inBv" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>C相电压(V)</label>
               <input type="text" v-model="paramShow.inCv" class="form-control" style="width:120px;">
             </div>
           </form>
         </div>
         <div class="inputOutputHalf">
           <div class="menuType">
             <i class="fa fa-list-ul" aria-hidden="true"></i>输出参数
           </div>
           <form class="form-inline">
             <div class="form-group">
               <label>输出功率(kW)</label>
               <input type="text" v-model="paramShow.outKW" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>输出电压 ( V )</label>
               <input type="text" v-model="paramShow.outV" class="form-control" style="width:120px;">
             </div>
           </form>
           <form class="form-inline">
             <div class="form-group">
               <label>输出电流 ( A )</label>
               <input type="text" v-model="paramShow.outA" class="form-control" style="width:120px;">
             </div>
           </form>
         </div>
       </div>
       <div class="para-area">
         <div class="menuType">
           <i class="fa fa-list-ul" aria-hidden="true"></i>运行参数
         </div>
         <form class="form-inline">
           <div class="form-group">
             <label>运行时间</label>
             <input type="text" v-model="paramShow.runtime" class="form-control" style="width:100px;">
           </div>
           <div class="form-group">
             <label>运行温度</label>
             <input type="text" v-model="paramShow.temprature" class="form-control" style="width:100px;">
           </div>
           <div class="form-group">
             <label>设定输出电压</label>
             <input type="text" v-model="paramShow.setParamV" class="form-control" style="width:90px;">
           </div>
           <div class="form-group">
             <label>子模块额定功率</label>
             <input type="text" v-model="paramShow.subRatedKW" class="form-control" style="width:90px;">
           </div>
         </form>
         <div>
           <form class="form-inline">
              <div class="form-group">
             <label>输出电流百分比</label>
             <input type="text" v-model="paramShow.setparamampercetage" class="form-control" style="width:100px;">
           </div>
             <div class="form-group">
               <label>均流开关</label>
               <el-switch
                 v-model="paramShow.shareamFlag"
                 active-color="#13ce66"
                 inactive-color="#ff4949">
               </el-switch>
             </div>
              <div class="form-group">
               <label>自动开机</label>
               <el-switch
                 v-model="paramShow.autopoweronflag"
                 active-color="#13ce66"
                 inactive-color="#ff4949">
               </el-switch>
             </div>
           </form>
         </div>
       </div>
       <div class="module-area">
         <div class="menuType">
           <i class="fa fa-list-ul" aria-hidden="true"></i>模块参数
         </div>
         <div>
  <el-table
    :data="paramShow.subModuleList"
    stripe
    style="width: 100%"
    max-height="90">
    <el-table-column
      prop="slot"
      label="槽位"
      width="100">
    </el-table-column>
    <el-table-column
      prop="id"
      label="模块ID"
      width="100">
    </el-table-column>
  </el-table>
         </div>
       </div>
       <div class="set-area">
         <div class="menuType">
           <i class="fa fa-list-ul" aria-hidden="true"></i>参数设置
         </div>
       <div>
          <button type="button" class="btn btn-sm btn-info" @click="setOnOff">控制电源开关机</button>
          <button type="button" class="btn btn-sm btn-info" @click="setParam">设置电源参数</button>
      </div>
        <div>
          <div v-if="modolType0!=null && modolType0>-2">
            <powersetonoff :onoffparameter="onoffparameter" :modolType="modolType" @close="closeModal" @getSetOnOff="getSetOnOff" @downloadSetOnOff="downloadSetOnOff"></powersetonoff>
          </div>
          <div v-if="modolType!=null && modolType>-2">
            <powersetparam :powerparameter="setpowerparam" :modolType="modolType" @close="closeModal" @getParam="refreshSetParam" @setParam="downloadSetParam"></powersetparam>
          </div>
        </div>
       </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import powersetonoff from './powersetonoff.vue'
import powersetparam from './setParam.vue'

export default {
  name: '',
  components: {
    powersetonoff: powersetonoff,
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
        inAv: '',
        inBv: '',
        inCv: '',
        outKW: '',
        outV: '',
        outA: '',
        runtime: '',
        temprature: '',
        ratedKW: '',
        subRatedKW: '',
        setParamV: '',
        setparamampercetage: '',
        shareamFlag: true,
        autopoweronflag: true,
        subModuleList: [],
        subModuleNum: 0
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
    // 'TreeData': {
    //   handler: async function (data) {
    //     console.log('dcshow_sh show model has watched  tree data id ,labal:=', data.catalogid, data.label)
    //     this.currentCatalogID = data.catalogid
    //     this.currentCatalogLabel = data.label
    //     this.$nextTick(async function () {
    //     })
    //   },
    //   deep: true
    // }
  },
  created () {},
  beforeMount () {},
  mounted () {},
  methods: {
    refresh () {
      this.runStatus()
      this.getSetParam()
      this.subModuleID()
    },
    // 设置参数组件关闭
    closeModal () {
      this.modolType = null
      this.modolType0 = null
    },
    // set组件刷新配置参数
    refreshSetParam () {
      console.log('收到子组件发送的刷新指令')
      this.refresh()
    },
    // du读取开关机
    getSetOnOff () {
      console.log('点击了：读取电源开关机的按钮')
      if (this.onoffparameter.length > 0) {
        for (let i in this.onoffparameter) {
          this.getAlarmData(this.onoffparameter[i].id)
          console.log(this.runMsg)
        }
      }
    },
    // download读取开关机
    downloadSetOnOff (param) {
      console.log('点击了：download电源开关机的按钮')
      console.log(param)
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
    // 读取运行状态
    runStatus () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次读取运行状态的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getrunstatus/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res电源运行状态读取成功！', res)
          let msg = res.data.result
          console.log('msg电源运行状态读取成功！', msg)
          let msgJson = JSON.parse(msg)
          console.log('msg电源运行状态读取成功json！', msgJson)
          let outv = ''
          outv = msgJson.outv.toString()
          _this.paramShow.inAv = msgJson.inav.toString()
          _this.paramShow.inBv = msgJson.inbv.toString()
          _this.paramShow.inCv = msgJson.incv.toString()
          _this.paramShow.outKW = msgJson.realtimew.toString()
          _this.paramShow.outV = msgJson.outv.toString()
          _this.paramShow.outA = msgJson.outa.toString()
          _this.paramShow.runtime = msgJson.realtime.toString()
          _this.paramShow.temprature = msgJson.temperature.toString()
          _this.paramShow.ratedKW = msgJson.ratedw.toString()
          console.log('msg电源运行状态读取成功！param', _this.paramShow)
          _this.runMsg = '输出电压: ' + outv
        } else {
          console.log('电源运行状态读取失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '电源运行状态: ' + msg
        }
      })
    },
    // 读取设置参数
    getSetParam () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次读取设置参数的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getsetparam/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res电源设置参数读取成功！', res)
          let msg = res.data.result
          console.log('msg电源设置参数读取成功！', msg)
          let msgJson = JSON.parse(msg)
          let setparamv = ''
          setparamv = msgJson.setparamv.toString()
          console.log('msg电源设置参数读取成功！', setparamv)
          _this.paramShow.setParamV = setparamv + 'V'
          let shareamFlag
          let autopoweronflag
          let setparamamPercetage
          let subRatedKW
          shareamFlag = msgJson.shareamflag.toString()
          autopoweronflag = msgJson.autopoweronflag.toString()
          if (shareamFlag === '55') {
            _this.paramShow.shareamFlag = false
          } else _this.paramShow.shareamFlag = true
          if (autopoweronflag === '55') {
            _this.paramShow.autopoweronflag = false
          } else _this.paramShow.shareamFlag = true
          setparamamPercetage = msgJson.setparamampercetage.toString()
          _this.paramShow.setparamampercetage = setparamamPercetage + '%'
          subRatedKW = msgJson.submoduleratedkw.toString()
          switch (subRatedKW) {
            case '00':
              _this.paramShow.subRatedKW = '20KW'
              break
            case '01':
              _this.paramShow.subRatedKW = '15KW'
              break
            case '02':
              _this.paramShow.subRatedKW = '10KW'
              break
            case '03':
              _this.paramShow.subRatedKW = '7.5KW'
              break
          }
          _this.runMsg = '设置电压值: ' + setparamv
          // 更新 store
          _this.setpowerparam.setparamv = setparamv
          _this.setpowerparam.setparamampercetage = _this.paramShow.setparamampercetage
          _this.setpowerparam.setshareamflag = shareamFlag
          _this.setpowerparam.setautopoweronflag = autopoweronflag
          _this.setpowerparam.setsubratedkw = subRatedKW
          _this.setpowerparam.index = _this.setpowerparam.index + 1
          // this.$store.dispatch('updateTime', _this.setpowerparam)
          // console.log('电源设置参数读取成功，更新store', _this.setpowerparam)
          setTimeout(() => { this.$message.success('电源设置参数读取成功！') }, 500)
        } else {
          console.log('电源设置参数读取失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '设置电压值: ' + msg
          setTimeout(() => { this.$message.success('电源设置参数读取失败？？？') }, 500)
        }
      })
    },
    // 读取子模块ID
    subModuleID () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次读取子模块ID的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getsubmoduleid/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          // console.log('res电源子模块ID读取成功！', res)
          let msg = res.data.result
          console.log('msg电源子模块ID读取成功！', msg)
          let msgJson = JSON.parse(msg)
          let submodulenum = ''
          let submoduleList = []
          let temModuleList = []
          submodulenum = msgJson.submodulenum.toString()
          // submodulenum = 2
          submoduleList = msgJson.submodulelist
          console.log('submoduleList！', submoduleList)
          let slotlist = {
            slot: '',
            id: '',
            status: '',
            selected: false
          }
          let slot = 1
          for (let i in submoduleList) {
            slotlist.slot = slot
            slot = slot + 1
            slotlist.id = submoduleList[i]
            temModuleList.push(slotlist)
          }
          // submoduleList = [{slot: 0, id: 1}, {slot: 1, id: 2}]
          // _this.paramShow.subModuleList = submoduleList
          _this.paramShow.subModuleNum = submodulenum
          _this.paramShow.subModuleList = temModuleList
          console.log('msg电源子模块ID读取成功!!!!!', _this.paramShow.subModuleList)
          _this.runMsg = '子模块ID数量: ' + submodulenum
        } else {
          console.log('电源子模块ID读取失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '子模块ID数量: ' + msg
        }
      })
    },
    // 读取告警参数
    getAlarmData (id) {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次读取告警参数的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getalarmdata/' + catalogid + '/' + id,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res电源告警参数读取成功！', res)
          let msg = res.data.result
          console.log('msg电源告警参数读取成功！', msg)
          let msgJson = JSON.parse(msg)
          let alarmbyte2 = ''
          alarmbyte2 = msgJson.alarmbyte2.poweronoff.toString()
          console.log('msg电源告警参数读取成功！', alarmbyte2)
          _this.runMsg = '告警字节2->poweronoff: ' + alarmbyte2
          setTimeout(() => { this.$message.success('电源告警参数读取成功！') }, 500)
        } else {
          console.log('电源告警参数读取失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '告警字节2: ' + msg
          setTimeout(() => { this.$message.success('电源告警参数读取失败?????') }, 500)
        }
      })
    },
    // 控制电源开机
    setPowerOn () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次控制电源开机的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getpoweron/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res控制电源开机读取成功！', res)
          let msg = res.data.result
          console.log('msg控制电源开机成功！', msg)
          let msgJson = JSON.parse(msg)
          let setpoweron = ''
          setpoweron = msgJson.onoff.toString()
          console.log('msg控制电源开机成功！', setpoweron)
          _this.runMsg = '控制电源开机: ' + setpoweron
        } else {
          console.log('控制电源开机失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '开机: ' + msg
        }
      })
    },
    // 控制电源关机
    setPowerOff () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次控制电源关的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getpoweroff/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res控制电源关成功！', res)
          let msg = res.data.result
          console.log('msg控制电源关成功！', msg)
          let msgJson = JSON.parse(msg)
          let setpoweroff = ''
          setpoweroff = msgJson.onoff.toString()
          console.log('msg控制电源关成功！', setpoweroff)
          _this.runMsg = '控制电源关机: ' + setpoweroff
        } else {
          console.log('控制电源关机失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '关机: ' + msg
        }
      })
    },
    // 设置电源参数
    setPowerParam (param) {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次设置电源参数的catalogid：=', catalogid)
      let temp = {}
      temp.catalogid = catalogid
      temp.setparamv = 6500
      temp.setparamampercetage = 0x64
      temp.shareamflag = 0x55
      temp.autopoweronflag = 0x55
      temp.submoduleratedkw = 0x02
      this.instance({
        url: '/device/local/setpowerparam',
        method: 'post',
        data: temp
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res设置电源参数！', res)
          let msg = res.data.result
          console.log('msg设置电源参数！', msg)
          let msgJson = JSON.parse(msg)
          let catalogid = ''
          catalogid = msgJson.onoff.toString()
          console.log('msg设置电源参数关成功！', catalogid)
          _this.runMsg = '设置电源参数: ' + catalogid
          setTimeout(() => { this.$message.success('电源设置参数下发成功！') }, 500)
        } else {
          console.log('设置电源参数失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '设置电源参数: ' + msg
        }
      })
    }
  },
  computed: {
    // ...mapGetters({
    //   TreeData: 'TreeData'
    // })
  }
}
</script>
<style lang='' scoped>
.show-area {
    height: 500px;
    background: dimgray;
}

.para-area {
    height: 95px;
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
    height: 60px;
    margin: 1%;
    border-radius: 4px;
    background: #313439;
}
.inputOutput {
    height: 150px;
    background: dimgray;
}
/* .el-table {
    background:#313439;
    color: #fff;
} */
</style>
