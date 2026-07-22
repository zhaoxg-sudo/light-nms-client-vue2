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

      <div class="top-title">LED智慧照明管理平台</div>

      <div class="top-right">
        <button class="btn" @click="refreshAll">刷新</button>
        <button class="btn" @click="toggleFullScreen($event)">{{ isFullScreen ? '恢复缩放' : '全屏' }}</button>
        <button class="btn" disabled>后台</button>
        <button class="btn" disabled>注销</button>
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

      <!-- 中间地图 -->
      <div class="center-box">
        <dv-border-box-1 class="panel map-panel">
          <div id="container" class="map-box">
            <!-- 【新增：右上角地图定位按钮，独立于工具栏，无权限限制】 -->
            <div style="position:absolute;top:12px;right:12px;z-index:1000;">
              <button class="map-locate-btn" @click="goDefaultCenter" title="定位到地图中心点">
                <img style="width:26px;height:22px;margin-right:4px;vertical-align:middle;"
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE4Ij48cGF0aCBkPSJNOCAxQzEyIDQgMTYgOSA4IDE3IDAgOSA0IDQgOCAxWiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSI4IiBjeT0iMTAiIHI9IjIiIGZpbGw9IiMwMDc2ZmYiLz48L3N2Zz4=">
              </button>
            </div>
            <!-- 地图点位工具栏 仅编辑权限用户显示 -->
            <div class="map-tool-bar" v-if="hasPointEditPerm">
              <button
                class="tool-btn"
                :class="{active: drawPointMode}"
                @click="toggleDrawMode"
              >
                {{ drawPointMode ? '关闭打点' : '开启点位配置' }}
              </button>
              <button class="tool-btn clear-btn" @click="clearAllManualPoint">清空点位</button>
              <button class="tool-btn save-btn" @click="saveAllPoints">批量保存点位</button>
              <button class="tool-btn" @click="locatePoint">定位点位</button>
              <!-- <button class="tool-btn" @click="goDefaultCenter">地图中心点</button> -->
              <!-- <div style="position:absolute;top:12px;right:12px;z-index:999;">
                <button
                  style="width:44px;height:44px;border:none;border-radius:6px;background:#fff;box-shadow:0 2px 8px #0003;cursor:pointer;padding:6px;"
                  @click="goDefaultCenter"
                  title="回到地图默认中心点"
                >
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ0IDQ4Ij48cGF0aCBkPSJNMjIgMiBDMzIgMTIgNDAgMjcgMjIgNDYgNCAyNyAxMiAxMiAyMiAyWiIgZmlsbD0iIzAwNzZmZiIvPjxjaXJjbGUgY3g9IjIyIiBjeT0iMjgiIHI9IjYiIGZpbGw9IndoaXRlIi8+PC9zdmc+"
                    style="width:100%;height:100%;object-fit:contain;"
                  />
                </button>
              </div> -->

              <!-- <button class="tool-btn" @click="destroyCenterMarker">清空中心点标记</button> -->
            </div>
            <!-- 手动点位列表悬浮面板 -->
            <div class="map-point-list" v-if="manualPointList.length > 0">
              <div class="list-title">已添加点位({{manualPointList.length}})</div>
              <div v-for="(item, idx) in manualPointList" :key="idx" class="point-item">
              <span
                @click="locatePointByIndex(idx)"
                style="cursor:pointer;"
                title="鼠标点击，定位该点位"
              >
                {{idx+1}} | {{item.name}} | {{item.type || '未分类'}} | {{item.id}} GCJ:{{item.lng}},{{item.lat}}
              </span>
              <button
                class="tool-btn"
                style="background-color:#0099ff; color:#fff; border:none; border-radius:3px;"
                @click="locatePointByIndex(idx)"
              >
              定位
              </button>
              <button
                class="tool-btn"
                style="background-color:#ff4444; color:#fff; border:none; border-radius:3px;"
                @click="removePoint(idx)"
              >
              删除
              </button>
             </div>
           </div>
          </div>
        </dv-border-box-1>
      </div>

      <div class="right-box">
        <dv-border-box-1 class="panel">
          <div class="panel-title">设备列表</div>
          <input
            type="text"
            class="search-input"
            placeholder="搜索名称/ID"
            v-model="deviceSearch"
          />
          <table class="device-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>点位名称</th>
                <th>点位ID</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in tableList"
                :key="item.id"
                @dblclick="handleDblClickRow(item.id)"
              >
                <td>{{ idx + 1 }}</td>
                <td>{{ item.name || "未命名" }}</td>
                <td>{{ item.id }}</td>
                <td :class="item.online ? 'online' : 'offline'">
                  {{ item.online ? "在线" : "离线" }}
                </td>
              </tr>
              <tr v-if="tableList.length === 0">
                <td colspan="4">暂无点位数据</td>
              </tr>
            </tbody>
          </table>
        </dv-border-box-1>
      </div>

    <DeviceControlPanel
      :visible.sync="showDevicePanel"
      :remoteId="remoteId"
    />

    <!-- 新增：添加点位弹窗（归属/名称/ID输入） -->
    <div class="point-mask" v-if="showPointDialog">
      <div class="point-dialog">
        <div class="dialog-header">新增点位</div>
        <div class="form-row">
          <label>归属区域：</label>
          <input v-model="tempPoint.belong" placeholder="请输入归属区域" />
        </div>
        <!-- 新增：点位类型 -->
        <div class="form-row">
          <label>点位类型：</label>
          <select v-model="tempPoint.type" class="point-type-select">
            <option value="">请选择点位类型</option>
            <option value="直流柜">直流柜</option>
            <option value="照度器">照度器</option>
            <option value="路灯">路灯</option>
          </select>
        </div>
        <div class="form-row">
          <label>点位名称：</label>
          <input v-model="tempPoint.name" placeholder="请输入点位名称" />
        </div>
        <div class="form-row">
          <label>点位ID：</label>
          <input v-model="tempPoint.id" placeholder="请输入唯一点位ID" />
        </div>
        <div class="dialog-btns">
          <button class="btn-cancel" @click="closePointDialog">取消</button>
          <button class="btn-confirm" @click="confirmAddPoint">确认添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { borderBox1 } from '@jiaminghi/data-view'
