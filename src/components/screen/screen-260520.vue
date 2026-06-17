<template>
  <div class="screen-page">
    <!-- 顶部导航 -->
    <div class="top-bar">
      <div class="top-left">
        <span>项目</span>
        <select class="select">
          <option>三合云海</option>
        </select>
        <span>设备</span>
        <select class="select">
          <option>样机</option>
        </select>
        <button class="btn">批量</button>
      </div>

      <div class="top-title">LED直流智能照明及能源管理平台</div>

      <div class="top-right">
        <button class="btn">注销</button>
        <button class="btn">缩放</button>
        <button class="btn">个人后台</button>
        <div class="time">{{ nowTime }}</div>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="content-screen">
      <!-- 左侧 -->
      <div class="left-box">
        <dv-border-box-1 class="panel">
          <div class="panel-title"> 项目统计 </div>
            <div class="stat-grid">
            <!-- 第一行 -->
              <div class="stat-card">
              <div class="num">0.23</div>
              <div class="unit">(kW)</div>
              <div class="label">总功率</div>
            </div>
            <div class="stat-card">
              <div class="num">90.68</div>
              <div class="unit">(kWh)</div>
              <div class="label">总累计消耗</div>
            </div>
           <!-- 第二行 -->
           <div class="stat-card">
             <div class="num">90.68</div>
             <div class="unit">(kWh)</div>
             <div class="label">今年累计消耗</div>
           </div>
           <div class="stat-card">
             <div class="num">100</div>
             <div class="unit"></div>
             <div class="label">部署站点</div>
          </div>
        </div>
        </dv-border-box-1>

        <dv-border-box-1 class="panel m-top">
          <div class="panel-title"> 能耗 </div>
          <div class="date-box">
            <span>日期</span>
            <input type="month" v-model="month" class="input-month" />
          </div>
          <div class="chart-title">2025年8月每日有功电耗</div>
          <div ref="chartLine" class="chart" style="height: 200px;"></div>
        </dv-border-box-1>
      </div>

      <!-- 中间地图 -->
      <div class="center-box">
        <dv-border-box-1 class="panel map-panel">
          <div class="panel-title"> 设备分布 </div>
          <div class="map-box">
            <div class="map-placeholder">
              <div class="map-point"></div>
            </div>
          </div>
        </dv-border-box-1>
      </div>

      <!-- 右侧设备列表 -->
      <div class="right-box">
        <dv-border-box-1 class="panel">
          <div class="panel-title"> 设备列表 </div>
          <input
            type="text"
            class="search-input"
            placeholder="Please input"
          />
          <table class="device-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>名字</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>样机</td>
                <td class="offline">离线</td>
              </tr>
            </tbody>
          </table>
        </dv-border-box-1>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
// import { getHeight } from '@/utils/height.js'
import { borderBox1 } from '@jiaminghi/data-view'
import * as echarts from 'echarts'

