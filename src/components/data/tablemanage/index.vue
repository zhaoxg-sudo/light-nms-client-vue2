<template>
  <div>
    <div class="tableTool">
         <!-- <button type="button" @click="prePlay" class="btn btn-sm btn-info" id="play"><i :class="recordPlay(recordState)" aria-hidden="true"></i>{{recordState}}</button> -->
         <!-- <a download @click="downLoad()" class="btn btn-sm btn-info"><i class="fa fa-cloud-download" aria-hidden="true"></i>导出</a> -->
         <label>电源站点&nbsp;&nbsp;&nbsp;&nbsp;</label>
         <el-select v-model="selectValue" :clearable="true" placeholder="请选择站点" ref="selectTree"  @clear="clearHandle">
           <el-option :key="selectValue" :value="selectValue" :label="selectValue" style="height: auto;">
             <!-- <div class="dept"> -->
             <el-tree :data="data" :props="defaultProps" node-key="id" :accordion="true" @node-click="handleNodeClick"></el-tree>
             <!-- </div> -->
           </el-option>
         </el-select>
         <label>显示图例&nbsp;&nbsp;&nbsp;&nbsp;</label>
         <el-select :popper-append-to-body="false" v-model="selectLegend" :clearable="true" placeholder="请选择图例"   @clear="clearLegend" @change="changeLegend">
           <el-option
             v-for="item in legends"
             :key="item.value"
             :label="item.label"
             :value="item.value"
             style="backgroud-color: #333">
           </el-option>
         </el-select>
      <div class="operate">
        <form class="form-inline">
          <div class="form-group">
            <span>
            <label>历史数据日期</label>
            <el-date-picker
              popper-class="elDatePicker"
              v-model="value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="backgroud-color: #333;">
            </el-date-picker>
            </span>
          </div>
          <button type="button" class="btn btn-info" @click="queryDataRecord">
            <i class="fa fa-search" aria-hidden="true"></i>查询</button>
        </form>
      </div>
    </div>
    <vbar v-if="barSelected.v==true" ref="vbar" :vData="vData" :vXy="vXy"></vbar>
    <abar v-if="barSelected.a==true" ref="abar" :aData="aData"></abar>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageData.pageIndex"
        :page-sizes="[6, 10, 15, 20]"
        :page-size="pageData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

