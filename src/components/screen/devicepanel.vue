<template>
  <el-dialog
    title="设备控制面板"
    :visible.sync="visible"
    width="1200px"
    @close="handleClose"
    custom-class="dark-panel-dialog"
    append-to-body
    :modal-append-to-body="false"
    :close-on-click-modal="false"
  >
    <!-- 自定义标题插槽 -->
    <template slot="title">
      <div style="width: 100%; text-align: center;">
        <span style="font-size: 22px; font-weight: bold; color: #00ffff; letter-spacing: 2px;">设备控制面板</span>
      </div>
    </template>

    <div class="device-panel-dark">
      <!-- 顶部设备信息栏 -->
      <div class="top-bar">
        <div class="info-item">
          <span class="info-label">名称：</span>
          <span class="info-value">{{ devInfo.name || '--' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">类型：</span>
          <span class="info-value">{{ devInfo.devType || '--' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">ID：</span>
          <span class="info-value">{{ devInfo.id || '--' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">DTU：</span>
          <span class="info-value">{{ devInfo.sn || '--' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">状态：</span>
          <span class="status-dot" :class="devStatusToPanel"></span>
          <span class="info-value">{{ getStatusText(devStatusToPanel) }}</span>
        </div>
      </div>

      <!-- 快捷操作按钮区 -->
      <div class="action-bar">
        <el-button size="mini" type="success" @click="cmdAllOn">全通</el-button>
        <el-button size="mini" type="danger" @click="cmdAllOff">全断</el-button>
        <span class="status-tip">状态已更新</span>
        <el-button size="mini" class="btn-refresh" @click="cmdRefresh">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
        <el-tag type="primary" class="mode-tag">模式: 手动模式</el-tag>
        <el-button size="mini" type="warning">手动控制</el-button>
        <el-button size="mini" type="primary">自动控制</el-button>
        <el-button size="mini" type="primary">更新系统时间</el-button>
        <el-button size="mini" type="primary">远程重启</el-button>
      </div>

      <!-- 点灯自动工作模式组件 -->
      <div class="auto-mode-container" style="margin: 12px 0;">
        <DeviceAutoMode
          :sn="currentSn"
          @run-mode="handleRunMode"
          @add-mode="handleAddMode"
          @save-offset="handleSaveOffset"
        />
      </div>

      <!-- 三相电 + 功耗参数区 -->
      <div class="param-row">
        <div class="param-card phase-card">
          <div class="phase-label">A相</div>
          <p>电压: 209.90 V</p>
          <p>电流: 0.59 A</p>
          <p>有功功率: 0.12 kW</p>
          <p>功率因数: 0.98</p>
        </div>
        <div class="param-card phase-card">
          <div class="phase-label">B相</div>
          <p>电压: 208.50 V</p>
          <p>电流: 0.60 A</p>
          <p>有功功率: 0.12 kW</p>
          <p>功率因数: 0.98</p>
        </div>
        <div class="param-card phase-card">
          <div class="phase-label">C相</div>
          <p>电压: 208.60 V</p>
          <p>电流: 0.00 A</p>
          <p>有功功率: 0.00 kW</p>
          <p>功率因数: 0.00</p>
        </div>
        <div class="param-card power-card">
          <div class="phase-label">功耗</div>
          <p>有功电能: 90.68kWh</p>
          <p>总有功功率: 0.23kW</p>
          <p>功率因数: 0.98</p>
        </div>
      </div>

      <!-- 直流回路区 -->
      <!-- <div class="dc-loop-card">
        <div class="dc-label">直流回路</div>
        <div class="dc-content">
          <p class="dc-item">回路: {{ currentDcIndex + 1 }}</p>
          <p class="dc-item">直流电压: {{ dcLoopList[currentDcIndex].voltage }}V</p>
          <p class="dc-item">直流电流: {{ dcLoopList[currentDcIndex].current }}A</p>
          <p class="dc-item">直流功率: {{ dcLoopList[currentDcIndex].power }}kW</p>

          <div class="dc-arrow-group">
            <el-button
              icon="el-icon-arrow-left"
              circle
              size="mini"
              class="dc-arrow-btn"
              @click="prevDcLoop">
            </el-button>

            <el-button
              icon="el-icon-arrow-right"
              circle
              size="mini"
              class="dc-arrow-btn"
              @click="nextDcLoop">
            </el-button>
          </div>
        </div>
      </div> -->
      <!-- 直流回路区 -->
      <div class="dc-loop-card">
        <div class="dc-label">直流回路</div>
        <div class="dc-content">
          <el-button
            size="mini"
            type="primary"
            class="dc-toggle-btn"
            @click="toggleDcAll">
            {{ showAllDc ? '返回单路' : '查看全部6路' }}
          </el-button>

          <div v-if="showAllDc" class="dc-all-cards">
            <div
              v-for="(item, idx) in dcLoopList"
              :key="idx"
              class="dc-all-card">
              <div class="dc-card-title">回路{{ idx + 1 }}</div>
              <div class="dc-card-row">
                <span class="dc-card-label">电压</span>
                <span class="dc-card-value">{{ item.voltage }} V</span>
              </div>
              <div class="dc-card-row">
                <span class="dc-card-label">电流</span>
                <span class="dc-card-value">{{ item.current }} A</span>
              </div>
              <div class="dc-card-row">
                <span class="dc-card-label">功率</span>
                <span class="dc-card-value">{{ item.power }} kW</span>
              </div>
            </div>
          </div>

          <template v-else>
            <p class="dc-item">回路: {{ currentDcIndex + 1 }}</p>
            <p class="dc-item">直流电压: {{ dcLoopList[currentDcIndex].voltage }}V</p>
            <p class="dc-item">直流电流: {{ dcLoopList[currentDcIndex].current }}A</p>
            <p class="dc-item">直流功率: {{ dcLoopList[currentDcIndex].power }}kW</p>

            <div class="dc-arrow-group">
              <el-button
                icon="el-icon-arrow-left"
                circle
                size="mini"
                class="dc-arrow-btn"
                @click="prevDcLoop">
              </el-button>
              <el-button
                icon="el-icon-arrow-right"
                circle
                size="mini"
                class="dc-arrow-btn"
                @click="nextDcLoop">
              </el-button>
            </div>
          </template>
        </div>
      </div>

      <!-- 开关回路 -->
      <div class="switch-loop-row">
        <div
          class="switch-item"
          :class="item.status ? 'on' : 'off'"
          v-for="item in switchLoops"
          :key="item.id"
          @click="toggleSwitch(item)"
        >
          <span class="status-tag">
            {{ item.status ? '通' : '断' }}
          </span>

          <p class="loop-name">回路{{ item.id }}</p>
          <p class="loop-tip">鼠标切换通路/断路</p>
        </div>
      </div>

      <!-- 调光回路 -->
      <!-- <div class="dimmer-loop-row">
        <div class="dimmer-item" v-for="item in dimmerLoops" :key="item.id">
          <div class="dimmer-header">
            <span>调光回路{{ item.id }}</span>
            <el-button size="mini" type="primary" @click="sendDimmerCmd(item)">调光</el-button>
          </div>
          <div
             @mousedown.native.stop
             @pointerdown.native.stop
             @touchstart.native.stop
             @mouseup.native.stop>
            <el-slider
              v-model="item.brightness"
              :min="0"
              :max="100"
            ></el-slider>
          </div>
          <p class="brightness-val">亮度: {{ item.brightness }}</p>
        </div>
      </div> -->
      <!-- 调光回路 -->
      <div class="dimmer-loop-row">
        <div class="dimmer-item" v-for="item in dimmerLoops" :key="item.id">
          <div class="dimmer-header">
            <span>调光回路{{ item.id }}</span>
            <el-button size="mini" type="primary" @click="sendDimmerCmd(item)">调光</el-button>
          </div>
          <div
            class="slider-wrap"
            @mousedown.native.stop
            @pointerdown.native.stop
            @touchstart.native.stop
            @mouseup.native.stop
          >
            <el-slider
              v-model="item.brightness"
              :min="0"
              :max="100"
              class="d-slider"
            ></el-slider>
            <el-input-number
              v-model="item.brightness"
              :min="0"
              :max="100"
              :step="1"
              size="mini"
              class="dimmer-num-input"
            ></el-input-number>
          </div>
          <p class="brightness-val">亮度: {{ item.brightness }}</p>
        </div>
      </div>

      <!-- 告警管理页面组件 -->
      <div style="margin-top: 16px;">
        <AlarmHandleTab :bindStationId="devInfo.id" />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import AlarmHandleTab from '@/components/screen/alarmHandleTab.vue'
import DeviceAutoMode from '@/components/screen/deviceAutoMode.vue'

export default {
  name: 'DeviceControlPanel',
  components: {
    AlarmHandleTab,
    DeviceAutoMode
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    remoteId: {
      type: String,
      default: ''
    },
    devStatusToPanel: {
      type: String,
      default: 'offline'
    },
    devInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      showAllDc: false,
      currentDcIndex: 0,
      dcLoopList: [
        { voltage: '0.00', current: '0.00', power: '0.00' },
        { voltage: '0.00', current: '0.00', power: '0.00' },
        { voltage: '0.00', current: '0.00', power: '0.00' },
        { voltage: '0.00', current: '0.00', power: '0.00' },
        { voltage: '0.00', current: '0.00', power: '0.00' },
        { voltage: '0.00', current: '0.00', power: '0.00' }
      ],
      switchLoops: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        status: false
      })),
      dimmerLoops: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        brightness: 0
      })),
      instance: this.$ajax.create({
        baseURL: this.$appHost
      })
    }
  },
  mounted () {
    console.log('devicepanel 接收父节点数据 devInfo：', this.devInfo)
  },
  watch: {
    devStatusToPanel (newVal) {
      console.log('✅devStatusToPanel 面板收到状态变化', newVal)
    }
  },
  methods: {
    toggleDcAll () {
      this.showAllDc = !this.showAllDc
    },

    handleRunMode (mode, sn) {
      console.log('执行当前模式', mode, sn)
    },
    handleAddMode () {
      console.log('新增模式')
    },
    handleSaveOffset (val, sn) {
      console.log('保存日出日落偏差', val, sn)
    },
    getStatusText (s) {
      const map = {
        online: '在线',
        offline: '离线',
        unknown: '身份异常'
      }
      return map[s] || s
    },
    handleClose () {
      this.$emit('update:visible', false)
    },
    prevDcLoop () {
      this.currentDcIndex -= 1
      if (this.currentDcIndex < 0) {
        this.currentDcIndex = this.dcLoopList.length - 1
      }
    },
    nextDcLoop () {
      this.currentDcIndex += 1
      if (this.currentDcIndex >= this.dcLoopList.length) {
        this.currentDcIndex = 0
      }
    },
    async sendCmd (content) {
      content = content + '\r\n'
      if (!this.remoteId) {
        this.$message.warning('未获取到远端ID')
        return
      }

      const items = {
        clientKey: this.remoteId,
        content: content
      }

      try {
        const res = await this.instance({
          url: '/api/tcp/send',
          method: 'post',
          data: items
        })

        console.log('指令收到应答！', res)
        console.log('指令返回信息:', res.data.msg)

        const msg = '指令应答返回:' + res.data.msg

        if (res.data.data.code === 1) {
          this.$message.success(msg)
        } else if (res.data.data.code === -1) {
          this.$message.warning(msg)
        } else {
          this.$message.warning(msg)
        }
      } catch (error) {
        console.error('指令下发失败', error)
        this.$message.error('指令下发失败')
      }
    },
    async cmdAllOn () {
      this.switchLoops.forEach((item) => {
        item.status = true
      })
      await this.sendCmd('{"cmd":"allOn"}')
    },
    async cmdAllOff () {
      this.switchLoops.forEach((item) => {
        item.status = false
      })
      await this.sendCmd('{"cmd":"allOff"}')
    },
    async cmdRefresh () {
      await this.sendCmd('{"cmd":"refresh"}')
    },
    async toggleSwitch (item) {
      item.status = !item.status
      await this.sendCmd(`{"cmd":"switch","ch":${item.id},"on":${item.status}}`)
    },
    async sendDimmerCmd (item) {
      await this.sendCmd(`{"cmd":"dim","ch":${item.id},"val":${item.brightness}}`)
    }
  }
}
</script>

<style scoped>
/* 顶部设备信息栏 */
.top-bar {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 24px;
  background: #303a70;
  padding: 8px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  color: #fff;
  font-size: 14px;
}

.info-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.info-label {
  color: #78c8e8;
  margin-right: 4px;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.status-dot.online {
  background: #00ff66;
  box-shadow: 0 0 5px #00ff66;
}

.status-dot.offline {
  background: #ff2a2a;
  box-shadow: 0 0 5px #ff2a2a;
}

.status-dot.unknown {
  background: #ffcc00;
  box-shadow: 0 0 5px #ffcc00;
}

/* 操作按钮区 */
.action-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.status-tip {
  color: #fff;
  margin: 0 10px;
}

.btn-refresh {
  background: #222;
  border: 1px solid #ff6600;
  color: #ff6600;
}

.mode-tag {
  background: #0a2a5a;
  color: #00ffff;
}

/* 参数卡片 */
.param-row {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.param-card {
  flex: 1;
  background: #14203a;
  padding: 12px;
  border-radius: 4px;
}

.phase-label {
  font-size: 20px;
  color: #73b8ff;
  margin-bottom: 8px;
}

/* 直流回路 */
.dc-loop-card {
  display: flex;
  background: #14203a;
  margin-bottom: 15px;
  border-radius: 4px;
}

.dc-label {
  width: 60px;
  background: #3a4a6a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-rl;
  font-size: 18px;
}

.dc-content {
  flex: 1;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.dc-item {
  margin: 0;
  color: #fff;
}

.dc-arrow-group {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

/* 直流回路箭头按钮美化 */
.dc-content .dc-arrow-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(10, 40, 90, 0.45);
  border: 1px solid rgba(0, 255, 255, 0.45);
  color: #00ffff;
  font-weight: bold;
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.25);
  transition: all 0.2s ease;
}

.dc-content .dc-arrow-btn:hover {
  background: rgba(0, 255, 255, 0.15);
  border-color: #00ffff;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.55);
}

.dc-content .dc-arrow-btn:active {
  transform: scale(0.96);
}

/* 统一箭头图标大小 */
.dc-content .dc-arrow-btn .el-icon-arrow-left,
.dc-content .dc-arrow-btn .el-icon-arrow-right {
  font-size: 14px;
}

/* 开关回路 */
.switch-loop-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.switch-item {
  background: #14203a;
  border: 1px solid rgba(120, 160, 220, 0.25);
  border-radius: 6px;
  padding: 14px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

/* 断路状态 */
.switch-item.off {
  border-color: rgba(255, 90, 90, 0.35);
  background: rgba(255, 90, 90, 0.06);
}

.switch-item.off .status-tag {
  background: rgba(255, 90, 90, 0.14);
  color: #ff6b6b;
  border: 1px solid rgba(255, 90, 90, 0.45);
}

.switch-item.off .loop-name,
.switch-item.off .loop-tip {
  color: #8fa5c8;
}

/* 通路状态 */
.switch-item.on {
  border-color: rgba(0, 255, 120, 0.55);
  background: rgba(0, 255, 120, 0.1);
  box-shadow: 0 0 14px rgba(0, 255, 120, 0.25);
}

.switch-item.on .status-tag {
  background: rgba(0, 255, 120, 0.18);
  color: #00ff78;
  border: 1px solid rgba(0, 255, 120, 0.5);
  box-shadow: 0 0 10px rgba(0, 255, 120, 0.35);
}

.switch-item.on .loop-name {
  color: #ffffff;
}

.switch-item.on .loop-tip {
  color: #b8ffd4;
}

/* 通断标签 */
.status-tag {
  display: inline-block;
  min-width: 44px;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.loop-name {
  font-size: 14px;
  color: #fff;
  margin: 0 0 4px;
}

.loop-tip {
  font-size: 12px;
  color: #90a4c8;
  margin: 0;
}

/* 调光回路 */
.dimmer-loop-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.dimmer-item {
  background: #14203a;
  padding: 12px;
  border-radius: 4px;
}

.dimmer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.brightness-val {
  font-size: 12px;
  color: #90a4c8;
  text-align: center;
  margin: 4px 0 0;
}

/* 弹窗样式覆盖 */
::v-deep .dark-panel-dialog .el-dialog {
  background: #0b1229;
}

::v-deep .dark-panel-dialog .el-dialog__header {
  background: #0b1229;
  border-bottom: 1px solid #00ffff;
}

::v-deep .dark-panel-dialog .el-dialog__title {
  color: #00ffff;
}

::v-deep .dark-panel-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}

::v-deep .dark-panel-dialog .el-dialog__header .el-dialog__title {
  font-size: 46px !important;
  font-weight: bold !important;
  color: #00ffff !important;
}

::v-deep .dark-panel-dialog .el-tab-pane {
  background-color: #0b1229 !important;
}

::v-deep .dark-panel-dialog .el-tabs__content {
  background-color: #0b1229 !important;
}

::v-deep .dark-panel-dialog .el-table__empty-block {
  background-color: #0b1229 !important;
}

::v-deep .dark-panel-dialog .el-table__body-wrapper {
  background-color: #0b1229 !important;
}

.device-panel-dark {
  color: #fff;
}

.online-text {
  color: #67c23a;
}

.offline-text {
  color: #f56c6c;
}
/* 调光滑块*/
.slider-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.d-slider {
  flex: 1;
}
.dimmer-num-input {
  width: 90px;
}
.dc-all-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  flex: 1;
}
.dc-all-card {
  background: #14203a;
  border: 1px solid rgba(0,229,255,0.25);
  border-radius: 6px;
  padding: 10px;
}
.dc-card-title {
  font-size: 14px;
  font-weight: bold;
  color: #00e5ff;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px dashed rgba(0,229,255,0.3);
}
.dc-card-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 3px 0;
}
.dc-card-label {
  color: #73b8ff;
}
.dc-card-value {
  color: #fff;
}

/* 直流回路切换按钮：深色科技风 */
</style>

<style>
.dark-panel-dialog .el-dialog__header,
.dark-panel-dialog .el-dialog__body {
  background-color: #101828;
}

.dark-panel-dialog .el-dialog__body {
  padding: 12px 16px;
}
.dark-panel-dialog .el-input-number.dimmer-num-input .el-input-number__decrease,
.dark-panel-dialog .el-input-number.dimmer-num-input .el-input-number__increase {
  background-color: #0f2238 !important;
  border-color: #2c5b88 !important;
  color: #00e5ff !important;
  width: 24px !important;
  height: 24px !important;
  font-weight: bold !important;
  font-size: 14px !important;
}
.dark-panel-dialog .el-input-number.dimmer-num-input .el-input-number__decrease:hover,
.dark-panel-dialog .el-input-number.dimmer-num-input .el-input-number__increase:hover {
  background-color: #153455 !important;
  border-color: #00e5ff !important;
  color: #ffffff !important;
}
.dark-panel-dialog .el-input-number.dimmer-num-input .el-input-number__decrease:active,
.dark-panel-dialog .el-input-number.dimmer-num-input .el-input-number__increase:active {
  background-color: #005b70 !important;
}
.dark-panel-dialog .el-input-number.dimmer-num-input .el-input-number__decrease.is-disabled,
.dark-panel-dialog .el-input-number.dimmer-num-input .el-input-number__increase.is-disabled {
  background-color: #182533 !important;
  border-color: #243b50 !important;
  color: #446078 !important;
  cursor: not-allowed !important;
}
.dark-panel-dialog .el-input-number.dimmer-num-input .el-input__inner {
  background: #14203a !important;
  border-color: #2c5b88 !important;
  color: #fff !important;
  text-align: center !important;
}
/* 直流回路切换按钮：与“调光”按钮保持一致 */
.el-button.dc-toggle-btn {
  background-color: #409eff !important;
  border-color: #409eff !important;
  color: #ffffff !important;
  font-weight: bold !important;
}

.el-button.dc-toggle-btn:hover {
  background-color: #66b1ff !important;
  border-color: #66b1ff !important;
  color: #ffffff !important;
}

.el-button.dc-toggle-btn:active {
  background-color: #3a8ee6 !important;
  border-color: #3a8ee6 !important;
}

</style>
