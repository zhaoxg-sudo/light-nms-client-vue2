<template>
  <div>
       <div class="tableTool">
       <audio ref = "alarm"  src = "alarm.mp3" ></audio>
      <!-- <button type="button" @click="prePlay" class="btn btn-sm btn-info" id="play"><i :class="recordPlay(recordState)" aria-hidden="true"></i>{{recordState}}</button> -->
      <!-- <a download @click="downLoad()" class="btn btn-sm btn-info"><i class="fa fa-cloud-download" aria-hidden="true"></i>导出</a> -->
      <div class="operate">
        <form class="form-inline">
          <button type="button" class="btn btn-info" @click="refresh">
            <i class="fa fa-search" aria-hidden="true"></i>刷新</button>
        </form>
      </div>
    </div>
      <table class="table">
        <thead>
          <tr>
            <td>告警序列号</td>
            <td>告警设备</td>
            <!-- <td>告警收到时间</td> -->
            <td>告警时间</td>
            <td>告警详情</td>
            <!-- <td>告警级别</td> -->
            <!-- <td>告警原因</td> -->
            <td>告警确认</td>
            <td>告警确认时间</td>
            <td>告警确认信息</td>
            <td>告警恢复</td>
            <td>告警恢复时间</td>
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
        :current-page="pageData.pageIndex"
        :page-sizes="[6, 10, 30, 40]"
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
      msg: '还没收到websockt数据',
      alarmparameter: [
        // {station: '崇礼隧道交流局端电源整机', mudid: 'ff', receivedtime: '20220720 00:00:33', firedtime: '20220720 00:00:00', detail: '风扇故障', level: '55', reason: '可能', confirmedflag: true, confirmedtime: '20220720 00:00:00', confirmedinfo: '线路短路原因', restoreflag: true, restoreinfo: '20220720 00:00:00', sourceip: '192.168.1.11'},
        // {station: '崇礼隧道交流局端电源子模块', mudid: '00', receivedtime: '20220720 00:00:33', firedtime: '20220720 00:00:00', detail: '风扇故障', level: '55', reason: '可能', confirmedflag: false, confirmedtime: '20220720 00:00:00', confirmedinfo: '线路短路原因', restoreflag: true, restoreinfo: '20220720 00:00:00', sourceip: '192.168.1.11'}
      ],
      pageData: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      formData: {
        alarmType: 0,
        station: '11111',
        firedTime: '',
        BeginTime: '',
        EndTime: ''
      },
      dialogVisible: false,
      alarmConfiredText: '',
      selectedAlarmID: '',
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  created () {
    this.$nextTick(async () => {
      await this.refreshTotal()
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
        this.refreshTotal()
        this.refresh()
        this.$nextTick(function () {
        })
      }
    }
  },
  methods: {
    alarmReportFormat (report) {
      let alarmReportTem = {}
      let alarmReport = report
      alarmReportTem.id = alarmReport.alarmid
      alarmReportTem.mudid = alarmReport.alarmstation
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
      alarmReportTem.sourceip = alarmReport.sourceip
      this.alarmparameter.push(alarmReportTem)
    },
    async refresh () {
      let _this = this
      this.formData = Object.assign(this.formData, this.pageData)
      this.instance({
        'url': '/alarm/currentpage/' + this.formData.station + '/' + this.formData.alarmType,
        data: this.formData,
        'method': 'post'
      }).then((res) => {
        console.log('\npower page current alarm db:')
        console.log(res.data)
        let alarmList = []
        if (res.data) {
          _this.alarmparameter = []
          res.data.forEach((num) => {
            _this.alarmReportFormat(num)
            alarmList.push(num)
            // console.log(num.dianum)
            // console.log(this.video_link_list)
          })
          console.log('\npower current alarm page List table')
          console.log(alarmList)
          // _this.pageData.total = alarmList.length
        }
      })
    },
    async refreshTotal () {
      let _this = this
      this.instance({
        'url': '/getallcurrentalarmtotol',
        'method': 'get'
      }).then((res) => {
        console.log('\npower all current alarm db :')
        console.log(res.data)
        _this.pageData.total = res.data
      })
    },
    getAllCurrentAlarm () {
      let _this = this
      this.instance({
        'url': '/getallcurrentalarm',
        'method': 'get'
      }).then((res) => {
        console.log('\npower totol number current alarm db:')
        console.log(res.data)
        _this.pageData.total = res.data
      })
    },
    download () {

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
          view = 'C相欠压'
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
    alarmConfirmInfo () {
      console.log('输入的告警确认信息：', this.alarmConfiredText)
      this.dialogVisible = false
      let _this = this
      // 修改当前告警数据库的告警确认相关信息
      // 修改但前告警数据库的这条信息
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
          console.log('告警确任要修改的一条current数据=========', toHistoryAlarm)
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
            'url': '/alarm/current/update',
            data: toHistoryAlarm,
            'method': 'post'
          }).then((res) => {
            console.log('\nupdate to current db is ok:')
            console.log(res.data)
            _this.refreshTotal()
            _this.refresh()
          })
          this.alarmConfiredText = ''
        }
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageData.pageIndex = val
      this.refreshTotal()
      this.refresh()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.block {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>