import * as echarts from 'echarts'
import DeviceControlPanel from './devicepanel.vue'
import { getHeight } from '@/utils/height.js'
import { mapGetters } from 'vuex'
import {GET_USER_INFO} from '@/store/getters/type'

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
      textLabel: null,
      deviceOnline: false,
      remoteId: '',
      lastGps: null,
      showDevicePanel: false,
      isFullScreen: false,
      manualPointList: [],
      manualMarkers: [],
      drawPointMode: false,
      // userPermissions: ['point:edit', 'device:read'],
      userPermissions: [],
      // 新增点位弹窗数据
      showPointDialog: false,
      tempPoint: {
        belong: '',
        type: '', // 新增
        name: '',
        id: '',
        lng: '',
        lat: '',
        wgsLng: '',
        wgsLat: ''
      },
      dbGreenMarkers: [], // 独立数组：数据库读取的绿色点位
      deviceSearch: '',
      centerMarker: null, // 地图中心点临时标记
      centerLabel: null, // 中心点文字标签
      defaultLng: 116.331644,
      defaultLat: 40.043262,
      loginusertype: '',
      instance: this.$ajax.create({
        baseURL: this.$appHost
      })
    }
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO
    }),
    hasPointEditPerm () {
      return this.userPermissions.includes('point:edit')
    },
    tableList () {
      const keyword = this.deviceSearch.trim().toLowerCase()
      // 直接从数据库点位数组映射表格数据
      return this.dbGreenMarkers.filter((row) => {
        const name = String(row.name || '').toLowerCase()
        const id = String(row.id || '').toLowerCase()
        if (!keyword) return true
        return name.includes(keyword) || id.includes(keyword)
      })
    }
  },

  created () {
    this.$nextTick(() => {
      $('.orgTreeList').removeClass('treeListShow').addClass('treeListHide')
      getHeight()
      this.getHeightsWidths()
    })
    this.loginusertype = this.get_user_info.user.usertype
    console.log('当前登录的用户类型', this.get_user_info.user.username, this.loginusertype)
    if (this.loginusertype <= 0) {
      this.userPermissions.push('point:edit')
    } else {
      this.userPermissions.push('device:read')
    }
    if (window.globalGpsSubscribed) {
      return
    }

    if (this.sockets) {
      this.sockets.subscribe('gps', (rawGpsData) => {
        console.log('🔥 实时收到原始GPS(WGS84) ===>', rawGpsData)
        window.latestGpsData = rawGpsData
        this.remoteId = rawGpsData.clientKey
        this.deviceOnline = true
        this.lastGps = rawGpsData

        const [gcjLng, gcjLat] = this.wgs84ToGcj02(rawGpsData.lng, rawGpsData.lat)
        console.log('✅ 转换后高德GCJ02坐标：', gcjLng, gcjLat)

        // 匹配数据库点位 更新在线状态与坐标
        const targetPoint = this.dbGreenMarkers.find(item => item.id === rawGpsData.cid)
        if (targetPoint) {
          console.log('🔥 实时收到原始GPS(WGS84),匹配到数据库点位', rawGpsData)
          targetPoint.online = true
          // ========= 新增：在线切换绿色图标 =========
          targetPoint.marker.setIcon(targetPoint.greenIcon)
          // 构建实时坐标对象
          const realTimePos = new window.AMap.LngLat(gcjLng, gcjLat)
          // 更新Marker实时位置（核心：跟随GPS移动）
          targetPoint.marker.setPosition(realTimePos)
          // 同步更新文字标签位置
          targetPoint.label.setPosition(realTimePos)
          // 同步更新点位存储的坐标，持久化最新位置
          targetPoint.gcjLng = gcjLng
          targetPoint.gcjLat = gcjLat
        }

        if (this.map && this.marker && this.textLabel) {
          const point = new window.AMap.LngLat(gcjLng, gcjLat)
          this.marker.setPosition(point)
          this.textLabel.setPosition(point)
          this.map.setCenter(point)
        }
      })

      window.globalGpsSubscribed = true
    }
  },

  mounted () {
    this.updateTime()
    this.timer = setInterval(() => this.updateTime(), 1000)
    this.initMap()

    window.__screenResizeHandler = () => {
      this.$nextTick(() => {
        this.getHeightsWidths()
      })
    }
    window.addEventListener('resize', window.__screenResizeHandler)

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.isFullScreen = false
        this.$nextTick(() => {
          const fullBtn = document.querySelector('.top-right .btn:nth-child(2)')
          if (fullBtn) fullBtn.blur()
        })
      }
    })

    if (window.latestGpsData) {
      const rawData = window.latestGpsData
      this.remoteId = rawData.clientKey
      this.deviceOnline = true
      const [gcjLng, gcjLat] = this.wgs84ToGcj02(rawData.lng, rawData.lat)
      const point = new window.AMap.LngLat(gcjLng, gcjLat)
      this.marker.setPosition(point)
      this.textLabel.setPosition(point)
    }
  },

  beforeRouteLeave (to, from, next) {
    next()
  },

  beforeDestroy () {
    clearInterval(this.timer)
    this.destroyCenterMarker() // 销毁中心点标记
    window.removeEventListener('resize', window.__screenResizeHandler)
    delete window.__screenResizeHandler
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    if (this.map) {
      this.map.destroy()
    }
    window.currentMapInstance = null
    window.currentMapMarker = null
    window.currentMapText = null
  },

  sockets: {},
  methods: {
    refreshAll () {
      window.location.reload()
    },
    wgs84ToGcj02 (wgsLon, wgsLat) {
      const PI = 3.1415926535897932384626
      const a = 6378245.0
      const ee = 0.00669342162296594323

      const outOfChina = (lon, lat) => {
        return lon < 72.004 || lon > 137.8347 || lat < 0.8293 || lat > 55.8271
      }
      if (outOfChina(wgsLon, wgsLat)) {
        return [wgsLon, wgsLat]
      }

      const transformLat = (x, y) => {
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
        ret += (160.0 * Math.sin(y / 12.0 * PI) + 320.0 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
        return ret
      }
      const transformLon = (x, y) => {
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
        ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0)) * 2.0 / 3.0
        return ret
      }

      let dLat = transformLat(wgsLon - 105.0, wgsLat - 35.0)
      let dLon = transformLon(wgsLon - 105.0, wgsLat - 35.0)
      const radLat = wgsLat / 180.0 * PI
      const magic = Math.sin(radLat)
      const magic2 = 1 - ee * magic * magic
      const sqrtMagic = Math.sqrt(magic2)
      dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic2 * sqrtMagic) * PI)
      dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
      const gcjLat = wgsLat + dLat
      const gcjLon = wgsLon + dLon
      return [gcjLon, gcjLat]
    },

    openDevicePanel () {
      if (!this.remoteId) {
        alert('未获取到远端ID')
        return
      }
      this.showDevicePanel = true
    },

    toggleFullScreen (e) {
      const targetDom = document.querySelector('.screen-page')
      if (!this.isFullScreen) {
        targetDom.requestFullscreen().catch(err => {
          console.warn('全屏开启失败', err)
        })
        this.isFullScreen = true
      } else {
        document.exitFullscreen()
        this.isFullScreen = false
      }
      e.target.blur()
    },

    toggleDrawMode () {
      this.drawPointMode = !this.drawPointMode
      if (this.drawPointMode) {
        alert('已开启点位配置，点击地图任意位置弹出录入窗口')
      }
    },

    clearAllManualPoint () {
      this.manualMarkers.forEach(item => {
        this.map.remove(item.marker)
        this.map.remove(item.label)
      })
      this.manualMarkers = []
      this.manualPointList = []
    },

    // 关闭点位弹窗，清空表单
    closePointDialog () {
      this.showPointDialog = false
      this.tempPoint = {
        belong: '',
        name: '',
        id: '',
        lng: '',
        lat: '',
        wgsLng: '',
        wgsLat: ''
      }
    },

    // 弹窗确认新增点位
    confirmAddPoint () {
      if (!this.tempPoint.belong || !this.tempPoint.name || !this.tempPoint.id) {
        alert('归属、点位名称、ID不能为空！')
        return
      }
      this.addManualMarker(this.tempPoint)
      this.closePointDialog()
    },

    async initMap () {
      try {
        const initLng = 116.331644
        const initLat = 40.043262
        this.map = new window.AMap.Map('container', {
          zoom: 12,
          center: [initLng, initLat],
          resizeEnable: true
        })

        // ========== 移除原固定单个DEMO marker代码，改为动态读取数据库点位 ==========
        // 绿色图标样式保持原样
        const deviceIcon = new window.AMap.Icon({
          size: new window.AMap.Size(48, 64),
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iNDQiIGhlaWdodD0iNjAiIHJ4PSI0IiBzdHJva2U9IiMwMGZmNjYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0iIzBiMTIyOSIvPgogIDxyZWN0IHg9IjgiIHk9IjEwIiB3aWR0aD0iMzIiIGhlaWdodD0iMTIiIGZpbGw9IiMwMGZmNjYiLz4KICA8cGF0aCBkPSJNMjYgMzAgTDIyIDM4IEwyOCAzOCBMMjQgNDgiIHN0cm9rZT0iIzAwZmY2NiIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cmVjdCB4PSItNiIgeT0iMTQiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjMDBmZjY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8cmVjdCB4PSItNiIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjMDBmZjY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+',
          imageSize: new window.AMap.Size(48, 64)
        })

        // ========== 新增：从数据库加载并渲染全部绿色点位 ==========
        await this.loadDbGreenPoints(deviceIcon)
        // 地图初始化默认中心点（项目初始坐标）
        const defaultLng = this.defaultLng
        const defaultLat = this.defaultLat
        this.createCenterMarker(defaultLng, defaultLat, '地图中心')

        // 地图单击打开弹窗录入点位信息（原有逻辑完全不变）
        this.map.on('click', (e) => {
          if (!this.drawPointMode) return
          const rawLng = e.lnglat.lng.toFixed(6)
          const rawLat = e.lnglat.lat.toFixed(6)
          const [wgsLng, wgsLat] = this.gcj02ToWgs84(rawLng, rawLat)
          // 填充坐标至临时表单
          this.tempPoint.lng = rawLng
          this.tempPoint.lat = rawLat
          this.tempPoint.wgsLng = wgsLng.toFixed(6)
          this.tempPoint.wgsLat = wgsLat.toFixed(6)
          this.showPointDialog = true
        })

        this.map.on('dblclick', (e) => {
          const lng = e.lnglat.lng
          const lat = e.lnglat.lat
          const [gcjL, gcjLa] = this.wgs84ToGcj02(lng, lat)
          console.log('双击点位GCJ02:', gcjL, gcjLa)
        })
      } catch (err) {
        console.warn('地图加载失败', err)
      }
    },

    // 新增方法：读取数据库点位渲染绿色marker
    async loadDbGreenPoints (greenIcon) {
      try {
        // ========= 新增：离线灰色图标定义 =========
        const grayIcon = new window.AMap.Icon({
          size: new window.AMap.Size(48, 64),
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iNDQiIGhlaWdodD0iNjAiIHJ4PSI0IiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0iIzFiMTIyOSIvPgogIDxyZWN0IHg9IjgiIHk9IjEwIiB3aWR0aD0iMzIiIGhlaWdodD0iMTIiIGZpbGw9IiM5OTk5OTkiLz4KICA8cGF0aCBkPSJNMjYgMzAgTDIyIDM4IEwyOCAzOCBMMjQgNDgiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cmVjdCB4PSItNiIgeT0iMTQiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8cmVjdCB4PSItNiIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+',
          imageSize: new window.AMap.Size(48, 64)
        })

        // 先清理旧数据库点位（需提前在data定义 dbGreenMarkers: []）
        this.dbGreenMarkers.forEach(item => {
          this.map.remove(item.marker)
          this.map.remove(item.label)
        })
        this.dbGreenMarkers = []

        // 请求后端读取 power_station_tree
        const res = await this.instance({'url': '/localall', 'method': 'get'})
        console.log('【screen】读取的数据库/localall:', res.data)
        const dbPoints0 = res.data || []
        // ✅ 筛选 stationtype = '1' 的点位
        const dbPoints = dbPoints0.filter(row => row.stationtype === '1')
        console.log('【screen】显示的地图点位:', dbPoints)
        dbPoints.forEach(row => {
          let gcjLng = row.gcjlng
          let gcjLat = row.gcjlat
          let gpsLng
          let gpsLat
          if (!gcjLng || !gcjLat) {
            gpsLng = Number(row.gpslng)
            gpsLat = Number(row.gpslat)
            if (!gpsLng || !gpsLat) return
            const [gcjL, gcjLa] = this.wgs84ToGcj02(gpsLng, gpsLat)
            gcjLng = gcjL
            gcjLat = gcjLa
            console.log('【screen】配置了GPS,无高德点位数据:', gcjLng, gcjLat)
          }
          const pos = [parseFloat(gcjLng), parseFloat(gcjLat)]

          // 创建Marker
          const marker = new window.AMap.Marker({
            position: pos,
            icon: grayIcon
          })
          // 创建文字标签
          const textLabel = new window.AMap.Text({
            position: pos,
            text: row.label || '点位',
            offset: new window.AMap.Pixel(16, -45),
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
          // 弹窗信息
          const mainInfoWin = new window.AMap.InfoWindow({
            content: `
              <div style="color:#fff;background:rgba(0,20,40,0.9);padding:8px 10px;border:1px solid #00ffff;border-radius:4px;font-size:13px;line-height:1.6;">
                <div>ID：${row.catalogid}</div>
                <div>名称：${row.label || ''}</div>
                <div>类型：${row.protocoltype || ''}</div>
                <div>GCJ经纬度：${gcjLng},${gcjLat}</div>
                <div>WGS经纬度：${row.gpslng || ''},${row.gpslat || ''}</div>
              </div>
            `,
            offset: new window.AMap.Pixel(0, -55),
            anchor: 'bottom-center',
            isCustom: true
          })

          this.map.add(marker)
          this.map.add(textLabel)
          // this.dbGreenMarkers.push({ marker, label: textLabel })
          // 存入数组，提供给右侧表格使用
          this.dbGreenMarkers.push({
            id: row.catalogid,
            name: row.label,
            gcjLng,
            gcjLat,
            marker,
            label: textLabel,
            mainInfoWin,
            online: false, // 默认离线，GPS收到数据更新为true
            greenIcon,
            grayIcon
          })
          marker.on('mouseover', () => {
            mainInfoWin.open(this.map, marker.getPosition())
          })
          marker.on('mouseout', () => {
            mainInfoWin.close()
          })
          marker.on('dblclick', () => {
            const target = this.dbGreenMarkers.find(item => item.id === row.catalogid)
            if (!target || !target.online) {
              alert('设备离线，无法打开面板')
              return
            }
            this.remoteId = row.catalogid
            this.openDevicePanel()
          })
        })
      } catch (err) {
        console.error('读取数据库点位异常', err)
      }
    },
    addManualMarker (pointInfo) {
      // 转为纯数字坐标
      const lng = parseFloat(pointInfo.lng)
      const lat = parseFloat(pointInfo.lat)

      // 橙色标记（SVG base64无外网依赖）
      const orangeDeviceIcon = new window.AMap.Icon({
        size: new window.AMap.Size(48, 64),
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iNDQiIGhlaWdodD0iNjAiIHJ4PSI0IiBzdHJva2U9IiNmNzgwMDAiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0iIzIwMDgwMCIvPgogIDxyZWN0IHg9IjgiIHk9IjEwIiB3aWR0aD0iMzIiIGhlaWdodD0iMTIiIGZpbGw9IiNmNzgwMDAiLz4KICA8cGF0aCBkPSJNMjYgMzAgTDIyIDM4IEwyOCAzOCBMMjQgNDgiIHN0cm9rZT0iI2Y3ODAwMCIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cmVjdCB4PSItNiIgeT0iMTQiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjZjc4MDAwIiBzdHJva2UtZGFzaGFwPSIyIiBmaWxsPSJub25lIi8+CiAgPHJlY3QgeD0iLTYiIHk9IjM4IiB3aWR0aD0iOCIgaGVpZ2h0PSIxNiIgcng9IjIiIHN0cm9rZT0iI2Y3ODAwMCIgc3Ryb2tlLWRhc2hhcD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=',
        imageSize: new window.AMap.Size(48, 64)
      })

      // this.marker = new window.AMap.Marker({
      //   position: [initLng, initLat],
      //   icon: orangeDeviceIcon
      // })
      const marker = new window.AMap.Marker({
        position: [lng, lat],
        icon: orangeDeviceIcon
      })
      // ====== 点位左上角文字标签======
      const pointTextLabel = new window.AMap.Text({
        position: [lng, lat],
        text: pointInfo.name,
        offset: new window.AMap.Pixel(-3, -45),
        style: {
          color: '#ff7800',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '0 0 3px #000',
          whiteSpace: 'nowrap'
        }
      })
      // 悬浮信息窗口
      const hoverInfoWin = new window.AMap.InfoWindow({
        content: `
          <div style="color:#fff;background:rgba(0,20,40,0.9);padding:8px 10px;border:1px solid #00ffff;border-radius:4px;font-size:13px;line-height:1.6;">
            <div>ID：${pointInfo.id}</div>
            <div>名称：${pointInfo.name}</div>
            <div>类型：${pointInfo.type || '未分类'}</div>
            <div>归属：${pointInfo.belong}</div>
            <div>GCJ经纬度：${lng},${lat}</div>
            <div>WGS经纬度：${pointInfo.wgsLng},${pointInfo.wgsLat}</div>
          </div>
        `,
        offset: new window.AMap.Pixel(0, -35)
      })
      marker.on('mouseover', () => {
        hoverInfoWin.open(this.map, marker.getPosition())
      })
      marker.on('mouseout', () => {
        hoverInfoWin.close()
      })
      // 单击橙色图标
      marker.on('click', () => {
        const clickInfoWin = new window.AMap.InfoWindow({
          content: `
            <div style="color:#fff;background:rgba(0,20,40,0.9);padding:10px;border:1px solid #ff7800;border-radius:4px;font-size:13px;line-height:1.7;">
              归属：${pointInfo.belong}<br/>
              名称：${pointInfo.name}<br/>
              ID：${pointInfo.id}<br/>
              GCJ：${lng},${lat}<br/>
              WGS：${pointInfo.wgsLng},${pointInfo.wgsLat}
            </div>
          `,
          offset: new window.AMap.Pixel(0, -40),
          isCustom: true // 关键：关闭高德原生白色外壳
        })
        clickInfoWin.open(this.map, marker.getPosition())
      })

      // ✅ 存入数组（确保this指向正确Vue实例）
      this.map.add(marker)
      this.map.add(pointTextLabel)
      this.manualMarkers.push({marker, label: pointTextLabel})
      this.manualPointList.push({
        ...pointInfo,
        lng: lng,
        lat: lat
      })

      // ✅ 自动定位到新点位
      this.map.setZoomAndCenter(15, [lng, lat])
      console.log('✅ 点位添加成功', this.manualPointList, this.manualMarkers)
    },

    removePoint (index) {
      const item = this.manualMarkers[index]
      this.map.remove(item.marker)
      this.map.remove(item.label)
      this.manualMarkers.splice(index, 1)
      this.manualPointList.splice(index, 1)
    },

    saveAllPoints () {
      console.log('待保存点位集合', this.manualPointList)
      alert(`共${this.manualPointList.length}个点位，数据已打印控制台`)
      // 地图点位，写入数据库
      // axios.post('/api/savePoint', { list: this.manualPointList })
      // insert into DB
      if (this.manualPointList.length > 0) {
        // 循环遍历：拆成单条点位
        for (const point of this.manualPointList) {
          // 单条数据结构，匹配pg字段
          let parentid = '11'
          const singlePoint = {
            catalogid: point.id,
            parentid: parentid,
            label: point.name,
            stationtype: 1,
            commtype: '',
            protocoltype: point.type,
            positioninfo: '',
            addinfo: '',
            ipaddress: '',
            ipport: '',
            childrennum: '',
            gpslng: point.wgsLng, // WGS原始经度
            gpslat: point.wgsLat, // WGS原始纬度
            gcjlng: point.lng, // GCJ高德经度
            gcjlat: point.lat // GCJ高德纬度
          }
          // 提交单条接口
          this.saveAllPointsToDB(singlePoint)
        }
      }
    },
    saveAllPointsToDB (e) {
      this.instance({
        url: '/tree/addnode',
        method: 'post',
        data: e
      }).then(res => {
        if (res.data.code === 1) {
          // add children node
          console.log('数据库添加树节点成功', res.data.result)
          this.$message.success('添加树节点成功')
          // 清除this.manualPointList
        } else {
          console.log('数据库添加树节点失败', res.data.result)
          this.$message.success('添加树节点失败')
        }
      })
    },
    // 根据索引定位点位
    locatePointByIndex (idx) {
      const point = this.manualPointList[idx]
      const lng = parseFloat(point.lng)
      const lat = parseFloat(point.lat)
      this.map.setZoomAndCenter(16, [lng, lat]) // zoom可按需调整
    },
    locatePoint () {
      if (this.manualPointList.length === 0) return
      const firstPoint = this.manualPointList[0]
      this.map.setCenter([firstPoint.lng, firstPoint.lat])
      this.map.setZoom(14)
    },
    // 双击表格行定位地图
    handleDblClickRow (deviceId) {
      const target = this.dbGreenMarkers.find((d) => d.id === deviceId)
      if (!target) return alert('未找到该点位')
      console.log('[screen]双击的点位信息', target)
      const lng = Number(target.gcjLng)
      const lat = Number(target.gcjLat)
      console.log('[screen]双击的点位信息lng=,lat=', lng, lat)
      if (isNaN(lng) || isNaN(lat)) {
        return alert('坐标无效')
      }
      this.map.setZoomAndCenter(16, [lng, lat])
      this.remoteId = deviceId
    },
    gcj02ToWgs84 (gcjLon, gcjLat) {
      const PI = 3.1415926535897932384626
      const a = 6378245.0
      const ee = 0.00669342162296594323
      const outOfChina = (lon, lat) => {
        return lon < 72.004 || lon > 137.8347 || lat < 0.8293 || lat > 55.8271
      }
      if (outOfChina(gcjLon, gcjLat)) return [gcjLon, gcjLat]
      const transformLat = (x, y) => {
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
        ret += (160.0 * Math.sin(y / 12.0 * PI) + 320.0 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
        return ret
      }
      const transformLon = (x, y) => {
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
        ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0)) * 2.0 / 3.0
        return ret
      }
      let dLat = transformLat(gcjLon - 105.0, gcjLat - 35.0)
      let dLon = transformLon(gcjLon - 105.0, gcjLat - 35.0)
      const radLat = gcjLat / 180.0 * PI
      const magic = Math.sin(radLat)
      const magic2 = 1 - ee * magic * magic
      const sqrtMagic = Math.sqrt(magic2)
      dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic2 * sqrtMagic) * PI)
      dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
      const wgsLat = gcjLat - dLat
      const wgsLon = gcjLon - dLon
      return [wgsLon, wgsLat]
    },
    goDefaultCenter () {
      const lng = this.defaultLng
      const lat = this.defaultLat
      this.map.setZoomAndCenter(12, [lng, lat])
      this.createCenterMarker(lng, lat, '地图中心')
    },

    // 创建地图中心点临时标记
    createCenterMarker (lng, lat, name) {
      this.destroyCenterMarker()
      const pos = new window.AMap.LngLat(lng, lat)
      // 水滴中心点图标
      const dropIcon = new window.AMap.Icon({
        size: new window.AMap.Size(44, 48),
        image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ0IDQ4Ij48cGF0aCBkPSJNMjIgMiBDMzIgMTIgNDAgMjcgMjIgNDYgNCAyNyAxMiAxMiAyMiAyWiIgZmlsbD0iIzAwNzZmZiIvPjxjaXJjbGUgY3g9IjIyIiBjeT0iMjgiIHI9IjYiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
        imageSize: new window.AMap.Size(44, 48)
      })

      this.centerMarker = new window.AMap.Marker({
        position: pos,
        icon: dropIcon,
        zIndex: 999,
        title: '地图中心点' // ✅ 鼠标悬浮内置tooltip
      })
      // this.centerLabel = new window.AMap.Text({
      //   position: pos,
      //   text: name,
      //   offset: new window.AMap.Pixel(0, -60),
      //   style: {
      //     color: '#ffffff', // 纯白色文字，对比度拉满
      //     fontSize: '16px', // 字号放大2px
      //     fontWeight: 'bold', // 加粗更清晰
      //     background: 'rgba(0,0,0,0.85)', // 加深黑色背景，遮挡地图底色
      //     padding: '3px 8px', // 增加内边距，文字不贴边框
      //     borderRadius: '4px',
      //     whiteSpace: 'nowrap',
      //     textShadow: '0 0 4px #000' // 文字描边防融合
      //   }
      // })
      this.centerLabel = null
      this.map.add(this.centerMarker)
      // this.map.add(this.centerLabel)
    },

    // 销毁中心点标记
    destroyCenterMarker () {
      if (this.centerMarker) {
        this.map.remove(this.centerMarker)
        this.centerMarker = null
      }
      if (this.centerLabel) {
        this.map.remove(this.centerLabel)
        this.centerLabel = null
      }
    },

    // 定位到中心点（按钮调用）
    locateCenterMarker () {
      if (!this.centerMarker) {
        alert('暂无实时定位标记')
        return
      }
      const pos = this.centerMarker.getPosition()
      this.map.setZoomAndCenter(16, [pos.lng, pos.lat])
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
          data: Array.from({ length: 20 }, (i) => (i + 1).toString())
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
            data: [2.5, 2.5, 2.5, 2.5, 2.5, 2.4, 2.2, 2.0, 1.8, 1.5, 1.2, 1.0, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.2]
          }
        ]
      })
    }
  }
}
</script>
<style scoped>
/* 【原版基础布局，和改点位之前保持一致，不改动】 */
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
  min-height: 200px; /* 保底高度防止塌陷 */
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

