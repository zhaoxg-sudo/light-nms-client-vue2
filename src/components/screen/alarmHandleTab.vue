<template>
  <div class="alarm-handle-wrap">
    <el-tabs v-model="alarmTab">
      <el-tab-pane label="当前告警" name="current">
        <div class="table-tool">
          <el-button size="mini" @click="loadCurrentAlarm">刷新</el-button>
        </div>

        <div class="table-wrap-dark">
          <el-table
            :data="currentAlarmList"
            stripe
            border
            height="260"
            style="width:100%"
          >
            <el-table-column label="告警ID" prop="id" width="220" />
            <el-table-column label="站点ID" prop="mudid" width="180" />
            <el-table-column label="站点名称" prop="stationName" width="180" />
            <el-table-column label="告警发生时间" prop="firedtime" width="180" />
            <el-table-column label="告警类型" prop="detailViewText" />
            <el-table-column label="告警原因" prop="reason" />
            <el-table-column label="告警等级" prop="level" width="100" />
            <el-table-column label="是否确认" prop="confirmedflag" width="100">
              <template slot-scope="scope">
                <span :style="{color: scope.row.confirmedflag ? '#00ff66' : '#ffcc00'}">
                  {{ scope.row.confirmedflag ? '已确认' : '未确认' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="确认时间" prop="confirmedtime" width="180" />
            <el-table-column label="确认备注" prop="confirmedinfo" />
            <el-table-column label="是否恢复" prop="restoreflag" width="100">
              <template slot-scope="scope">
                <span :style="{color: scope.row.restoreflag ? '#00ff66' : '#ff2a2a'}">
                  {{ scope.row.restoreflag ? '已恢复' : '未恢复' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="恢复备注" prop="restoreinfo" />
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="scope.row.confirmedflag"
                  @click="openConfirmDialog(scope.row)"
                >
                  确认告警
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="currentAlarmList.length === 0" class="empty-tip">暂无当前告警</div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="历史告警" name="history">
        <div class="table-tool">
          <downloadExcel
            :data="historyAlarmList"
            :fields="excelFields"
            :header="excelHeader"
            :worksheet="worksheetName"
            :before-generate="setExcelFileName"
            :name="excelFileName"
          >
            <el-button size="mini" type="success">导出Excel</el-button>
          </downloadExcel>
          <el-select v-model="filterStationId" clearable placeholder="选择站点" @change="onStationChange">
            <el-option :key="item.catalogid" :label="item.label" :value="item.catalogid" v-for="item in stationTreeList" />
          </el-select>
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="onTimeChange"
          />
          <el-button size="mini" type="primary" @click="loadHistoryAlarm">查询</el-button>
        </div>

        <div class="table-wrap-dark">
          <el-table
            :data="historyAlarmList"
            stripe
            border
            height="260"
            style="width:100%"
          >
            <el-table-column label="告警ID" prop="id" width="220" />
            <el-table-column label="站点ID" prop="mudid" width="180" />
            <el-table-column label="站点名称" prop="stationName" width="180" />
            <el-table-column label="告警发生时间" prop="firedtime" width="180" />
            <el-table-column label="告警类型" prop="detailViewText" />
            <el-table-column label="告警原因" prop="reason" />
            <el-table-column label="告警等级" prop="level" width="100" />
            <el-table-column label="是否确认" prop="confirmedflag" width="100">
              <template slot-scope="scope">
                <span :style="{color: scope.row.confirmedflag ? '#00ff66' : '#ffcc00'}">
                  {{ scope.row.confirmedflag ? '已确认' : '未确认' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="确认时间" prop="confirmedtime" width="180" />
            <el-table-column label="确认备注" prop="confirmedinfo" />
            <el-table-column label="是否恢复" prop="restoreflag" width="100">
              <template slot-scope="scope">
                <span :style="{color: scope.row.restoreflag ? '#00ff66' : '#ff2a2a'}">
                  {{ scope.row.restoreflag ? '已恢复' : '未恢复' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="恢复时间" prop="restoretime" width="180" />
            <el-table-column label="恢复备注" prop="restoreinfo" />
          </el-table>

          <div class="pagination-wrap">
            <el-pagination
              @current-change="pageChange"
              :current-page.sync="page.pageIndex"
              :page-size="page.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="page.total"
            />
          </div>

          <div v-if="historyAlarmList.length === 0" class="empty-tip">暂无历史告警</div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="告警确认"
      :visible.sync="confirmDialogVisible"
      width="400px"
      custom-class="alarm-confirm-dialog"
    >
      <el-form label-width="80px">
        <el-form-item label="告警ID">
          <span>{{ curAlarm.id }}</span>
        </el-form-item>
        <el-form-item label="确认备注">
          <el-input v-model="confirmText" type="textarea" rows="4" placeholder="填写告警确认信息" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAlarmConfirm">确认提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { GET_USER_INFO } from '@/store/getters/type'
export default {
  name: 'AlarmHandleTab',
  props: {
    // 外部传入站点ID，如 '002026063002'，不传则查全部站点
    bindStationId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      alarmTab: 'current',
      filterStationId: '',
      timeRange: [],
      currentAlarmList: [],
      historyAlarmList: [],
      stationTreeList: [],
      confirmDialogVisible: false,
      curAlarm: {},
      confirmText: '',
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      excelFields: {
        '告警ID': 'id',
        '站点ID': 'mudid',
        '站点名称': 'stationName',
        '告警发生时间': 'firedtime',
        '告警类型': 'detailViewText',
        '告警原因': 'reason',
        '告警等级': 'level',
        '是否确认': 'confirmedflag',
        '确认时间': 'confirmedtime',
        '确认备注': 'confirmedinfo',
        '是否恢复': 'restoreflag',
        '恢复时间': 'restoretime',
        '恢复备注': 'restoreinfo'
      },
      excelHeader: '告警数据表',
      worksheetName: '告警记录',
      excelFileName: '告警记录',
      instance: this.$ajax.create({
        baseURL: this.$appHost
      })
    }
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO
    })
  },
  watch: {
    bindStationId: {
      immediate: true,
      handler (val) {
        this.filterStationId = val
        // this.loadCurrentAlarm()
        // this.resetHistoryPage()
        // this.loadHistoryAlarm()
      }
    }
  },
  mounted () {
    this.loadStationList()
    this.loadCurrentAlarm()
    this.resetHistoryPage()
    this.loadHistoryAlarm()
  },
  methods: {
    // 告警类型文字映射
    getDetailText (v) {
      const map = {
        'POWER_OFF': 'DTU断电',
        'mastersw': '主开关故障',
        'outov': '输出过压',
        'outuv': '输出欠压',
        'oload': '超大负载',
        'ot': '过温',
        'ow': '过功率',
        'inov': '输入过压',
        'inuv': '输入欠压',
        'com': '通信故障',
        'auv': 'A相欠压',
        'buv': 'B相欠压',
        'cuv': 'c相欠压',
        'aov': 'A相过压',
        'bov': 'B相过压',
        'cov': 'C相过压',
        'aoa': 'A相过流',
        'boa': 'B相过流',
        'coa': 'C相过流',
        'apl': 'A相缺相',
        'bpl': 'B相缺相',
        'cpl': 'C相缺相',
        'afu': 'A相保险',
        'bfu': 'B相保险',
        'cfu': 'C相保险',
        'phaseloss': '相序错误',
        'shutdown': '断电故障',
        'offline': '离线故障'
      }
      return map[v] || v
    },
    formatAlarmItem (row) {
      return {
        id: row.alarmid,
        mudid: row.alarmmudid, // 修复：alarmmudid 才是站点ID
        stationName: row.alarmstation,
        firedtime: row.alarmfiredtime,
        detail: row.alarmdetail,
        detailViewText: this.getDetailText(row.alarmdetail),
        reason: row.alarmreason,
        level: row.alarmlevel,
        confirmedflag: row.alarmconfirmedflag === true || row.alarmconfirmedflag === 'true',
        confirmedtime: row.alarmconfirmedtime,
        confirmedinfo: row.alarmconfirmedinfo,
        restoreflag: row.alarmrestoreflag === true || row.alarmrestoreflag === 'true',
        restoretime: row.alarmrestoretime || '-', // 恢复时间
        restoreinfo: row.alarmrestoreinfo,
        alarmdtusn: row.alarmdtusn,
        alarmdevtype: row.alarmdevtype,
        tenantname: row.tenantname,
        raw: row
      }
    },
    // 获取站点下拉列表
    async loadStationList () {
      try {
        const res = await this.instance({ url: '/localall', method: 'get' })
        if (res.data) {
          this.stationTreeList = res.data.map(item => ({
            catalogid: item.catalogid,
            label: item.label || item.catalogid
          }))
        }
      } catch (err) {
        this.$message.error('站点列表加载失败')
        console.error('loadStationList err', err)
      }
    },
    // 当前告警
    async loadCurrentAlarm () {
      try {
        const params = {
          pageIndex: 1,
          pageSize: 10,
          station: this.filterStationId
        }
        const res = await this.instance({
          url: '/alarm/currentAlarmPageByID',
          method: 'post',
          data: params
        })
        this.currentAlarmList = []
        if (res.data && res.data.success) {
          this.currentAlarmList = res.data.data.map(item => this.formatAlarmItem(item))
        }
      } catch (err) {
        this.$message.error('当前告警加载失败')
        console.error('loadCurrentAlarm err', err)
      }
    },
    // 历史告警
    async loadHistoryAlarm () {
      try {
        let begin = ''
        let end = ''
        if (this.timeRange && this.timeRange.length === 2) {
          begin = this.timeRange[0]
          end = this.timeRange[1]
        }
        const params = {
          station: this.filterStationId,
          BeginTime: begin,
          EndTime: end,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        }
        const res = await this.instance({
          url: '/alarm/historyAlarmPageByID',
          method: 'post',
          data: params
        })
        this.historyAlarmList = []
        if (res.data && res.data.success) {
          this.historyAlarmList = res.data.data.map(item => this.formatAlarmItem(item))
          this.page.total = res.data.total || 0
        }
      } catch (err) {
        this.$message.error('历史告警加载失败')
        console.error('loadHistoryAlarm err', err)
      }
    },
    pageChange (index) {
      this.page.pageIndex = index
      this.loadHistoryAlarm()
    },
    // 站点筛选变更，重置页码
    onStationChange () {
      this.resetHistoryPage()
      this.loadHistoryAlarm()
    },
    // 时间筛选变更，重置页码
    onTimeChange () {
      this.resetHistoryPage()
      this.loadHistoryAlarm()
    },
    resetHistoryPage () {
      this.page.pageIndex = 1
    },
    openConfirmDialog (row) {
      this.curAlarm = row
      this.confirmText = ''
      this.confirmDialogVisible = true
    },
    async submitAlarmConfirm () {
      try {
        const confirmTime = this.getNowTime()
        // 只传后端需要字段，不要全量raw对象
        const payload = {
          alarmid: this.curAlarm.id,
          alarmconfirmedflag: true,
          alarmconfirmedtime: confirmTime,
          alarmconfirmedinfo: `${this.confirmText}。确认用户：${this.get_user_info.user.username}`
        }
        await this.instance({
          url: '/alarm/current/update',
          method: 'post',
          data: payload
        })
        this.confirmDialogVisible = false
        this.$message.success('告警确认成功')
        this.loadCurrentAlarm()
      } catch (err) {
        this.$message.error('告警确认提交失败')
        console.error('submitAlarmConfirm err', err)
      }
    },
    setExcelFileName () {
      const t = new Date()
      this.excelFileName = '告警记录_' + t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0')
    },
    getNowTime () {
      const d = new Date()
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const h = String(d.getHours()).padStart(2, '0')
      const mi = String(d.getMinutes()).padStart(2, '0')
      const s = String(d.getSeconds()).padStart(2, '0')
      return `${y}-${m}-${day} ${h}:${mi}:${s}`
    }
  }
}
</script>
<style scoped>
.alarm-handle-wrap {
  color: #fff;
  background: #0f1b33;
  padding: 12px;
  border: 1px solid #223b66;
  border-radius: 4px;
}

.table-tool {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.empty-tip {
  text-align: center;
  padding: 16px;
  color: #b0c4de;
  background: #0f1b33;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>

<style>
.alarm-handle-wrap .table-tool {
  background: #0f1b33 !important;
}
/* 默认白色按钮 重点！ */
.alarm-handle-wrap .table-tool .el-button.el-button--default {
  background-color: #1a2b48 !important;
  color: #ffffff !important;
  border-color: #334b75 !important;
}
.alarm-handle-wrap .table-tool .el-button.el-button--default:hover {
  background-color: #182b4a !important;
  color: #40c9ff !important;
  border-color: #40c9ff !important;
}
/* primary绿色按钮 */
.alarm-handle-wrap .table-tool .el-button.el-button--primary {
  background-color: #00c48c !important;
  color: #000 !important;
  border-color: #00c48c !important;
}
.alarm-handle-wrap .table-tool .el-button.el-button--primary:hover {
  background-color: #00b37f !important;
  border-color: #00b37f !important;
}
/* 只在.alarm-handle-wrap内部生效，不会污染全局大屏 */
.alarm-handle-wrap .el-tabs,
.alarm-handle-wrap .el-tabs__content,
.alarm-handle-wrap .el-tab-pane,
.alarm-handle-wrap .table-wrap-dark,
.alarm-handle-wrap .el-table,
.alarm-handle-wrap .el-table__header-wrapper,
.alarm-handle-wrap .el-table__body-wrapper,
.alarm-handle-wrap .el-table__empty-block,
.alarm-handle-wrap .el-table__row,
.alarm-handle-wrap .el-table__row > td,
.alarm-handle-wrap .el-table__body tr,
.alarm-handle-wrap .el-table__body td,
.alarm-handle-wrap .el-tab-pane[name="history"] .el-table,
.alarm-handle-wrap .el-tab-pane[name="history"] .el-table__body-wrapper,
.alarm-handle-wrap .el-tab-pane[name="history"] .el-table__empty-block,
.alarm-handle-wrap .el-tab-pane[name="history"] .el-pagination {
  background-color: #0f1b33 !important;
}
.alarm-handle-wrap .el-tabs__item {
  color: #b0c4de;
}
.alarm-handle-wrap .el-tabs__item.is-active {
  color: #40c9ff;
}
.alarm-handle-wrap .el-tabs__active-bar {
  background-color: #40c9ff;
}

.alarm-handle-wrap .el-table th {
  background: #182b4a !important;
  color: #40c9ff !important;
  border-color: #223b66;
}
.alarm-handle-wrap .el-table .cell {
  color: #fff !important;
}
.alarm-handle-wrap .el-table__row {
  background: #0f1b33 !important;
}
.alarm-handle-wrap .el-table--striped .el-table__row--striped {
  background-color: #142440 !important;
}
.alarm-handle-wrap .el-table__row:hover {
  background: #182b4a !important;
}
.alarm-handle-wrap .el-table__empty-text {
  color: #b0c4de !important;
}

/* 分页 */
.alarm-handle-wrap .el-pagination {
  color: #fff;
}
.alarm-handle-wrap .el-pagination__total,
.alarm-handle-wrap .el-pagination__jump {
  color: #b0c4de !important;
}
.alarm-handle-wrap .el-pagination button {
  background-color: #1a2b48;
  color: #fff;
  border-color: #334b75;
}
.alarm-handle-wrap .el-pagination button:hover {
  border-color: #40c9ff !important;
  color: #40c9ff !important;
}
.alarm-handle-wrap .el-pagination .el-pager li {
  background-color: #1a2b48;
  color: #fff;
  border: 1px solid #334b75;
}
.alarm-handle-wrap .el-pagination .el-pager li.is-active {
  background-color: #40c9ff;
  color: #000;
  border-color: #40c9ff;
}
.alarm-handle-wrap .el-pagination .el-pager li:not(.is-active):hover {
  border-color: #40c9ff !important;
  color: #40c9ff !important;
}

/* 下拉、时间选择器 */
.alarm-handle-wrap .el-select .el-input__inner,
.alarm-handle-wrap .el-date-editor.el-input__inner {
  background: #1a2b48;
  color: #fff;
  border-color: #334b75;
}
.alarm-handle-wrap .el-select .el-input__inner:focus,
.alarm-handle-wrap .el-date-editor.el-input__inner:focus {
  border-color: #40c9ff !important;
}
.alarm-handle-wrap .el-select-dropdown,
.alarm-handle-wrap .el-picker-panel {
  background: #0f1b33;
  color: #fff;
  border-color: #223b66;
}
.alarm-handle-wrap .el-select-dropdown__item {
  color: #fff;
}
.alarm-handle-wrap .el-select-dropdown__item:hover {
  background: #182b4a;
}
.alarm-handle-wrap .el-select-dropdown__item.selected {
  color: #40c9ff;
  font-weight: bold;
}

/* 告警确认弹窗 */
.alarm-handle-wrap .alarm-confirm-dialog .el-dialog__header,
.alarm-handle-wrap .alarm-confirm-dialog .el-dialog__body {
  background: #0f1b33;
  color: #fff;
}
.alarm-handle-wrap .alarm-confirm-dialog .el-dialog__header {
  border-bottom: 1px solid #223b66;
}
.alarm-handle-wrap .alarm-confirm-dialog .el-dialog__title {
  color: #40c9ff;
}
.alarm-handle-wrap .alarm-confirm-dialog .el-input__inner,
.alarm-handle-wrap .alarm-confirm-dialog .el-textarea__inner {
  background: #1a2b48;
  color: #fff;
  border-color: #334b75;
}
</style>
