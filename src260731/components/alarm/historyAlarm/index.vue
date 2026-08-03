<template>
  <div>
      <div class="tableTool">
      <!-- <button type="button" @click="prePlay" class="btn btn-sm btn-info" id="play"><i :class="recordPlay(recordState)" aria-hidden="true"></i>{{recordState}}</button> -->
      <!-- <a download @click="downLoad()" class="btn btn-sm btn-info"><i class="fa fa-cloud-download" aria-hidden="true"></i>导出</a> -->
      <downloadExcel
           class = "btn btn-info"
           :data = "alarmparameter"
           :fields = "json_fields"
           :type="fileType"
           :header="header"
           :worksheet="workSheet"
           :before-generate = "setFileName"
           :name = "name">
           <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
           <a><i class="fa fa-cloud-download" aria-hidden="true"></i>导出Excel</a>
         </downloadExcel>
         <label>电源站点&nbsp;&nbsp;&nbsp;&nbsp;</label>
         <el-select v-model="selectValue" :clearable="true" placeholder="请选择站点" ref="selectTree"  @clear="clearHandle">
           <el-option :key="selectValue" :value="selectValue" :label="selectValue" style="height: auto;">
             <el-tree :data="data" :props="defaultProps" node-key="id" :accordion="true" @node-click="handleNodeClick"></el-tree>
           </el-option>
         </el-select>
      <div class="operate">
        <form class="form-inline">
          <div class="form-group">
            <span>
            <label>告警发生时间</label>
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
          <!-- <div class="form-group">
            <label>告警设备</label>
            <input type="text" v-model.number="formData.device" class="form-control" style="width:70px;">
          </div> -->
          <!-- <div class="form-group">
            <label>告警级别</label>
            <input type="text" v-model.number="formData.level" class="form-control" style="width:70px;">
          </div> -->
          <button type="button" class="btn btn-info" @click="queryAlarmRecord">
            <i class="fa fa-search" aria-hidden="true"></i>查询</button>
        </form>
      </div>
    </div>
      <table class="table">
        <thead>
          <tr>
            <td>告警序列号</td>
            <td>告警设备</td>
            <!-- <td>告警收到时间</td> -->
            <td>告警发生时间</td>
            <td>告警详情</td>
            <!-- <td>告警级别</td> -->
            <!-- <td>告警原因</td> -->
            <td>告警确认</td>
            <td>告警确认时间</td>
            <td>告警确认信息</td>
            <td>告警恢复</td>
            <td>告警恢复信息</td>
            <!-- <td>告警源IP</td> -->
          </tr>
        </thead>
        <tbody>
          <tr  v-for="item in alarmparameter" :key="item.id">
            <td>{{item.id}}</td>
            <td>{{item.mudid}}</td>
            <!-- <td>{{(item.receivedtime)}}</td> -->
            <td>{{(item.firedtime)}}</td>
            <td>{{detailView(item.detail)}}</td>
            <!-- <td>{{item.level}}</td> -->
            <!-- <td>{{item.reason}}</td> -->
            <td>
              <input type="checkbox" id="inlineCheckbox" v-model="item.confirmedflag" @click="alarmConfirmed(item, !item.confirmedflag)">
              <label for="checkbox">{{confirmedView(item.confirmedflag)}}</label>
            </td>
            <td>{{item.confirmedtime}}</td>
            <td>{{item.confirmedinfo}}</td>
            <td>{{restoredView(item.restoreflag)}}</td>
            <td>{{item.restoreinfo}}</td>
            <!-- <td>{{item.sourceip}}</td> -->
          </tr>
        </tbody>
      </table>
      <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageData.pageIndex"
        :page-sizes="[6, 10, 15, 40]"
        :page-size="pageData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total">
      </el-pagination>
  </div>
      <el-dialog
        title ="告警输入信息："
        :visible.sync="dialogVisible"
        :show-close = false
        width ="25%">
      <textarea style="height:300px;color:#000;background-color:#fff;" class="form-control" v-model="alarmConfiredText"  id="textarea"  placeholder="输入告警确认信息.....">
        告警确认
      </textarea>
      <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="alarmConfirmInfo()">确 定</el-button>
      </span>
     </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'alarm',
  data () {
    return {
      header: '历史告警数据表',
      name: 'data',
      fileType: 'xls',
      workSheet: '数据表',
      json_fields: {
        告警序列号: 'id',
        告警设备: 'mudid',
        告警发生时间: 'firedtime',
        告警详情: 'detail',
        告警确认: 'confirmedflag',
        告警确认时间: 'confirmedtime',
        告警恢复: 'restoreflag',
        告警恢复信息: 'restoreinfo'
      },
      data: [],
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
        alarmType: 0,
        station: '',
        BeginTime: '',
        EndTime: ''
      },
      value: '',
      selectValue: '',
      startStamp: {},
      endStamp: {},
      alarmparameter: [
      ],
      dialogVisible: false,
      alarmConfiredText: '',
      selectedAlarmID: '',
      instance: this.$ajax.create({
        baseURL: 'http://123.57.87.144:7001/'
      })
    }
  },
  created () {
    this.$nextTick(async () => {
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
      await this.refresh()
    })
  },
  computed: {
    ...mapGetters({
      alarmReport: 'alarmReport'
    })
  },
  watch: {
    'alarmReport': {
      handler: async function (data) {
        let inputData = data
        console.log('current alarm report:=', inputData)
        // console.log('current alarm report obj：', JSON.parse(inputData))
        // this.alarmReportFormat(JSON.parse(inputData))
        // 默认第一页
        this.pageData.pageIndex = 1
        await this.refresh()
        this.$nextTick(function () {
        })
      }
    }
  },
  methods: {
    setFileName () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      let downloadtime = year + '-' + String(month > 9 ? month : ('0' + month)) + '-' + String(day > 9 ? day : ('0' + day)) + '_' + String(hour > 9 ? hour : ('0' + hour)) + ':' + String(minute > 9 ? minute : ('0' + minute)) + ':' + String(second > 9 ? second : ('0' + second))
      this.name = '历史告警_' + downloadtime
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageData.pageIndex = val
      // this.refreshTotal()
      this.refresh()
    },
    handleNodeClick (data) {
      // 配置树形组件点击节点后，设置选择器的值，配置组件的数据
      this.selectValue = data.label
      this.formData.station = data.catalogid
      // 选择器执行完成后，使其失去焦点隐藏下拉框效果
      this.$refs.selectTree.blur()
      console.log('当前选中的站点名称：', this.selectValue)
    },
    clearHandle () {
      this.selectValue = ''
      this.formData.station = ''
    },
    alarmReportFormat (report) {
      let alarmReportTem = {}
      let alarmReport = report
      alarmReportTem.id = alarmReport.alarmid
      alarmReportTem.mudid = alarmReport.alarmmudid
      alarmReportTem.receivedtime = alarmReport.alarmreceivedtime
      alarmReportTem.firedtime = alarmReport.alarmfiredtime
      alarmReportTem.detail = alarmReport.alarmdetail
      alarmReportTem.reason = alarmReport.alarmreason
      alarmReportTem.level = alarmReport.alarmlevel
      alarmReportTem.confirmedflag = (alarmReport.alarmconfirmedflag === 'true')
      alarmReportTem.confirmedtime = alarmReport.alarmconfirmedtime
      alarmReportTem.confirmedinfo = alarmReport.alarmconfirmedinfo
      alarmReportTem.restoreflag = (alarmReport.alarmrestoreflag === 'true')
      alarmReportTem.restoreinfo = alarmReport.alarmrestoreinfo
      alarmReportTem.sourceip = alarmReport.alarmsourceip
      this.alarmparameter.push(alarmReportTem)
    },
    async refresh () {
      let _this = this
      this.formData = Object.assign(this.formData, this.pageData)
      this.instance({
        'url': '/alarm/historypage/' + this.formData.alarmType,
        data: this.formData,
        'method': 'post'
      }).then((res) => {
        console.log('\npower page history alarm db:')
        console.log(res)
        let alarmList = []
        if (res.data.list) {
          _this.alarmparameter = []
          res.data.list.forEach((num) => {
            _this.alarmReportFormat(num)
            alarmList.push(num)
          })
          console.log('\npower history alarm page List table')
          console.log(alarmList)
          _this.pageData.total = res.data.total
        }
      })
    },
    async refreshTotal () {
      let _this = this
      this.instance({
        'url': '/getallhistoryalarmtotol',
        'method': 'get'
      }).then((res) => {
        console.log('\npower totol number history alarm db number :')
        console.log(res.data)
        _this.pageData.total = res.data
      })
    },
    alarmConfirmInfo () {
      console.log('输入的告警确认信息：', this.alarmConfiredText)
      this.dialogVisible = false
      let _this = this
      // 修改历史告警数据库的告警确认相关信息
      // 修改历史告警数据库的这条信息
      this.alarmparameter.forEach((num) => {
        if (num.id === this.selectedAlarmID) {
          let toHistoryAlarm = num
          let date = new Date()
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let day = date.getDate()
          let hour = date.getHours()
          let minute = date.getMinutes()
          let second = date.getSeconds()
          let confirmedtime = year + '-' + String(month > 9 ? month : ('0' + month)) + '-' + String(day > 9 ? day : ('0' + day)) + ' ' + String(hour > 9 ? hour : ('0' + hour)) + ':' + String(minute > 9 ? minute : ('0' + minute)) + ':' + String(second > 9 ? second : ('0' + second))
          console.log('告警确认要修改的一条history数据=========', toHistoryAlarm)
          toHistoryAlarm.alarmid = toHistoryAlarm.id
          toHistoryAlarm.alarmstation = toHistoryAlarm.station
          toHistoryAlarm.alarmmudid = toHistoryAlarm.mudid
          toHistoryAlarm.alarmreceivedtime = toHistoryAlarm.receivedtime
          toHistoryAlarm.alarmfiredtime = toHistoryAlarm.firedtime
          toHistoryAlarm.alarmdetail = toHistoryAlarm.detail
          toHistoryAlarm.alarmreason = toHistoryAlarm.reason
          toHistoryAlarm.alarmlevel = toHistoryAlarm.level
          toHistoryAlarm.alarmrestoreflag = toHistoryAlarm.restoreflag
          toHistoryAlarm.alarmrestoreinfo = toHistoryAlarm.restoreinfo
          toHistoryAlarm.alarmsourceip = toHistoryAlarm.sourceip
          toHistoryAlarm.alarmconfirmedflag = true
          toHistoryAlarm.alarmconfirmedtime = confirmedtime
          toHistoryAlarm.alarmconfirmedinfo = this.alarmConfiredText
          this.instance({
            'url': '/alarm/history/update',
            data: toHistoryAlarm,
            'method': 'post'
          }).then((res) => {
            console.log('\nupdate to history db is ok:')
            console.log(res.data)
            _this.refreshTotal()
            _this.refresh()
          })
          this.alarmConfiredText = ''
        }
      })
    },
    confirmedView (v) {
      let view = ''
      // console.log('mudid in ', v)
      if (v) {
        view = '已确认'
      } else {
        view = '未确认'
      }
      return view
    },
    restoredView (v) {
      let view = ''
      // console.log('mudid in ', v)
      if (v) {
        view = '已恢复'
      } else {
        view = '未恢复'
      }
      return view
    },
    mudidView (v) {
      let view = ''
      // console.log('mudid in ', v)
      if (v === 'ff') {
        view = '整机'
      } else {
        view = '模块' + v
      }
      return view
    },
    detailView (v) {
      let view = ''
      // console.log('detail in ', v)
      switch (v) {
        case 'mastersw' :
          view = '主开关故障'
          break
        case 'outov' :
          view = '输出过压'
          break
        case 'outuv' :
          view = '输出欠压'
          break
        case 'oload' :
          view = '超大负载'
          break
        case 'ot' :
          view = '过温'
          break
        case 'ow' :
          view = '过功率'
          break
        case 'inov' :
          view = '输入过压'
          break
        case 'inuv' :
          view = '输入欠压'
          break
        case 'com' :
          view = '通信故障'
          break
        case 'auv' :
          view = 'A相欠压'
          break
        case 'buv' :
          view = 'B相欠压'
          break
        case 'cuv' :
          view = 'c相欠压'
          break
        case 'aov' :
          view = 'A相过压'
          break
        case 'bov' :
          view = 'B相过压'
          break
        case 'cov' :
          view = 'C相过压'
          break
        case 'aoa' :
          view = 'A相过流'
          break
        case 'boa' :
          view = 'B相过流'
          break
        case 'coa' :
          view = 'C相过流'
          break
        case 'apl' :
          view = 'A相缺相'
          break
        case 'bpl' :
          view = 'B相缺相'
          break
        case 'cpl' :
          view = 'C相缺相'
          break
        case 'afu' :
          view = 'A相保险'
          break
        case 'bfu' :
          view = 'B相保险'
          break
        case 'cfu' :
          view = 'C相保险'
          break
        case 'phaseloss' :
          view = '相序错误'
          break
        case 'shutdown' :
          view = '断电故障'
          break
        case 'offline' :
          view = '离线故障'
      }
      return view
    },
    detailBoxView (v) {
      let view = ''
      // console.log('detail in ', v)
      switch (v) {
        case 'shutdown' :
          view = '断电故障'
          break
        case 'offline' :
          view = '离线故障'
      }
      return view
    },
    alarmConfirmed (e, visible) {
      if (visible) {
        this.dialogVisible = true
        this.selectedAlarmID = e.id
      }
    },
    queryAlarmRecord () {
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
        console.log('历史告警查询开始时间=', this.formData.BeginTime)
        console.log('历史告警查询结束时间=', this.formData.EndTime)
      } else {
        this.formData.BeginTime = ''
        this.formData.EndTime = ''
      }
      // 查询历史告警
      this.refresh()
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss" rel="stylesheet/scss" lang="scss">
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
// .tableTool {
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
// }
}
// .selected {
//     border-color: #000;
//     background: url(/static/img/jiaobiao04.fw.2d8fb46.png) no-repeat bottom right #aaaaaa;
// }
// .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
//     height: auto;
//     max-height: 274px;
//     padding: 0;
//     overflow: hidden;
//     overflow-y: auto;
//   }
//   .el-select-dropdown__item.selected{
//     font-weight: normal;
//   }
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
