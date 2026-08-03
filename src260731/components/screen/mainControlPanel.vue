<template>
  <div class="device-panel-wrap" v-if="visible">
    <div class="panel-mask" @click="handleMaskClose"></div>
    <div class="panel-container">
      <!-- 头部标题栏 固定高度 -->
      <div class="panel-header">
        <div class="header-slot"></div>
        <div class="panel-title">照明系统总控面板</div>
        <div class="panel-close" @click="closePanel">✕</div>
      </div>

      <!-- 可滚动主体区域 -->
      <div class="panel-scroll-body">
        <!-- 顶部操作按钮 -->
        <div class="top-buttons">
          <button class="btn-blue">立即巡检</button>
          <button class="btn-green">开灯</button>
          <button class="btn-red">关灯</button>
          <button class="btn-blue">调光</button>
          <button class="btn-blue">同步时间</button>
          <button class="btn-blue">设备升级</button>
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

        <!-- 数据分析图表区域 -->
        <div class="chart-wrap">
          <div class="chart-section-title">数据分析统计</div>
          <!-- 第一行：用电量折线 + 设备分布圆环饼图 左右并排 -->
          <div class="chart-row-two">
            <div class="chart-card">
              <div class="chart-title">近两日用电量对比(kWh)</div>
              <div ref="eleChartRef" class="chart-dom"></div>
            </div>
            <div class="chart-card">
              <div class="chart-title">设备类型分布</div>
              <div ref="pieChartRef" class="chart-dom"></div>
            </div>
          </div>
          <!-- 第二行：设备状态统计折线图 通栏铺满 -->
          <div class="chart-row-full">
            <div class="status-full-card">
              <div class="chart-title">设备状态统计</div>
              <div ref="statusChartRef" class="chart-dom"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'MainControlPanel',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      eleChart: null,
      pieChart: null,
      statusChart: null
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.initAllCharts()
          }, 180)
        })
      } else {
        this.destroyAllChart()
      }
    }
  },
  beforeDestroy () {
    this.destroyAllChart()
    window.removeEventListener('resize', this.resizeCharts)
  },
  methods: {
    closePanel () {
      this.$emit('close')
    },
    handleMaskClose () {
      this.$emit('close')
    },

    destroyAllChart () {
      if (this.eleChart) {
        this.eleChart.dispose()
      }
      if (this.pieChart) {
        this.pieChart.dispose()
      }
      if (this.statusChart) {
        this.statusChart.dispose()
      }
      this.eleChart = null
      this.pieChart = null
      this.statusChart = null
    },
    // ========== 修复：增加所有实例存在校验 ==========
    resizeCharts () {
      if (this.eleChart && typeof this.eleChart.resize === 'function') {
        this.eleChart.resize()
      }
      if (this.pieChart && typeof this.pieChart.resize === 'function') {
        this.pieChart.resize()
      }
      if (this.statusChart && typeof this.statusChart.resize === 'function') {
        this.statusChart.resize()
      }
    },

    initAllCharts () {
      this.initElectricChart()
      this.initPieChart()
      this.initStatusChart()
      window.addEventListener('resize', this.resizeCharts)
      this.resizeCharts()
    },

    initElectricChart () {
      const dom = this.$refs.eleChartRef
      if (!dom) {
        return
      }
      this.eleChart = echarts.init(dom)
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 20, 40, 0.9)',
          borderColor: '#00ffff',
          textStyle: { color: '#fff' }
        },
        legend: {
          data: ['2026-07-22', '2026-07-23'],
          textStyle: { color: '#fff' },
          top: 5
        },
        grid: { left: 35, right: 20, top: 55, bottom: 35 },
        xAxis: {
          type: 'category',
          data: [
            '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
            '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
            '20', '21', '22', '23'
          ],
          axisLine: { lineStyle: { color: '#00ffff66' } },
          axisLabel: { color: '#fff' }
        },
        yAxis: {
          type: 'value',
          max: 10,
          splitLine: { lineStyle: { color: '#00ffff33' } },
          axisLine: { lineStyle: { color: '#00ffff66' } },
          axisLabel: { color: '#fff' }
        },
        series: [
          {
            name: '2026-07-22',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: { color: '#e6a23c' },
            lineStyle: { width: 2 },
            data: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 2.3, 9.4, 8.5, 8.0,
              6.2, 2.0
            ]
          },
          {
            name: '2026-07-23',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: { color: '#00f5d4' },
            lineStyle: { width: 2 },
            data: Array(24).fill(0)
          }
        ]
      }
      this.eleChart.setOption(option)
    },

    initPieChart () {
      const dom = this.$refs.pieChartRef
      if (!dom) {
        return
      }
      this.pieChart = echarts.init(dom)
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 20, 40, 0.9)',
          borderColor: '#00ffff',
          textStyle: { color: '#fff' }
        },
        legend: {
          orient: 'vertical',
          left: 10,
          bottom: 10,
          textStyle: { color: '#fff' },
          data: ['网关', '电表', '直流柜']
        },
        series: [
          {
            type: 'pie',
            radius: ['42%', '72%'],
            center: ['65%', '48%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 6 },
            label: { show: false },
            emphasis: { label: { show: true, fontSize: 16, color: '#fff' } },
            labelLine: { show: false },
            data: [
              { value: 1, name: '网关', itemStyle: { color: '#1677ff' } },
              { value: 1, name: '电表', itemStyle: { color: '#00c4b4' } },
              { value: 1, name: '直流柜', itemStyle: { color: '#00b42a' } }
            ]
          }
        ]
      }
      this.pieChart.setOption(option)
    },

    initStatusChart () {
      const dom = this.$refs.statusChartRef
      if (!dom) {
        return
      }
      this.statusChart = echarts.init(dom)
      const xData = []
      for (let i = 0; i < 24; i++) {
        xData.push(`${i.toString().padStart(2, '0')}:00`)
      }
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 20, 40, 0.9)',
          borderColor: '#00ffff',
          textStyle: { color: '#fff' }
        },
        legend: {
          data: ['亮灯率', '终端在线率', '单灯在线率'],
          textStyle: { color: '#fff' },
          top: 5
        },
        grid: { left: 45, right: 25, top: 60, bottom: 35 },
        xAxis: {
          type: 'category',
          data: xData,
          axisLine: { lineStyle: { color: '#00ffff66' } },
          axisLabel: { color: '#fff' }
        },
        yAxis: {
          type: 'value',
          name: '百分比(%)',
          max: 100,
          splitLine: { lineStyle: { color: '#00ffff33' } },
          axisLine: { lineStyle: { color: '#00ffff66' } },
          axisLabel: { color: '#fff' }
        },
        series: [
          {
            name: '亮灯率',
            type: 'line',
            smooth: true,
            itemStyle: { color: '#1677ff' },
            data: Array(24).fill(0)
          },
          {
            name: '终端在线率',
            type: 'line',
            smooth: true,
            itemStyle: { color: '#00b42a' },
            data: [
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0
            ]
          },
          {
            name: '单灯在线率',
            type: 'line',
            smooth: true,
            itemStyle: { color: '#f53f3f' },
            data: Array(24).fill(0)
          }
        ]
      }
      this.statusChart.setOption(option)
    }
  }
}
</script>

