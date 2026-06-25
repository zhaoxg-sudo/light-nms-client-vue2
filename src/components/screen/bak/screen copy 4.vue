
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
          <div ref="chartLine" class="chart" style="height: 200px;"></div>
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
      this.map = await new window.AMap.Map('container', {
        zoom: 12,
        center: [116.325412, 40.042296],
        resizeEnable: true
      })

      this.marker = await new window.AMap.Marker({
        position: [116.325412, 40.042296]
      })
      await this.map.add(this.marker)
      window.currentMapInstance = this.map
      window.currentMapMarker = this.marker

      this.marker.on('dblclick', () => {
        this.openDevicePanel()
      })

      this.map.on('dblclick', (e) => {
        const lng = e.lnglat.lng
        const lat = e.lnglat.lat
        console.log('🖱️ 双击点位：', lng, lat)
      })
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
  overflow-x: hidden !important; /* 彻底禁止横向溢出，消除右侧宽度溢出 */
  display: flex!important;
  flex-direction: column;
  box-sizing: border-box !important; /* 容器padding不撑宽高 */
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
  /* 修改padding：底部统一15px，不再多出40px */
  padding: 10px;
  gap: 14px;
  /* 删除强制min-height，由flex自适应高度，解决底部溢出 */
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
  height: 180px;
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

/* 窗口高度≥780px（14寸及以上屏幕）：页面铺满无滚动 */
@media screen and (min-height: 780px) {
  .screen-page {
    overflow: hidden !important;
  }
  .content-screen {
    min-height: auto !important;
    height: calc(100% - 60px) !important;
    padding-bottom: 15px !important;
  }
}

/* 窗口高度＜780px（小于14寸/非全屏小窗口）：压缩布局，滚动交给body原生 */
@media screen and (max-height: 779px) {
  .left-box {
    gap: 8px !important;
  }
  .m-top {
    margin-top: 8px !important;
  }
  .stat-grid {
    gap: 12px 8px !important;
    padding: 6px 8px !important;
  }
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
  .panel-title {
    font-size: 20px !important;
    margin-bottom: 8px !important;
  }
  .chart-title {
    font-size: 15px !important;
    margin-bottom: 6px !important;
  }
  .chart {
    height: 130px !important;
  }
  .date-box {
    margin-bottom: 6px !important;
  }
}
/* 极低高度超薄本极限压缩 */
@media screen and (max-height: 700px) {
  .stat-card .num {
    font-size: 22px !important;
  }
  .chart {
    height: 110px !important;
  }
}

/* 浏览器全屏模式样式，覆盖后台侧边菜单 */
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
</style>
