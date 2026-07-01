
<template>
  <div class="screen-page" :class="{ 'screen-full': isFullScreen }">
    <!-- 顶部导航 -->
    <div class="top-bar">
      <div class="top-left">
        <span>项目</span>
        <select class="select">
          <option>三合云海</option>
        </select>
        <span>设备</span>
        <select class="select">
          <option>DEMO</option>
        </select>
      </div>

      <div class="top-title">LED智能照明及能源管理平台</div>

      <div class="top-right">
        <button class="btn" disabled>注销</button>
        <button class="btn" @click="toggleFullScreen($event)">{{ isFullScreen ? '恢复缩放' : '全屏' }}</button>
        <button class="btn" disabled>后台</button>
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
          <div class="chart-title">2026年6月每日有功电耗</div>
          <div ref="chartLine" class="chart"></div>
        </dv-border-box-1>
      </div>

      <!-- 中间地图 → 已替换为高德 -->
      <div class="center-box">
        <dv-border-box-1 class="panel map-panel">
          <div id="container" class="map-box"></div>
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
              <tr @dblclick="openDevicePanel">
                <td>1</td>
                <td>DEMO</td>
                <td :class="deviceOnline ? 'online' : 'offline'">
                  {{ deviceOnline ? '在线' : '离线' }}
                </td>
              </tr>
            </tbody>
          </table>
        </dv-border-box-1>
      </div>
    </div>

    <DeviceControlPanel
      :visible.sync="showDevicePanel"
      :remoteId="remoteId"
    />
  </div>
</template>

<script>
import $ from 'jquery'
import { borderBox1 } from '@jiaminghi/data-view'
import * as echarts from 'echarts'
import DeviceControlPanel from './devicepanel.vue'
import { getHeight } from '@/utils/height.js'

