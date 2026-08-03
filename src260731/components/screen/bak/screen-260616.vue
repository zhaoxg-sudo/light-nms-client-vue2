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

      <!-- 中间地图 → 已替换为高德 -->
      <div class="center-box">
        <dv-border-box-1 class="panel map-panel">
          <!-- <div class="panel-title"> 设备分布 </div> -->
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
              <!-- ✅ 双击这一行弹出控制面板 -->
              <tr @dblclick="openDevicePanel">
                <td>1</td>
                <td>样机</td>
                <td :class="deviceOnline ? 'online' : 'offline'">
                  {{ deviceOnline ? '在线' : '离线' }}
                </td>
              </tr>
            </tbody>
          </table>
        </dv-border-box-1>
      </div>
    </div>

    <!-- ✅ 设备控制面板弹窗（嵌入在这里） -->
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
      showDevicePanel: false // ✅ 弹窗控制
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
        this.deviceOnline = true // ✅ 自动同步在线状态

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
    if (this.map) {
      this.map.destroy()
    }
    window.currentMapInstance = null
    window.currentMapMarker = null
  },

  sockets: {},
  methods: {
    // ✅ 打开设备面板
    openDevicePanel () {
      if (!this.remoteId) {
        alert('未获取到远端ID')
        return
      }
      this.showDevicePanel = true
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

      // ✅ 双击地图标记也弹出面板
      this.marker.on('dblclick', () => {
        this.openDevicePanel()
      })

      // 你原有地图双击下发逻辑 完全不动
      this.map.on('dblclick', (e) => {
        const lng = e.lnglat.lng
        const lat = e.lnglat.lat
        console.log('🖱️ 双击点位：', lng, lat)
      })
    },

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
        $('.screen-page').width(contentWidth - treeWidth - 10)
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
.screen-page {
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
  display: flex !important;
  flex-wrap: nowrap !important;
  padding: 15px 15px 15px 20px;
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
}
.right-box {
  width: 19%;
  flex-shrink: 0;
}

.panel {
  width: 100%;
  padding: 0;
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
  padding: 10px 15px;
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
  padding: 0 15px;
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
  padding: 0 15px;
}
.chart {
  width: 100%;
  height: 180px;
  box-sizing: border-box;
  padding: 0 10px;
}

/* 地图面板：彻底消除顶部/底部留白 */
.map-panel {
  padding: 0 !important;
  height: 100% !important;
}

/* 地图容器：占满整个面板，消除底部空白 */
.map-box {
  width: calc(100% - 20px) !important;
  /* 关键：高度 = 面板100% - 边框内边距 */
  height: calc(100% - 10px) !important;
  background: #08254a;
  border: 1px solid #00ffff;
  position: relative;
  overflow: hidden;
  margin: 5px auto !important; /* 上下5px，避免贴死边框 */
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
/* 14寸笔记本适配：修复左侧面板下压变形 */
@media screen and (max-height: 800px) {
  /* 左侧容器：减少上下间距，让高度更紧凑 */
  .left-box {
    gap: 8px !important;
  }
  .panel {
    padding: 5px !important;
  }
  .m-top {
    margin-top: 8px !important;
  }

  /* 项目统计：缩小字号，避免挤压换行 */
  .stat-card .num {
    font-size: 28px !important;
  }
  .stat-card .unit {
    font-size: 16px !important;
  }
  .stat-card .label {
    font-size: 18px !important;
  }
  .panel-title {
    font-size: 22px !important;
    margin-bottom: 10px !important;
  }

  /* 能耗图表：缩小高度，避免挤压 */
  .chart {
    height: 140px !important;
  }
  .chart-title {
    font-size: 16px !important;
  }
}
@media screen and (max-height: 768px) {
  .stat-grid {
    gap: 15px 8px !important;
  }
}
</style>
