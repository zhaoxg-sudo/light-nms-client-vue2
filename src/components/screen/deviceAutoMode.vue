<template>
  <div class="device-auto-mode">
    <div class="auto-top">
      <el-button size="mini" @click="addMode">新增</el-button>
      <el-button size="mini" type="primary" @click="runCurrentMode">执行当前模式</el-button>
    </div>

    <div class="sun-time-row">
      <span>日出时间：{{ sunriseTime }}</span>
      <span>日落时间：{{ sunsetTime }}</span>
    </div>

    <div class="offset-row">
      <span>日出时间偏差</span>
      <el-button size="mini" @click="sunriseOffset--">-</el-button>
      <el-input v-model.number="sunriseOffset" size="mini" style="width: 62px"></el-input>
      <el-button size="mini" @click="sunriseOffset++">+</el-button>

      <span class="ml12">日落时间偏差</span>
      <el-button size="mini" @click="sunsetOffset--">-</el-button>
      <el-input v-model.number="sunsetOffset" size="mini" style="width: 62px"></el-input>
      <el-button size="mini" @click="sunsetOffset++">+</el-button>

      <el-button size="mini" type="danger" @click="onSaveOffset">确认偏差</el-button>
    </div>

    <!-- 模式Tab：模式1/2/3 -->
    <el-tabs v-model="activeModeTab" class="mode-tabs">
      <el-tab-pane label="模式1" name="mode1">
        <el-tabs v-model="timeTypeTab1" class="type-tabs">
          <el-tab-pane label="定时时段" name="time">
            <div class="task-table-wrap">
              <div class="task-header">
                <span>起始任务</span>
                <span>通道</span>
                <span v-for="i in 10" :key="i">{{ i }}</span>
                <span>定时时间</span>
                <span>操作</span>
              </div>
              <div
                class="task-row"
                v-for="(item, index) in taskList1"
                :key="index"
              >
                <span>{{ item.taskLabel }}</span>
                <span>回路</span>
                <span v-for="ch in 10" :key="ch">{{ item.ch[ch - 1] }}</span>
                <el-time-picker
                  v-model="item.time"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  size="mini"
                  popper-append-to-body="false"
                ></el-time-picker>
                <div class="operate">
                  <el-button size="mini" type="success" @click="editTask(1, index)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="delTask(1, index)">删除</el-button>
                </div>
              </div>
            </div>
            <el-button size="mini" @click="openTaskDialog(1)">新增任务</el-button>
          </el-tab-pane>
          <el-tab-pane label="经纬时段" name="geo">
            <div class="geo-tip">经纬时段，自动根据经纬度计算日出日落</div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>

      <el-tab-pane label="模式2" name="mode2">
        <el-tabs v-model="timeTypeTab2" class="type-tabs">
          <el-tab-pane label="定时时段" name="time">
            <div class="task-table-wrap">
              <div class="task-header">
                <span>起始任务</span>
                <span>通道</span>
                <span v-for="i in 10" :key="i">{{ i }}</span>
                <span>定时时间</span>
                <span>操作</span>
              </div>
              <div
                class="task-row"
                v-for="(item, index) in taskList2"
                :key="index"
              >
                <span>{{ item.taskLabel }}</span>
                <span>回路</span>
                <span v-for="ch in 10" :key="ch">{{ item.ch[ch - 1] }}</span>
                <el-time-picker
                  v-model="item.time"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  size="mini"
                  popper-append-to-body="false"
                ></el-time-picker>
                <div class="operate">
                  <el-button size="mini" type="success" @click="editTask(2, index)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="delTask(2, index)">删除</el-button>
                </div>
              </div>
            </div>
            <el-button size="mini" @click="openTaskDialog(2)">新增任务</el-button>
          </el-tab-pane>
          <el-tab-pane label="经纬时段" name="geo">
            <div class="geo-tip">经纬时段，自动根据经纬度计算日出日落</div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>

      <el-tab-pane label="模式3" name="mode3">
        <el-tabs v-model="timeTypeTab3" class="type-tabs">
          <el-tab-pane label="定时时段" name="time">
            <div class="task-table-wrap">
              <div class="task-header">
                <span>起始任务</span>
                <span>通道</span>
                <span v-for="i in 10" :key="i">{{ i }}</span>
                <span>定时时间</span>
                <span>操作</span>
              </div>
              <div
                class="task-row"
                v-for="(item, index) in taskList3"
                :key="index"
              >
                <span>{{ item.taskLabel }}</span>
                <span>回路</span>
                <span v-for="ch in 10" :key="ch">{{ item.ch[ch - 1] }}</span>
                <el-time-picker
                  v-model="item.time"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  size="mini"
                  popper-append-to-body="false"
                ></el-time-picker>
                <div class="operate">
                  <el-button size="mini" type="success" @click="editTask(3, index)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="delTask(3, index)">删除</el-button>
                </div>
              </div>
            </div>
            <el-button size="mini" @click="openTaskDialog(3)">新增任务</el-button>
          </el-tab-pane>
          <el-tab-pane label="经纬时段" name="geo">
            <div class="geo-tip">经纬时段，自动根据经纬度计算日出日落</div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加/编辑任务弹窗 ✅【改动：标题插槽居中对齐、修正层级参数】 -->
    <el-dialog
      title="添加任务"
      :visible.sync="taskDialogVisible"
      width="520px"
      top="15vh"
      :close-on-click-modal="false"
      append-to-body
      @close="handleCloseDialog"
      custom-class="dark-auto-dialog"
    >
      <!-- ✅ 新增标题插槽，和设备面板、操作日志样式统一 -->
      <template slot="title">
        <div style="width:100%;text-align:center;">
          <span style="font-size:22px;font-weight:bold;color:#40c9ff;letter-spacing:2px;">添加任务</span>
        </div>
      </template>

      <div class="dialog-top-row">
        <span>定时方式</span>
        <el-radio-group v-model="formTaskType" size="mini">
          <el-radio label="start">起始任务</el-radio>
          <el-radio label="end">结束任务</el-radio>
        </el-radio-group>
        <div class="quick-btn-group">
          <el-button size="mini" type="success" @click="quickDim">一键调光</el-button>
          <el-button size="mini" type="success" @click="quickAllOpen">全开</el-button>
          <el-button size="mini" type="success" @click="quickAllPass">全接通</el-button>
        </div>
      </div>

      <div class="channel-grid">
        <div class="grid-row">
          <span>通道</span>
          <span v-for="i in 10" :key="i">{{ i }}</span>
        </div>
        <div class="grid-row">
          <span>回路</span>
          <span v-for="i in 10" :key="i">
            <el-select v-model="tempCh[i - 1]" size="mini">
              <el-option label="关" value="关"></el-option>
              <el-option label="开" value="开"></el-option>
            </el-select>
          </span>
        </div>
        <div class="grid-row">
          <span>亮度</span>
          <span v-for="i in 10" :key="i">
            <el-input v-model.number="tempBright[i - 1]" size="mini"></el-input>
          </span>
        </div>
        <div class="grid-row">
          <span>定时时间</span>
          <el-time-picker
            v-model="tempTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            size="mini"
            popper-append-to-body="false"
          ></el-time-picker>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="saveTask">保存退出</el-button>
        <el-button size="mini" @click="taskDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DeviceAutoMode',
  props: {
    sn: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      sunriseTime: '13:47:00',
      sunsetTime: '01:54:00',
      sunriseOffset: 0,
      sunsetOffset: 0,
      activeModeTab: 'mode1',

      timeTypeTab1: 'time',
      taskList1: [],
      timeTypeTab2: 'time',
      taskList2: [],
      timeTypeTab3: 'time',
      taskList3: [],

      taskDialogVisible: false,
      editIndex: -1,
      currentModeNum: 1,
      formTaskType: 'start',
      tempCh: ['关', '关', '关', '关', '关', '关', '关', '关', '关', '关'],
      tempBright: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      tempTime: '00:00:00'
    }
  },
  methods: {
    runCurrentMode () {
      this.$emit('run-mode', this.activeModeTab, this.sn)
    },
    addMode () {
      this.$emit('add-mode')
    },
    onSaveOffset () {
      this.$emit('save-offset', {
        sunriseOffset: this.sunriseOffset,
        sunsetOffset: this.sunsetOffset
      }, this.sn)
    },
    openTaskDialog (modeNum) {
      this.editIndex = -1
      this.currentModeNum = modeNum
      this.formTaskType = 'start'
      this.tempCh = ['关', '关', '关', '关', '关', '关', '关', '关', '关', '关']
      this.tempBright = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      this.tempTime = '00:00:00'
      this.taskDialogVisible = true
    },
    editTask (modeNum, index) {
      this.editIndex = index
      this.currentModeNum = modeNum
      let list = this.getTaskListByMode(modeNum)
      const item = list[index]
      this.formTaskType = item.taskType
      this.tempCh = [...item.ch]
      this.tempBright = [...item.bright]
      this.tempTime = item.time
      this.taskDialogVisible = true
    },
    getTaskListByMode (modeNum) {
      if (modeNum === 1) return this.taskList1
      if (modeNum === 2) return this.taskList2
      if (modeNum === 3) return this.taskList3
      return []
    },
    setTaskListByMode (modeNum, val) {
      if (modeNum === 1) this.taskList1 = val
      if (modeNum === 2) this.taskList2 = val
      if (modeNum === 3) this.taskList3 = val
    },
    saveTask () {
      const taskObj = {
        taskType: this.formTaskType,
        taskLabel: this.formTaskType === 'start' ? '起始任务' : '结束任务',
        ch: [...this.tempCh],
        bright: [...this.tempBright],
        time: this.tempTime
      }
      const list = this.getTaskListByMode(this.currentModeNum)
      if (this.editIndex >= 0) {
        list.splice(this.editIndex, 1, taskObj)
      } else {
        list.push(taskObj)
      }
      this.setTaskListByMode(this.currentModeNum, list)
      this.taskDialogVisible = false
    },
    delTask (modeNum, index) {
      const list = this.getTaskListByMode(modeNum)
      list.splice(index, 1)
      this.setTaskListByMode(modeNum, list)
    },
    quickDim () {
      this.tempCh = ['开', '开', '开', '开', '开', '开', '开', '开', '开', '开']
      this.tempBright = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
    },
    quickAllOpen () {
      this.tempCh = ['开', '开', '开', '开', '开', '开', '开', '开', '开', '开']
    },
    quickAllPass () {
      this.tempBright = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    // ✅ 新增弹窗关闭回调
    handleCloseDialog () {
      this.editIndex = -1
    }
  }
}
</script>