export default {
  components: {
    borderBox1
  },
  data () {
    return {
      nowTime: '',
      month: '2025-08',
      timer: null
    }
  },
  created () {
    this.$nextTick(function () {
      $('.orgTreeList').removeClass('treeListShow').addClass('treeListHide')
      // getHeight()
      // this.getHeightsWidths()
    })
  },
  mounted () {
    this.updateTime()
    this.timer = setInterval(() => this.updateTime(), 1000)
    this.initLineChart()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    getHeightsWidths () {
    //  高度判断
      var contentHeight = $(window).height() - 120
      var menuHeight = $('.menubanner').outerHeight()
      $('.content').height(contentHeight)
      $('.orgTreeList').css('top', menuHeight)
      $('.openTreeList').css('top', menuHeight)
      if ($('.orgTreeList').hasClass('treeListShow')) {
        var contentWidth = $(window).width()
        var treeWidth = $('.orgTreeList').width()
        $('.content').css('left', 0)
        $('.content').width(contentWidth - treeWidth - 10)
      } else {
        var contentWidths = $(window).width()
        $('.content').css('left', 0)
        $('.content').width(contentWidths - 10)
        $('.screen-page').width(contentWidths - 10)
      }
    },
    updateTime () {
      const date = new Date()
      const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const w = week[date.getDay()]
      const y = date.getFullYear()
      const m = (date.getMonth() + 1).toString().padStart(2, '0')
      const d = date.getDate().toString().padStart(2, '0')
      const hh = date.getHours().toString().padStart(2, '0')
      const mm = date.getMinutes().toString().padStart(2, '0')
      const ss = date.getSeconds().toString().padStart(2, '0')
      this.nowTime = `${w} ${y}-${m}-${d} ${hh}:${mm}:${ss}`
    },

    initLineChart () {
      const myChart = echarts.init(this.$refs.chartLine)
      myChart.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: 25, right: 25, top: 15, bottom: 45, containLabel: true },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 20 }, (_, i) => (i + 1).toString().padStart(2, '0')),
          axisLine: { lineStyle: { color: '#fff' } },
          axisLabel: { color: '#fff', fontSize: 14 },
          axisTick: { lineStyle: { color: '#fff' } }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 3,
          axisLine: { lineStyle: { color: '#fff' } },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
          axisLabel: { color: '#fff', fontSize: 14 },
          axisTick: { lineStyle: { color: '#fff' } }
        },
        series: [
          {
            name: '电耗',
            type: 'line',
            smooth: true,
            data: [2.5, 2.5, 2.5, 2.5, 2.5, 2.4, 2.2, 2.0, 1.8, 1.5, 1.2, 1.0, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.2, 0.2],
            itemStyle: { color: '#00ffff' },
            lineStyle: { color: '#00ffff', width: 2 },
            symbol: 'circle',
            symbolSize: 8,
            itemColor: '#00ffff'
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.screen-page {
  /* width: 100%; */
  height: 100%;
  background: #0b1229!important;
  color: #fff;
  overflow: hidden;
  display: flex!important;
  flex-direction: column;
}

.top-bar {
  width: 100%;
  height: 60px;
  background: linear-gradient(to right, #031c3e, #062a5c);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #00ffff;
}
.top-left,
.top-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.select {
  background: #0b2a5a;
  color: #fff;
  border: 1px solid #00ffff;
  padding: 4px 8px;
}
.btn {
  background: #00ffff;
  color: #000;
  border: none;
  padding: 4px 10px;
  cursor: pointer;
}
.top-title {
  font-size: 26px;
  color: #00ffff;
  font-weight: bold;
}
.time {
  color: #00ffff;
  margin-left: 10px;
  font-size: 14px;
}

.content-screen {
  flex: 1;
  /* display: flex; */
  display: flex !important;  /* ✅ 强制永远是 flex，永不失效 */
  flex-wrap: nowrap !important; /* ✅ 强制不换行，永不错位 */
  padding: 15px 15px 15px 20px; /* 👈 把 padding-right 从 20px → 30px，增加右侧安全距离 */
  gap: 14px;
  height: calc(100% - 65px);
  box-sizing: border-box;
  overflow: hidden;
}
.left-box {
  width: 18%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.center-box {
  flex: 1;
  min-width: 0;
  /* height: 100%; *//*保持高度不变*/
}
.right-box {
  width: 19%;
  flex-shrink: 0;
  /* margin-right: 10px; */
}

/* ====================== 👈 修改1：去掉内边距，解决整体左偏 ====================== */
.panel {
  width: 100%;
  padding: 0; /* 👈 从 10px → 0 */
  box-sizing: border-box;
  position: relative;
  background-color: #0b1229!important;
}
.m-top {
  margin-top: 15px;
}
.panel-title {
  text-align: center;
  color: #00ffff;
  font-size: 16px;
  margin-bottom: 15px;
}

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px 15px;
  padding: 10px 15px; /* 👈 修改2：左右加内边距，居中 */
}
.stat-card {
  text-align: center;
}
.stat-card .num {
  font-size: 36px;
  color: #00ffff;
  font-weight: bold;
  line-height: 1;
  text-shadow: 0 0 8px rgba(0,255,255,0.6);
  font-family: "DS-Digital", "LED Digital", monospace;
}
.stat-card .unit {
  font-size: 20px;
  color: #00ffff;
  margin: 6px 0;
}
.stat-card .label {
  font-size: 22px;
  color: #fff;
  opacity: 0.9;
}
.panel-title {
  text-align: center;
  color: #00ffff;
  font-size: 26px;
  margin-bottom: 25px;
}

.date-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #fff;
  padding: 0 15px; /* 👈 修改3：居中 */
}
.input-month {
  background: #0b2a5a;
  color: #fff;
  border: 1px solid #00ffff;
  padding: 4px 8px;
  font-size: 16px;
}
.chart-title {
  color: #ff9500;
  font-size: 18px;
  margin-bottom: 10px;
  padding: 0 15px; /* 👈 修改4：居中 */
}
.chart {
  width: 100%;
  height: 180px;
  box-sizing: border-box;
  padding: 0 10px; /* 👈 修改5：居中 */
}

/* ====================== 地图样式 ====================== */
.map-panel {
  height: 100%;
}
.map-box {
  width: calc(100% - 20px);
  height: calc(100% - 80px);
  background: #08254a;
  border: 1px solid #00ffff;
  position: relative;
  overflow: hidden;
  margin: 0 auto; /* 👈 修改6：居中，不左偏 */
}
.map-placeholder {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, #0a4d8c 0%, #051a33 100%);
  position: relative;
}
.map-point {
  width: 15px;
  height: 15px;
  background: #ff0000;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.3); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

/* ====================== 右侧列表居中 ====================== */
.search-input {
  width: calc(100% - 20px);
  margin: 0 10px 12px 10px; /* 👈 保持不变，已居中 */
  background: #0b2a5a;
  color: #fff;
  border: 1px solid #00ffff;
  padding: 6px;
  box-sizing: border-box;
}
.device-table {
  width: calc(100% - 20px);
  margin: 0 10px; /* 👈 保持不变，已居中 */
  border-collapse: collapse;
  font-size: 14px;
}
.device-table th,
.device-table td {
  border: 1px solid #00ffff;
  padding: 8px;
  text-align: center;
}
.device-table th {
  background: #023a70;
  color: #00ffff;
}
.offline {
  color: #ff2a2a;
  font-weight: bold;
}
</style>
