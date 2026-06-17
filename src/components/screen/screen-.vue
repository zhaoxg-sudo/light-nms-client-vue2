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
        <!-- ✅ 移除下发按钮 -->
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
          <div class="panel-title"> 设备分布 </div>
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
              <tr>
                <td>1</td>
                <td>样机</td>
                <!-- ✅ 绑定在线状态 -->
                <td :class="deviceOnline ? 'online' : 'offline'">
                  {{ deviceOnline ? '在线' : '离线' }}
                </td>
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
import { borderBox1 } from '@jiaminghi/data-view'
import * as echarts from 'echarts'

export default {
  name: 'Screen',
  components: {
    borderBox1
  },
  data () {
    return {
      nowTime: '',
      month: '2025-08',
      timer: null,
      map: null,
      marker: null,
      infoWindow: null,
      deviceOnline: false
    }
  },

  // ================================
  // 【1】组件一创建就绑定 GPS 监听（永远不掉）
  // ================================
  created () {
    // 判断 socket 是否存在
    if (this.$socket) {
      console.log('✅ socket 存在')
      // 监听 GPS 数据（核心！不会被路由销毁）
      this.$socket.on('gps', (data) => {
        console.log('🔥 收到 GPS 数据：', data)
        // 更新设备在线状态
        this.deviceOnline = true
        // 转换坐标
        const p = new window.AMap.LngLat(data.lng, data.lat)
        // ==========================================
        // 【修复】老式写法，不使用 ?. 兼容你的项目
        // ==========================================
        if (this.marker) {
          this.marker.setPosition(p)
        }
        if (this.map) {
          this.map.setCenter(p)
        }
      })
    } else {
      console.log('❌ socket 不存在')
    }

    this.$nextTick(() => {
      $('.orgTreeList').removeClass('treeListShow').addClass('treeListHide')
    })
  },

  mounted () {
    this.updateTime()
    this.timer = setInterval(() => this.updateTime(), 1000)
    this.initLineChart()
    this.initMap()
  },

  // 空钩子，不影响
  activated () {},

  beforeDestroy () {
    clearInterval(this.timer)
    if (this.map) {
      this.map.destroy()
    }
  },

  // ================================
  // 【2】清空自带监听（防止冲突）
  // ================================
  sockets: {},

  methods: {
    // ================================
    // 下面所有方法完全不动，保持你原来的
    // ================================
    getHeightsWidths () {
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
    },
    initMap () {
      setTimeout(() => {
        this.map = new window.AMap.Map('container', {
          zoom: 12,
          center: [116.397428, 39.90923],
          resizeEnable: true
        })
        const device = {
          name: '样机',
          status: '离线',
          power: '0.23 kW',
          energy: '90.68 kWh'
        }
        this.marker = new window.AMap.Marker({
          position: [116.397428, 39.90923]
        })
        this.map.add(this.marker)

        const infoContent = `
          <div style="background:#0b1229; border:1px solid #00ffff; padding:12px; color:#fff; border-radius:4px; min-width:190px; position:relative;">
          <div id="closeWin" style="position:absolute;top:4px;right:8px;cursor:pointer;color:#fff;font-size:18px;">×</div>
          <div style="font-size:16px; color:#00ffff; font-weight:bold; margin-bottom:8px;">${device.name}</div>
          <div style="margin:4px 0; font-size:14px;">状态：<span style="color:#ff2a2a;">${device.status}</span></div>
          <div style="margin:4px 0; font-size:14px;">总功率：${device.power}</div>
          <div style="margin:4px 0; font-size:14px;">累计能耗：${device.energy}</div>
        </div>
        `
        this.infoWindow = new window.AMap.InfoWindow({
          content: infoContent,
          offset: new window.AMap.Pixel(0, -30)
        })
        this.marker.on('click', () => {
          this.infoWindow.open(this.map, this.marker.getPosition())
        })
        this.map.on('click', () => {
          this.infoWindow.close()
        })
        this.infoWindow.on('open', () => {
          setTimeout(() => {
            document.getElementById('closeWin').onclick = () => {
              this.infoWindow.close()
            }
          }, 100)
        })
      }, 300)
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

/* 地图样式 */
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
  margin: 0 auto;
}

/* 右侧列表 */
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
</style>
