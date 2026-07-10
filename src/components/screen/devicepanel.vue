<template>
  <el-dialog
    title="设备控制面板"
    :visible.sync="visible"
    width="1200px"
    @close="handleClose"
    custom-class="dark-panel-dialog"
  >
    <!-- 自定义标题插槽，内联样式强制放大 -->
    <template slot="title">
      <div style="width: 100%; text-align: center;">
        <span style="font-size: 22px; font-weight: bold; color: #00ffff; letter-spacing: 2px;">设备控制面板</span>
      </div>
    </template>

    <div class="device-panel-dark">
      <!-- 顶部设备信息栏 -->
      <div class="top-bar">
        <span class="info-item">
          <span class="red-dot"></span>名称/编号: 样机
        </span>
        <span class="info-item">
          <span class="red-dot"></span>型号: LT100
        </span>
        <span class="info-item">
          <span class="red-dot"></span>状态: 在线
        </span>
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
      <div class="dc-loop-card">
        <div class="dc-label">直流回路</div>
        <div class="dc-content">
          <p>回路: 1</p>
          <p>直流电压: 0.00V</p>
          <p>直流电流: 0.00A</p>
          <p>直流功率: 0.00kW</p>
          <el-button icon="el-icon-right" circle size="mini" class="dc-next"></el-button>
        </div>
      </div>

      <!-- 开关回路：使用原生 el-icon-light 灯具图标 -->
      <div class="switch-loop-row">
        <div
          class="switch-item"
          v-for="item in switchLoops"
          :key="item.id"
          @click="toggleSwitch(item)"
        >
          <!-- <i class="el-icon-light" :class="item.status ? 'on' : 'off'"></i> -->
          <i :class="item.status ? 'on' : 'off'">{{ item.status ? '💡' : '💡' }}</i>
          <p>名称: 回路{{ item.id }}</p>
          <p class="app-tip">控制: 通路/断路</p>
        </div>
      </div>

      <!-- 调光回路（5路） -->
      <div class="dimmer-loop-row">
        <div class="dimmer-item" v-for="item in dimmerLoops" :key="item.id">
          <div class="dimmer-header">
            <span>名称: 调光回路{{ item.id }}</span>
            <el-button size="mini" type="primary" @click="sendDimmerCmd(item)">调光</el-button>
          </div>
          <el-slider
            v-model="item.brightness"
            :min="0"
            :max="100"
            @change="sendDimmerCmd(item)"
          ></el-slider>
          <p class="brightness-val">亮度: {{ item.brightness }}</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DeviceControlPanel',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    remoteId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      switchLoops: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        status: false
      })),
      dimmerLoops: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        brightness: 0
      })),
      instance: this.$ajax.create({
        baseURL: this.$appHost
      })
    }
  },
  methods: {
    handleClose () {
      this.$emit('update:visible', false)
    },
    async sendCmd (content) {
      content = content + '\r\n'
      if (!this.remoteId) {
        this.$message.warning('未获取到远端ID')
        return
      }
      let items = {}
      items.clientKey = this.remoteId
      items.content = content
      this.instance({
        url: '/api/tcp/send',
        method: 'post',
        data: items
        // data: JSON.stringify({ clientKey: this.remoteId, content: content })
      }).then(res => {
        console.log('指令收到应答！', res)
        this.$message.success('指令下发成功')
        console.log('指令返回信息:', res.data.msg)
        let msg = '指令应答返回:' + res.data.msg
        if (res.data.data.code === 1) {
          this.$message.success(msg)
        } else if (res.data.data.code === -1) {
          this.$message.warning(msg)
        } else if (res.data.data.code === 0) {
          this.$message.warning(msg)
        }
      })
      // try {
      //   await fetch(this.$appHost + '/api/tcp/send', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ clientKey: this.remoteId, content })
      //   })
      //   this.$message.success('指令下发成功')
      // } catch (e) {
      //   this.$message.error('指令下发失败')
      //   console.error(e)
      // }
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
.device-panel-dark {
  background: #0b1229;
  color: #fff;
  padding: 15px;
  border-radius: 8px;
}
/* 顶部信息栏 */
.top-bar {
  background: #303a70;
  padding: 8px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}
.info-item {
  margin-right: 20px;
}
.red-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #ff3b30;
  border-radius: 50%;
  margin-right: 5px;
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
  gap: 20px;
}
.dc-next {
  margin-left: auto;
}
/* 开关回路 图标样式 */
.switch-loop-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}
.switch-item {
  background: #14203a;
  padding: 12px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}
.el-icon-light {
  font-size: 24px;
}
/* 通电绿色 / 断电红色 */
.on {
  color: #4cd964;
  font-size: 24px;
}
.off {
  color: #ff3b30;
  font-size: 24px;
}
.app-tip {
  font-size: 12px;
  color: #90a4c8;
}
/* 调光回路 */
.dimmer-loop-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
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
</style>