<style scoped>
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
  background: rgba(0, 0, 0, 0.6);
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
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}
.panel-header {
  height: 46px;
  line-height: 46px;
  background: rgba(0, 255, 255, 0.1);
  /* 新增3行 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #00ffff40;
  flex-shrink: 0;
}
.panel-title {
  color: #00ffff;
  font-size: 18px;
  /* 文字居中 */
  text-align: center;
}
.panel-close {
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  /* 固定宽度，和左侧slot同宽，左右对称 */
  width: 40px;
  text-align: right;
}
/* 滚动容器 */
.panel-scroll-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
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
  background: rgba(4, 22, 48, 0.6);
  border: 1px solid #00ffff33;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bg-blue { background: #0a78ff; }
.bg-cyan { background: #00bbbb; }
.bg-green { background: #00c440; }
.bg-orange { background: #ff8822; }
.bg-purple { background: #8844dd; }
.bg-red { background: #ee4444; }
.bg-dark { background: #555966; }

.card-num {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  font-family: "DS-Digital", monospace;
}
.unit { font-size: 14px; opacity: 0.8; }
.card-label { color: #e8e8e8; font-size: 15px; margin: 3px 0; }
.card-desc { color: #999; font-size: 13px; }
.card-rate.green { color: #00ff66; }
.card-rate.orange { color: #ff9500; }
.card-rate.red { color: #ff4444; }

.chart-wrap {
  margin-top: 24px;
}
.chart-section-title {
  color: #00ffff;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #00ffff33;
}
.chart-row-two {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.chart-card {
  flex: 1;
  background: rgba(4, 22, 48, 0.6);
  border: 1px solid #00ffff33;
  border-radius: 8px;
  padding: 14px;
  height: 320px;
  display: flex;
  flex-direction: column;
}
.status-full-card {
  width: 100%;
  height: 360px;
  background: rgba(4, 22, 48, 0.6);
  border: 1px solid #00ffff33;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
}
.chart-row-full {
  width: 100%;
}
.chart-title {
  color: #fff;
  font-size: 16px;
  margin-bottom: 10px;
}
.chart-dom {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