<style scoped>
.device-auto-mode {
  color: #fff;
  font-size: 13px;
}
.auto-top {
  margin-bottom: 8px;
}
.sun-time-row {
  margin: 6px 0;
  color: #40c9ff;
}
.offset-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0 12px;
}
.ml12 {
  margin-left: 12px;
}
.task-table-wrap {
  margin: 8px 0;
  overflow-x: auto;
}
.task-header, .task-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
  white-space: nowrap;
}
.task-header > span:nth-child(1),
.task-row > span:nth-child(1) {
  min-width: 70px;
}
.task-header > span:nth-child(2),
.task-row > span:nth-child(2) {
  min-width: 45px;
}
.task-header > span:nth-child(n+3):nth-child(-n+12),
.task-row > span:nth-child(n+3):nth-child(-n+12) {
  min-width: 32px;
  text-align: center;
}
.task-header > span:nth-child(13),
.task-row > .el-time-picker {
  min-width: 100px;
}
.task-header > span:nth-child(14),
.task-row > .operate {
  min-width: 110px;
}

.grid-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 6px 0;
}
.grid-row > span:first-child {
  min-width: 44px;
  text-align: right;
  padding-right: 4px;
}
.grid-row > span:nth-child(n+2) {
  min-width: 40px;
  flex: 1;
  display: flex;
  justify-content: center;
}
.grid-row .el-select {
  width: 100%;
}
.grid-row .el-input {
  width: 100%;
}