.screen-full {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
  overflow: hidden !important;
}
.screen-full .content-screen {
  height: calc(100% - 60px) !important;
  padding-bottom: 15px !important;
}

/* ====== 仅追加点位相关样式（不改动原有左侧布局！）====== */
.map-tool-bar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  display: flex;
  gap: 8px;
}
.tool-btn {
  background: #0a78ff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
}
.tool-btn.active {
  background: #ff7800;
}
.clear-btn {
  background: #666;
}
.save-btn {
  background: #00c48c;
}

.map-point-list {
  position: absolute;
  top: 60px;
  left: 10px;
  background: rgba(0,0,0,0.75);
  padding: 10px;
  border: 1px solid #ff7800;
  border-radius: 4px;
  z-index: 998;
  min-width: 220px;
}
.list-title {
  color: #ff7800;
  font-weight: bold;
  margin-bottom: 8px;
}
.point-item {
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 12px;
  padding: 3px 0;
}
.point-item button {
  background: #f33;
  border: none;
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
}

.point-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.point-dialog {
  width: 440px;
  background: #0b1229;
  border: 1px solid #00ffff;
  padding: 24px;
  border-radius: 6px;
}
.dialog-header {
  font-size: 20px;
  color: #00ffff;
  text-align: center;
  margin-bottom: 20px;
}
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.form-row label {
  width: 95px;
  color: #fff;
}
.form-row input {
  flex: 1;
  height: 36px;
  background: #0b2a5a;
  border: 1px solid #00ffff;
  color: #fff;
  padding: 0 10px;
}
.dialog-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
.btn-cancel {
  padding: 6px 16px;
  background: #555;
  border: none;
  color: #fff;
}
.btn-confirm {
  padding: 6px 16px;
  background: #00c48c;
  border: none;
  color: #000;
}
/*type-select*/
.point-type-select {
  flex: 1;
  height: 36px;
  background: #0b2a5a; /* 蓝底，和整体一致 */
  border: 1px solid #00ffff;
  color: #fff;
  padding: 0 10px;
  font-size: 16px;
  box-sizing: border-box;
  /* 可选自定义下拉箭头 */
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='cyan' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
}
/* 地图中心点 */
.map-locate-btn {
  height: 34px;
  padding: 0 10px;
  border: none;
  border-radius: 4px;
  background: #0a78ff;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  display:inline-flex;
  align-items:center;
}
.map-locate-btn:hover {
  background: #0866dd;
}
</style>