export default {
  name: 'Screen',
  components: {
    borderBox1,
    DeviceControlPanel
  },
  data () {
    return {
      nowTime: '',
      month: '',
      timer: null,
      map: null,
      marker: null,
      deviceOnline: false,
      remoteId: '',
      lastGps: null,
      showDevicePanel: false,
      isFullScreen: false
    }
  },

  created () {
    this.$nextTick(() => {
      $('.orgTreeList').removeClass('treeListShow').addClass('treeListHide')
      getHeight()
      this.getHeightsWidths()
    })
    if (window.globalGpsSubscribed) {
      return
    }

    if (this.sockets) {
      this.sockets.unsubscribe('gps')

      this.sockets.subscribe('gps', (data) => {
        console.log('🔥 实时收到GPS ===>', data)
        window.latestGpsData = data
        this.remoteId = data.clientKey
        this.deviceOnline = true

        if (window.currentMapInstance && window.currentMapMarker) {
          const point = new window.AMap.LngLat(data.lng, data.lat)
          window.currentMapMarker.setPosition(point)
          window.currentMapInstance.setCenter(point)
        }
      })

      window.globalGpsSubscribed = true
    }
  },

  mounted () {
    this.updateTime()
    this.timer = setInterval(() => this.updateTime(), 1000)
    this.initLineChart()
    this.initMap()

    // resize监听 仅重算布局，不刷新地图
    window.__screenResizeHandler = () => {
      this.$nextTick(() => {
        this.getHeightsWidths()
      })
    }
    window.addEventListener('resize', window.__screenResizeHandler)

    // 监听ESC退出全屏同步状态
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.isFullScreen = false
        // ESC退出全屏后，找到全屏按钮并失焦，取消选中高亮
        this.$nextTick(() => {
          const fullBtn = document.querySelector('.top-right .btn:nth-child(2)')
          if (fullBtn) fullBtn.blur()
        })
      }
    })

    if (window.latestGpsData) {
      const data = window.latestGpsData
      this.remoteId = data.clientKey
      this.deviceOnline = true
      const point = new window.AMap.LngLat(data.lng, data.lat)
      this.marker.setPosition(point)
      this.map.setCenter(point)
    }
  },

  beforeRouteLeave (to, from, next) {
    next()
  },

  beforeDestroy () {
    clearInterval(this.timer)
    // 移除resize监听
    window.removeEventListener('resize', window.__screenResizeHandler)
    delete window.__screenResizeHandler
    // 退出全屏
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    if (this.map) {
      this.map.destroy()
    }
    window.currentMapInstance = null
    window.currentMapMarker = null
  },

  sockets: {},
  methods: {
    openDevicePanel () {
      if (!this.remoteId) {
        alert('未获取到远端ID')
        return
      }
      this.showDevicePanel = true
    },

    // 切换全屏/恢复缩放
    async toggleFullScreen (e) {
      const targetDom = document.querySelector('.screen-page')
      if (!this.isFullScreen) {
        // 进入全屏
        await targetDom.requestFullscreen().catch(err => {
          console.warn('全屏开启失败', err)
        })
        this.isFullScreen = true
      } else {
        // 退出全屏
        await document.exitFullscreen()
        this.isFullScreen = false
      }
      // 关键：按钮点击完成后强制失焦，清除选中高亮
      e.target.blur()
    },
    async initMap () {
      try {
        this.map = new window.AMap.Map('container', {
          zoom: 12,
          center: [116.331644, 40.043262],
          resizeEnable: true
        })

        // 放大图标尺寸
        const deviceIcon = new window.AMap.Icon({
          size: new window.AMap.Size(48, 64),
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iNDQiIGhlaWdodD0iNjAiIHJ4PSI0IiBzdHJva2U9IiMwMGZmNjYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0iIzBiMTIyOSIvPgogIDxyZWN0IHg9IjgiIHk9IjEwIiB3aWR0aD0iMzIiIGhlaWdodD0iMTIiIGZpbGw9IiMwMGZmNjYiLz4KICA8cGF0aCBkPSJNMjYgMzAgTDIyIDM4IEwyOCAzOCBMMjQgNDgiIHN0cm9rZT0iIzAwZmY2NiIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cmVjdCB4PSItNiIgeT0iMTQiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjMDBmZjY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8cmVjdCB4PSItNiIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjMDBmZjY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+',
          imageSize: new window.AMap.Size(48, 64)
        })

        this.marker = new window.AMap.Marker({
          position: [116.331644, 40.043262],
          icon: deviceIcon
        })
        this.map.add(this.marker)

        // 文字强化：字号加大+加粗+强外发光
        const text = new window.AMap.Text({
          position: [116.331644, 40.043262],
          text: 'DEMO',
          offset: new window.AMap.Pixel(16, -45), // 拉大文字与图标距离，避免重叠
          style: {
            color: '#00ff66',
            fontSize: '18px',
            fontWeight: 'bold',
            textShadow: '0 0 3px #000, 0 0 8px #00ff66, 0 0 12px #00ff66',
            background: 'transparent',
            border: 'none',
            whiteSpace: 'nowrap'
          }
        })
        this.map.add(text)

        this.marker.on('moving', (e) => {
          text.setPosition(e.lnglat)
        })

        window.currentMapInstance = this.map
        window.currentMapMarker = this.marker
        window.currentMapText = text

        this.marker.on('dblclick', () => {
          this.openDevicePanel()
        })

        this.map.on('dblclick', (e) => {
          const lng = e.lnglat.lng
          const lat = e.lnglat.lat
          console.log('🖱️ 双击点位：', lng, lat)
        })
      } catch (err) {
        console.warn('地图加载失败', err)
      }
    },
    getHeightsWidths () {
      var contentHeight = $(window).height() - 110
      var menuHeight = $('.menubanner').outerHeight()
      $('.content').height(contentHeight)
      $('.orgTreeList').css('top', menuHeight)
      $('.openTreeList').css('top', menuHeight)
      if ($('.orgTreeList').hasClass('treeListShow')) {
        var contentWidth = $(window).width()
        var treeWidth = $('.orgTreeList').width()
        $('.content').css('left', 0)
        $('.content').width(contentWidth - treeWidth)
        $('.screen-page').width(contentWidth - treeWidth)
      } else {
        var contentWidths = $(window).width()
        $('.content').css('left', 0)
        $('.content').width(contentWidths)
        $('.screen-page').width(contentWidths)
      }
      // 新增：图表跟随容器自动拉伸
      this.$nextTick(() => {
        if (this.$refs.chartLine) {
          const chart = echarts.getInstanceByDom(this.$refs.chartLine)
          if (chart) chart.resize()
        }
      })
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
        grid: {
          left: 25,
          right: 25,
          top: 15,
          bottom: 45,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 20 }, (_, i) => (i + 1).toString())
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 3
        },
        series: [
          {
            name: '电耗',
            type: 'line',
            smooth: true,
            data: [2.5, 2.5, 2.5, 2.5, 2.5, 2.4, 2.2, 2.0, 1.8, 1.5, 1.2, 1.0, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.2, 0.2]
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
/* 基础容器默认开启滚动，小窗口生效 */
.screen-page {
  height: 100%;
  background: #0b1229!important;
  color: #fff;
  overflow: visible !important;
  overflow-x: hidden !important;
  display: flex!important;
  flex-direction: column;
  box-sizing: border-box !important;
  width: 100%;
}
.top-bar {
  width: 100%;
  height: 40px;
  background: linear-gradient(to right, #031c3e, #062a5c);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #00ffff;
  flex-shrink: 0;
  box-sizing: border-box !important;
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
  flex: 1 !important;
  display: flex !important;
  flex-wrap: nowrap !important;
  padding: 1px;
  gap: 14px;
  min-height: unset !important;
  height: auto !important;
  box-sizing: border-box;
  width: 100% !important;
}
.left-box {
  width: 18%;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.center-box {
  flex: 1;
  min-width: 0;
}
.right-box {
  width: 19%;
  min-width: 240px;
  flex-shrink: 0;
}

.panel {
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  background-color: #0b1229!important;
  flex: 1;
}
.m-top {
  margin-top: 15px;
}
.panel-title {
  text-align: center;
  color: #00ffff;
  font-size: 26px;
  margin-bottom: 15px;
}

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 12px;
  padding: 8px 12px;
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
  margin: 4px 0;
}
.stat-card .label {
  font-size: 22px;
  color: #fff;
  opacity: 0.9;
}

.date-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #fff;
  padding: 0 12px;
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
  margin-bottom: 8px;
  padding: 0 12px;
}
.chart {
  width: 100%;
  box-sizing: border-box;
  padding: 0 8px;
}

.map-panel {
  padding: 0 !important;
  height: 100% !important;
}
.map-box {
  width: calc(100% - 20px) !important;
  height: calc(100% - 10px) !important;
  background: #08254a;
  border: 1px solid #00ffff;
  position: relative;
  overflow: hidden;
  margin: 5px auto !important;
}
.search-input {
  width: calc(100% - 20px);
  margin: 0 10px 12px 10px;
  background: #0b2a5a;
  color: #fff;
  border: 1px solid #00ffff;
  padding: 6px;
  box-sizing: border-box;
}
.device-table {
  width: calc(100% - 20px);
  margin: 0 10px;
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
.online {
  color: #00ff66;
  font-weight: bold;
}

/* 浏览器全屏模式样式 */
.screen-full {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
}
.screen-full {
  overflow: hidden !important;
}
.screen-full .content-screen {
  min-height: auto !important;
  height: calc(100% - 60px) !important;
  padding-bottom: 15px !important;
}

/* ========== 项目统计：绝对定位填满 ========== */
::v-deep .dv-border-box-1.panel {
  height: 100% !important;
  position: relative !important;
}
.panel-title {
  position: relative;
  z-index: 2;
}
.stat-grid {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 12px;
  padding: 8px 12px;
  align-items: center;
}

/* ========== 能耗图表：绝对定位自适应填满 ========== */
::v-deep .dv-border-box-1.panel.m-top {
  height: 100% !important;
  position: relative !important;
}
.m-top .panel-title,
.m-top .date-box,
.m-top .chart-title {
  position: relative;
  z-index: 2;
}
.m-top .chart {
  position: absolute;
  top: 130px;
  left: 0;
  right: 0;
  bottom: 0;
  height: auto !important;
}
/* 小屏（14寸及以下）项目统计修复：强制 flex 布局，保证全屏/窗口都充满 */
@media screen and (max-width: 1366px) {
  /* 穿透 dv-border-box-1 内部容器，强制纵向 flex */
  ::v-deep .dv-border-box-1.panel {
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
  }
  ::v-deep .dv-border-box-1 .border-box-content {
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
  }

  /* 标题固定高度，不压缩 */
  .panel-title {
    flex-shrink: 0 !important;
    font-size: 20px !important;
    margin-bottom: 8px !important;
  }

  /* 统计区域自动占满剩余高度，清除绝对定位 */
  .stat-grid {
    flex: 1 !important;
    position: static !important;
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 12px 8px !important;
    padding: 6px 8px !important;
    align-items: center !important;
  }

  /* 缩小统计数字/文字，适配小屏 */
  .stat-card .num {
    font-size: 26px !important;
  }
  .stat-card .unit {
    font-size: 14px !important;
    margin: 3px 0 !important;
  }
  .stat-card .label {
    font-size: 16px !important;
  }
}
/* 1. 给能耗面板单独设置最小高度，防止被过度压缩 */
.panel.m-top {
  min-height: 220px !important; /* 小屏时保证至少有足够高度显示图表 */
}

/* 2. 小屏时，强制图表容器高度自适应，清除绝对定位 */
@media screen and (max-width: 1366px) {
  .m-top .chart {
    position: static !important;
    flex: 1 !important;
    height: 120px !important; /* 小屏时固定图表高度，避免被挤压 */
    min-height: 120px !important;
  }
}

/* 3. 大屏保持原有绝对定位不变 */
@media screen and (min-width: 1367px) {
  .m-top .chart {
    position: absolute;
    top: 130px;
    left: 0;
    right: 0;
    bottom: 0;
    height: auto !important;
  }
}
</style>