.geo-tip {
  padding: 10px;
  color: #999;
}
.dialog-top-row {
  display:flex;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
}
.quick-btn-group {
  display:flex;
  gap:6px;
}

/* 时间输入框保持暗黑 */
::v-deep .el-time-picker .el-input-mini .el-input__inner {
  width: 100% !important;
  padding: 0 10px !important;
  font-size: 18px !important;
  line-height: 28px !important;
  height: 28px !important;
  color: #d6e4ff !important;
  letter-spacing: 3px !important;
  background: #1a2944 !important;
  border-color: #2c4268 !important;
}
</style>

<style>
.device-auto-mode .el-tabs__header {
  margin: 0 0 8px 0;
}
.device-auto-mode .el-tabs__item {
  color: #b0c4de;
}
.device-auto-mode .el-tabs__item.is-active {
  color: #40c9ff;
}
.device-auto-mode .el-tabs__active-bar {
  background-color: #40c9ff;
}

/* select下拉 暗色 */
.device-auto-mode .el-select-dropdown {
  background-color: #141e33 !important;
  border: 1px solid #2a4068 !important;
  font-size: 13px !important;
}
.device-auto-mode .el-select-dropdown__item {
  color: #d6e4ff !important;
  background: transparent !important;
  font-size: 13px !important;
  padding: 0 12px !important;
  height: 30px !important;
  line-height: 30px !important;
}
.device-auto-mode .el-select-dropdown__item:hover {
  background-color: #23385c !important;
  color: #40c9ff !important;
}
.device-auto-mode .el-select-dropdown__item.selected {
  color: #40c9ff !important;
  background-color: #23385c !important;
}

