<template>
  <div class="device-panel-wrap" v-if="visible">
    <div class="panel-mask" @click="handleMaskClose"></div>
    <div class="panel-container">
      <!-- 头部标题栏 -->
      <div class="panel-header">
        <div class="panel-title">照明系统数据总控面板</div>
        <div class="panel-close" @click="closePanel">✕</div>
      </div>

      <div class="panel-body">
        <!-- 顶部操作按钮 -->
        <div class="top-buttons">
          <button class="btn-blue">同步时间</button>
          <button class="btn-blue">立即巡检</button>
          <button class="btn-green">开灯</button>
          <button class="btn-red">关灯</button>
          <button class="btn-blue">调光</button>
        </div>

        <!-- 第一行统计卡片 -->
        <div class="card-grid row1">
          <div class="stat-card">
            <div class="card-icon bg-blue">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
            </div>
            <div class="card-content">
              <div class="card-num">1</div>
              <div class="card-label">在线网关</div>
              <div class="card-rate green">100.00%在线率</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="card-icon bg-cyan">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 19h8" stroke="#fff" stroke-width="2" fill="none"/></svg>
            </div>
            <div class="card-content">
              <div class="card-num">1</div>
              <div class="card-label">总网关数</div>
              <div class="card-desc">所有区域网关</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="card-icon bg-green">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="card-content">
              <div class="card-num">1</div>
              <div class="card-label">在线电表数</div>
              <div class="card-rate green">100.00%在线率</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="card-icon bg-orange">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div class="card-content">
              <div class="card-num">1</div>
              <div class="card-label">总电表数</div>
              <div class="card-desc">所有区域电表</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="card-icon bg-purple">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><rect x="4" y="5" width="16" height="12" rx="2"/><path d="M8 19h8" stroke="#fff" stroke-width="2" fill="none"/></svg>
            </div>
            <div class="card-content">
              <div class="card-num">1</div>
              <div class="card-label">在线直流柜</div>
              <div class="card-rate green">100.00%在线率</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="card-icon bg-red">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 19h8" stroke="#fff" stroke-width="2" fill="none"/></svg>
            </div>
            <div class="card-content">
              <div class="card-num">1</div>
              <div class="card-label">总直流柜</div>
              <div class="card-desc">所有区域直流柜台</div>
            </div>
          </div>
        </div>
        <!-- 第二行统计卡片 -->
        <div class="card-grid row2">
          <div class="stat-card">
            <div class="card-icon bg-cyan">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div class="card-content">
              <div class="card-num">0.00 <span class="unit">kWh</span></div>
              <div class="card-label">今日总耗电</div>
              <div class="card-rate red">较昨日 -100.00%</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="card-icon bg-dark">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <div class="card-content">
              <div class="card-num">6</div>
              <div class="card-label">总回路数</div>
              <div class="card-desc">所有区域回路</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="card-icon bg-green">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div class="card-content">
              <div class="card-num">0</div>
              <div class="card-label">开启回路</div>
              <div class="card-rate green">0.00%亮灯率</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="card-icon bg-orange">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
            </div>
            <div class="card-content">
              <div class="card-num">273</div>
              <div class="card-label">当前告警</div>
              <div class="card-rate orange">需及时处理</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainControlPanel',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closePanel () {
      this.$emit('close')
    },
    handleMaskClose () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
/* 和 devicepanel.vue 保持完全一致的弹窗结构样式 */
.device-panel-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
}
.panel-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
}
.panel-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 84%;
  max-width: 1400px;
  background: #0f1835;
  border: 1px solid #00ffff80;
  border-radius: 6px;
  z-index: 9999;
}
.panel-header {
  height: 46px;
  line-height: 46px;
  background: rgba(0, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #00ffff40;
}
.panel-title {
  color: #00ffff;
  font-size: 18px;
}
.panel-close {
  color: #fff;
  cursor: pointer;
  font-size: 20px;
}
.panel-body {
  padding: 16px;
  max-height: 82vh;
  overflow-y: auto;
}
.top-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.btn-blue {
  background: #0a78ff;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 3px;
}
.btn-green {
  background: #00c440;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 3px;
}
.btn-red {
  background: #ff4444;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 3px;
}

.card-grid {
  display: grid;
  gap: 14px;
  margin-bottom: 14px;
}
.row1 {
  grid-template-columns: repeat(6, 1fr);
}
.row2 {
  grid-template-columns: repeat(4, 1fr);
}
.stat-card {
  background:rgba(4,22,48,0.6);
  border:1px solid #00ffff33;
  border-radius:8px;
  padding:14px;
  display:flex;
  align-items:center;
  gap:12px;
}
.card-icon{
  width:48px;height:48px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}
.bg-blue{background:#0a78ff;}
.bg-cyan{background:#00bbbb;}
.bg-green{background:#00c440;}
.bg-orange{background:#ff8822;}
.bg-purple{background:#8844dd;}
.bg-red{background:#ee4444;}
.bg-dark{background:#555966;}

.card-num{
  font-size:32px;
  font-weight:bold;
  color:#fff;
  font-family:"DS-Digital",monospace;
}
.unit{font-size:14px;opacity:0.8;}
.card-label{color:#e8e8e8;font-size:15px;margin:3px 0;}
.card-desc{color:#999;font-size:13px;}
.card-rate.green{color:#00ff66;}
.card-rate.orange{color:#ff9500;}
.card-rate.red{color:#ff4444;}
</style>