import vbar from './echarts/vbar.vue'
import abar from './echarts/abar.vue'
export default {
  name: '',
  components: {
    vbar: vbar,
    abar: abar
  },
  props: [''],
  data () {
    return {
      value: '',
      stationType: '2',
      selectValue: '',
      selectLegend: 'lv',
      data: [],
      vData: [],
      vXy: {
        l0: '输入A相电压',
        l1: '输入B相电压',
        l2: '输入C相电压'
      },
      aData: [],
      barSelected: {
        v: true,
        a: false
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pageData: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      formData: {
        protocoltype: '2',
        catalogid: '',
        BeginTime: '',
        EndTime: ''
      },
      dataparam: [
        // ['Matcha Latte', 43.3, 85.8, 93.7]
      ],
      dataparama: [
        // ['Matcha Latte', 43.3, 85.8, 93.7]
      ],
      legends: [
        {
          value: 'lv',
          label: '电压柱线'
        },
        {
          value: 'la',
          label: '电流柱线'
        }
      ],
      instance: this.$ajax.create({
        baseURL: 'http://123.57.87.144:7001/'
      })
    }
  },
  watch: {},
  created () {
    this.selectValue = ''
    this.selectLegend = ''
    this.$nextTick(async () => {
      await this.getAllStation()
      // await this.getDeviceDataFromDB()
      // await this.getDeviceDataFromClsdDB()
      await this.getDeviceData()
    })
  },
  beforeMount () {},
  mounted () {},
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageData.pageIndex = val
      // this.getDeviceDataFromDB()
      // this.getDeviceDataFromClsdDB()
      this.getDeviceData()
    },
    handleNodeClick (data) {
      // 配置树形组件点击节点后，设置选择器的值，配置组件的数据
      this.selectValue = data.label
      this.formData.catalogid = data.catalogid
      this.formData.protocoltype = data.protocoltype
      // 根据站点类型,修改柱线名称
      switch (this.formData.protocoltype) {
        case '2':
          this.vXy.l0 = '输入A相电压'
          this.vXy.l1 = '输入B相电压'
          this.vXy.l2 = '输入C相电压'
          break
        case '8':
          this.vXy.l0 = '输入电压'
          this.vXy.l1 = '输出电压'
          this.vXy.l2 = '输出功率'
          break
      }
      // 调用子组件方法
      this.$refs.vbar.resetOption()
      // this.stationType = this.formData.protocoltype
      // 选择器执行完成后，使其失去焦点隐藏下拉框效果
      this.$refs.selectTree.blur()
      console.log('当前选中的站点名称：', this.selectValue, this.vXy)
      this.getDeviceData()
    },
    clearHandle () {
      this.selectValue = ''
      this.formData.catalogid = ''
    },
    changeLegend (l) {
      switch (l) {
        case 'lv' :
          this.barSelected.v = true
          this.barSelected.a = false
          break
        case 'la' :
          this.barSelected.a = true
          this.barSelected.v = false
          break
      }
      // refresh data
      // this.getDeviceDataFromDB()
      // this.getDeviceDataFromClsdDB()
      this.getDeviceData()
    },
    clearLegend () {
      this.selectLegend = ''
      this.barSelected.v = true
      this.barSelected.a = false
    },
    async getAllStation () {
      this.instance({
        'url': 'localall',
        'method': 'get'
      }).then((res) => {
        console.log('\ndatamanage get station tree return:')
        console.log(res.data)
        this.data = this.getJsonTree(res.data, {
          id: 'catalogid',
          pid: 'parentid',
          children: 'children'
        })
        console.log('datamanage生成树data:')
        console.log(this.data)
      })
    },
    async queryDataRecord () {
      /* eslint-disable no-extend-native */
      Date.prototype.format = function (format) {
        var o = {
          'M+': this.getMonth() + 1,
          'd+': this.getDate(),
          'H+': this.getHours(),
          'm+': this.getMinutes(),
          's+': this.getSeconds(),
          'q+': Math.floor((this.getMonth() + 3) / 3),
          'S': this.getMilliseconds()
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
        return format
      }
      console.log('value =', this.value)
      if (this.value) {
        if (typeof (this.value[0]) !== 'undefined' && this.value[0] !== null) {
          this.formData.BeginTime = this.value[0].format('yyyy-MM-dd HH:mm:ss')
        }
        if (typeof (this.value[1]) !== 'undefined' && this.value[1] !== null) {
          this.formData.EndTime = this.value[1].format('yyyy-MM-dd HH:mm:ss')
        }
        console.log('数据查询开始时间=', this.formData.BeginTime)
        console.log('数据查询结束时间=', this.formData.EndTime)
      } else {
        this.formData.BeginTime = ''
        this.formData.EndTime = ''
      }
      // await this.getDeviceDataFromDB()
      // await this.getDeviceDataFromClsdDB()
      await this.getDeviceData()
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
    alarmView (alarm) {
      // console.log('a=', alarm)
      let view = ''
      if (alarm.auv) {
        view = view + 'A相欠压' + ','
      }
      if (alarm.buv) {
        view = view + 'B相欠压' + ','
      }
      if (alarm.cuv) {
        view = view + 'c相欠压' + ','
      }
      if (alarm.aov) {
        view = view + 'A相过压' + ','
      }
      if (alarm.bov) {
        view = view + 'B相过压' + ','
      }
      if (alarm.cov) {
        view = view + 'C相过压' + ','
      }
      if (alarm.aoa) {
        view = view + 'A相过流' + ','
      }
      if (alarm.boa) {
        view = view + 'B相过流' + ','
      }
      if (alarm.coa) {
        view = view + 'C相过流' + ','
      }
      if (alarm.afu) {
        view = view + 'A相保险' + ','
      }
      if (alarm.bfu) {
        view = view + 'B相保险' + ','
      }
      if (alarm.cfu) {
        view = view + 'C相保险' + ','
      }
      if (alarm.com) {
        view = view + '通信故障' + ','
      }
      return view
    },
    dataAcReportFormat (report) {
      let datalist = {}
      datalist.catalogid = report.catalogid
      datalist.id = report.id
      datalist.code = report.code
      datalist.mudtype = report.mudtype
      if (report.devicetype === '2') {
        datalist.devicetype = '交流远端'
      }
      if (report.devicetype === '1') {
        datalist.devicetype = '直流局端'
      }
      datalist.com = this.alarmStatus(report.com)
      datalist.auv = this.alarmStatus(report.auv)
      datalist.buv = this.alarmStatus(report.buv)
      datalist.cuv = this.alarmStatus(report.cuv)
      datalist.aov = this.alarmStatus(report.aov)
      datalist.bov = this.alarmStatus(report.bov)
      datalist.cov = this.alarmStatus(report.cov)
      datalist.aoa = this.alarmStatus(report.aoa)
      datalist.boa = this.alarmStatus(report.boa)
      datalist.coa = this.alarmStatus(report.coa)
      datalist.apl = this.alarmStatus(report.apl)
      datalist.bpl = this.alarmStatus(report.bpl)
      datalist.cpl = this.alarmStatus(report.cpl)
      datalist.afu = this.alarmStatus(report.afu)
      datalist.bfu = this.alarmStatus(report.bfu)
      datalist.cfu = this.alarmStatus(report.cfu)
      datalist.inav = parseInt(report.inav.toString(), 16)
      datalist.inbv = parseInt(report.inbv.toString(), 16)
      datalist.incv = parseInt(report.incv.toString(), 16)
      datalist.outav = parseInt(report.outav.toString(), 16)
      datalist.outbv = parseInt(report.outbv.toString(), 16)
      datalist.outcv = parseInt(report.outcv.toString(), 16)
      datalist.inuab = parseInt(report.inuab.toString(), 16)
      datalist.inubc = parseInt(report.inubc.toString(), 16)
      datalist.inuca = parseInt(report.inuca.toString(), 16)
      datalist.outuab = parseInt(report.outuab.toString(), 16)
      datalist.outubc = parseInt(report.outubc.toString(), 16)
      datalist.outuca = parseInt(report.outuca.toString(), 16)
      datalist.phaseloss = this.alarmStatus(report.phaseloss)
      datalist.abcv = parseInt(report.abcv.toString(), 16) / 10
      datalist.av = parseInt(report.av.toString(), 16) / 10
      datalist.bv = parseInt(report.bv.toString(), 16) / 10
      datalist.cv = parseInt(report.cv.toString(), 16) / 10
      datalist.abca = parseInt(report.abca.toString(), 16) / 10
      datalist.aa = parseInt(report.aa.toString(), 16)
      datalist.ba = parseInt(report.ba.toString(), 16)
      datalist.ca = parseInt(report.ca.toString(), 16)
      datalist.mainstatus = this.indStatus(report.mainstatus.toString())
      datalist.stabilestatus = this.indStatus(report.stabilestatus.toString())
      datalist.outswitchstatus = this.indStatus(report.outswitchstatus.toString())
      datalist.stepstatus = this.indStatus(report.stepstatus.toString())
      datalist.syncstatus = this.indStatus(report.syncstatus.toString())
      datalist.autostatus = this.indStatus(report.autostatus.toString())
      datalist.timestamp = report.timestamp
      datalist.alarmstatus = this.alarmView(datalist)
      let temp = ['Matcha Latte', 43.3]
      let tempa = ['Matcha Latte', 43.3]
      // console.log(this.dataparameter[i])
      // temp[0] = datalist.timestamp
      temp[0] = datalist.id
      temp[1] = datalist.inav
      temp[2] = datalist.inbv
      temp[3] = datalist.incv
      this.dataparam.push(temp)
      tempa[0] = datalist.id
      tempa[1] = datalist.aa
      tempa[2] = datalist.ba
      tempa[3] = datalist.ca
      this.dataparama.push(tempa)
      console.log('this.dataparam===:', this.dataparam)
      console.log('this.dataparam.length===:', this.dataparam.length)
    },
    dataReportFormat (report) {
      let datalist = {}
      datalist.catalogid = report.catalogid
      datalist.id = report.id
      datalist.code = report.code
      datalist.mudtype = report.mudtype
      if (report.devicetype === '02') {
        datalist.devicetype = '交流远端'
      }
      if (report.devicetype === '1') {
        datalist.devicetype = '直流局端'
      }
      // datalist.com = this.alarmStatus(report.com)
      // datalist.auv = this.alarmStatus(report.auv)
      // datalist.buv = this.alarmStatus(report.buv)
      // datalist.cuv = this.alarmStatus(report.cuv)
      // datalist.aov = this.alarmStatus(report.aov)
      // datalist.bov = this.alarmStatus(report.bov)
      // datalist.cov = this.alarmStatus(report.cov)
      // datalist.aoa = this.alarmStatus(report.aoa)
      // datalist.boa = this.alarmStatus(report.boa)
      // datalist.coa = this.alarmStatus(report.coa)
      // datalist.afu = this.alarmStatus(report.afu)
      // datalist.bfu = this.alarmStatus(report.bfu)
      // datalist.cfu = this.alarmStatus(report.cfu)
      // datalist.abcv = parseInt(report.abcv.toString(), 16) / 10
      datalist.v = parseInt(report.v.toString(), 16) / 10
      datalist.a = parseInt(report.a.toString(), 16) / 1000
      // datalist.cv = parseInt(report.cv.toString(), 16) / 10
      // datalist.abca = parseInt(report.abca.toString(), 16) / 10
      // datalist.aa = parseInt(report.aa.toString(), 16) / 10
      // datalist.ba = parseInt(report.ba.toString(), 16) / 10
      // datalist.ca = parseInt(report.ca.toString(), 16) / 10
      // datalist.mainstatus = this.indStatus(report.mainstatus.toString())
      // datalist.stabilestatus = this.indStatus(report.stabilestatus.toString())
      // datalist.stepstatus = this.indStatus(report.stepstatus.toString())
      // datalist.syncstatus = this.indStatus(report.syncstatus.toString())
      // datalist.autostatus = this.indStatus(report.autostatus.toString())
      datalist.timestamp = report.timestamp
      // datalist.alarmstatus = this.alarmView(datalist)
      // this.dataparameter.push(datalist)
      let temp = ['Matcha Latte', 43.3]
      let tempa = ['Matcha Latte', 43.3]
      // console.log(this.dataparameter[i])
      // temp[0] = datalist.timestamp
      temp[0] = datalist.id
      temp[1] = datalist.v
      this.dataparam.push(temp)
      tempa[0] = datalist.id
      tempa[1] = datalist.a
      this.dataparama.push(tempa)
      console.log('this.dataparam===:', this.dataparam)
      console.log('this.dataparam.length===:', this.dataparam.length)
    },
    dataClsdReportFormat (report) {
      let datalist = {}
      datalist.catalogid = report.catalogid
      datalist.id = report.id
      datalist.code = report.code
      datalist.mudtype = report.mudtype
      if (report.devicetype === '8') {
        datalist.devicetype = '交流远端'
      }
      if (report.devicetype === '1') {
        datalist.devicetype = '直流局端'
      }
      datalist.inv = parseInt(report.inv.toString(), 16)
      datalist.outv = parseInt(report.outv.toString(), 16) / 10
      datalist.outw = parseInt(report.outw.toString(), 16)
      datalist.timestamp = report.timestamp
      // datalist.alarmstatus = this.alarmView(datalist)
      // this.dataparameter.push(datalist)
      let temp = ['Matcha Latte', 43.3]
      let tempa = ['Matcha Latte', 43.3]
      // console.log(this.dataparameter[i])
      // temp[0] = datalist.timestamp
      temp[0] = datalist.id
      temp[1] = datalist.inv
      temp[2] = datalist.outv
      temp[3] = datalist.outw
      this.dataparam.push(temp)
      // lishi
      tempa[0] = datalist.id
      // tempa[1] = datalist.outv
      // this.dataparama.push(tempa)
      // console.log('this.dataparam===:', this.dataparam)
      // console.log('this.dataparam.length===:', this.dataparam.length)
    },
    async dataSetFormat () {
      console.log('\nthis.dataparam:', this.dataparam)
      let _this = this
      console.log('\n_this.dataparam.length:', _this.dataparam.length)
      this.vData.splice(0, this.vData.length)
      this.aData.splice(0, this.aData.length)
      for (let i = 0; i < _this.dataparam.length; i++) {
        // v set
        let temp = ['Matcha Latte', 43.3]
        // console.log('this.dataparam[i]', _this.dataparam[i])
        temp[0] = _this.dataparam[i][0]
        temp[1] = _this.dataparam[i][1]
        temp[2] = _this.dataparam[i][2]
        temp[3] = _this.dataparam[i][3]
        this.vData.push(temp)
      }
      for (let i = 0; i < _this.dataparama.length; i++) {
      // a set
        let tempa = ['Matcha Latte', 43.3]
        // console.log('this.dataparama[i]', _this.dataparama[i])
        tempa[0] = _this.dataparama[i][0]
        tempa[1] = _this.dataparama[i][1]
        tempa[2] = _this.dataparama[i][2]
        tempa[3] = _this.dataparama[i][3]
        this.aData.push(tempa)
      }
      // reset option
      switch (this.selectLegend) {
        case 'lv' :
          this.$refs.vbar.reSetOptionV()
          break
        case 'la' :
          this.$refs.abar.reSetOptionA()
          break
        default :
          this.$refs.vbar.reSetOptionV()
      }
    },
    async getDeviceData () {
      switch (this.formData.protocoltype) {
        case '2':
          await this.getDeviceDataFromAcDB()
          break
        case '8':
          await this.getDeviceDataFromClsdDB()
          break
      }
    },
    async getDeviceDataFromAcDB () {
      let _this = this
      this.formData = Object.assign(this.formData, this.pageData)
      this.instance({
        'url': '/data/postdatapage',
        data: this.formData,
        'method': 'post'
      }).then((res) => {
        console.log('\npower page acdb--------------------------------:')
        console.log(res)
        let dataList = []
        if (res.data.list) {
          _this.dataparam = []
          res.data.list.forEach((num) => {
            _this.dataAcReportFormat(num)
            dataList.push(num)
          })
          console.log('getDeviceDataFromAcDB table')
          console.log(dataList)
          _this.pageData.total = res.data.total
        }
        _this.dataSetFormat()
      })
    },
    async getDeviceDataFromDB () {
      let _this = this
      this.formData = Object.assign(this.formData, this.pageData)
      this.instance({
        'url': '/data/postboxpage',
        data: this.formData,
        'method': 'post'
      }).then((res) => {
        console.log('\npower page boxdb--------------------------------:')
        console.log(res)
        let dataList = []
        if (res.data.list) {
          _this.dataparam = []
          res.data.list.forEach((num) => {
            _this.dataReportFormat(num)
            dataList.push(num)
          })
          console.log('\ngetDeviceDataFromDB table')
          console.log(dataList)
          _this.pageData.total = res.data.total
        }
        _this.dataSetFormat()
      })
    },
    async getDeviceDataFromClsdDB () {
      let _this = this
      this.formData = Object.assign(this.formData, this.pageData)
      this.instance({
        'url': '/data/postclsdpage',
        data: this.formData,
        'method': 'post'
      }).then((res) => {
        console.log('\npower page clsddb--------------------------------:')
        console.log(res)
        let dataList = []
        if (res.data.list) {
          _this.dataparam = []
          res.data.list.forEach((num) => {
            _this.dataClsdReportFormat(num)
            dataList.push(num)
          })
          console.log('\ngetDeviceDataFromClsdDB table')
          console.log(dataList)
          _this.pageData.total = res.data.total
        }
        _this.dataSetFormat()
      })
    },
    getJsonTree (data, config) {
      let id = config.id || 'id'
      let pid = config.pid || 'pid'
      let children = config.children || 'children'
      let idMap = []
      let jsonTree = []
      data.forEach(function (v) {
        idMap[v[id]] = v
      })
      data.forEach(function (v) {
        let parent = idMap[v[pid]]
        if (parent) {
          !parent[children] && (parent[children] = [])
          parent[children].push(v)
        } else {
          jsonTree.push(v)
        }
      })
      return jsonTree
    }
  },
  computed: {}
}
</script>
<style type="text/scss" rel="stylesheet/scss" lang="scss" scoped>
.elDatePicker {
   .el-picker-panel {
    background: #0f0472a9 !important;
    color: #ffffff;
    border: 1px solid #93bee7 !important;
    line-height: 20px;
  }
  .el-picker-panel .el-date-range-picker__time-header {
    border-bottom: 1px solid #93bee7 !important;
  }
  .el-picker-panel__icon-btn {
  width: 8px;
  height: 10px;
  color: #cbd3f0 !important;
}
.el-picker-panel .el-input__inner {
  background-color: #19466f;
  border: #75ebf2;
  color: #e8fdff;
}
.el-date-picker__header-label {
  color: #6ce6cb !important;
}
.el-date-picker__header-label:hover {
  color: #ffffff;
}
.el-date-table td.disabled div {
  background-color: #6891cfa8 !important;
}
.el-picker-panel .el-date-table th {
  color: #7d98a0;
}
.el-picker-panel .el-date-table td.available {
  font-size: 16px;
  font-weight: bold;
  color: #6ce6cb;
}
.el-picker-panel .el-date-table td.available:hover {
  color: #ffffff;
}
.el-picker-panel .el-date-table table caption h3, span {
  border-radius: 5px;
  color: #75ebf2;
  }
}
.block {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
.tableTool {
  .el-input input {
  color: #5bc0de!important;
}
.el-input__inner {
  color: #888!important;
}
.el-range-input {
  color: #5bc0de!important;
}
.el-tree-node__label {
  color: #409eee
}
}
.selected {
    border-color: #000;
    background: url(/static/img/jiaobiao04.fw.2d8fb46.png) no-repeat bottom right #aaaaaa;
}
.tableTool {
/deep/ .el-select-dropdown {
  // 若不将下拉框的背景颜色设置为：transparent，那么做不出来半透明的效果；
  // 因为其最终的显示为：下拉框有一个背景颜色且下拉框的字体有一个背景颜色，重叠后的效果展示；
  background-color: transparent;
  border: 1px solid #409EFF;
}
/deep/ .el-select-dropdown__item {
    font-size: 10px;
    line-height: 19px;
    color: #000;
    // font-weight: 200;
    background-color: #4e545a;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
 }
  ul li >>>.el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree >>>.is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
</style>