/* ========== 时间弹窗 深色 ========== */
.el-time-panel {
  background-color: #141e33 !important;
  border: 1px solid #2a4068 !important;
}
.el-time-panel__footer {
  background-color: #141e33 !important;
  border-top: 1px solid #2a4068 !important;
}
.el-time-panel__btn.cancel {
  color: #b0c4de !important;
}
.el-time-panel__btn.confirm {
  color: #40c9ff !important;
}
.el-time-spinner {
  background-color: #141e33 !important;
}
.el-time-spinner__wrapper {
  background-color: #141e33 !important;
}
.el-time-spinner__list {
  background-color: #141e33 !important;
}
.el-time-spinner__item {
  font-size: 13px !important;
  height: 32px !important;
  line-height: 32px !important;
  color: #d6e4ff !important;
  background: transparent !important;
}
.el-time-spinner__item.active:not(.disabled) {
  font-size: 18px !important;
  height: 38px !important;
  line-height: 38px !important;
  color: #fff !important;
  background-color: #23385c !important;
  font-weight: bold;
}
.el-time-spinner__item:hover:not(.disabled) {
  background: #23385c !important;
}
.el-time-spinner__item.disabled {
  color: #5a6a85 !important;
}

/* ========== 弹窗暗黑样式 + 层级修复【重点改动】 ========== */
.dark-auto-dialog .el-dialog__wrapper {
  z-index: 999999 !important;
}
.dark-auto-dialog .v-modal {
  z-index: 999998 !important;
}
.dark-auto-dialog .el-dialog__header,
.dark-auto-dialog .el-dialog__body,
.dark-auto-dialog .el-dialog__footer {
  background-color: #152836 !important;
  color: #ffffff !important;
}
.dark-auto-dialog .el-input__inner {
  background: #0f1f2b !important;
  border-color: #2b5068 !important;
  color: #fff !important;
}
.dark-auto-dialog .el-radio__label {
  color: #fff !important;
}
.dark-auto-dialog .el-button {
  background-color: #1f4b66 !important;
  border-color: #38789c !important;
  color: #fff !important;
}
.dark-auto-dialog .el-button:hover {
  background-color: #2b6488 !important;
  border-color: #4096c4 !important;
  color: #fff !important;
}

/* 组件内按钮 */
.device-auto-mode .el-button {
  background-color: #1a2b48 !important;
  color: #ffffff !important;
  border-color: #334b75 !important;
}
.device-auto-mode .el-button:hover {
  background-color: #182b4a !important;
  color: #40c9ff !important;
  border-color: #40c9ff !important;
}
.device-auto-mode .el-button--primary {
  background-color: #00c48c !important;
  color: #000 !important;
  border-color: #00c48c !important;
}
.device-auto-mode .el-button--success {
  background-color: #00c48c !important;
  color: #000 !important;
  border-color: #00c48c !important;
}
.device-auto-mode .el-button--danger {
  background-color: #c43838 !important;
  color: #fff !important;
  border-color: #c43838 !important;
}
/* 遮罩 */
.dark-auto-dialog .el-dialog__wrapper {
  z-index: 20000 !important;
}
/* 弹窗主体 */
.dark-auto-dialog {
  z-index: 20001 !important;
}
</style>
