<template>
  <div class="screen-page" :class="{ 'screen-full': isFullScreen }">
    <!-- 顶部导航 -->
    <div class="top-bar">
      <div class="top-left">
        <!-- <span>项目</span>
        <select class="select">
          <option>三合云海</option>
        </select>
        <span>设备</span>
        <select class="select">
          <option>DEMO</option>
        </select> -->
      </div>

      <div class="top-title">LED智慧照明管理平台</div>

      <div class="top-right">
        <button class="btn" @click="refreshAll">刷新</button>
        <button class="btn" @click="toggleFullScreen($event)">{{ isFullScreen ? '恢复缩放' : '大屏' }}</button>
        <!-- 新增地图独占按钮 -->
        <button class="btn" :style="{background: onlyMapMode ? '#00c48c' : '#00ffff'}" @click="switchOnlyMap">
          {{ onlyMapMode ? '退出地图' : '全屏地图' }}
        </button>
        <!-- <button class="btn" disabled>后台</button>
        <button class="btn" disabled>注销</button> -->
        <!-- <div class="time">{{ nowTime }}</div> -->
      </div>
    </div>

    <!-- 内容区 -->
    <div class="content-screen">
      <!-- 左侧 -->
      <div class="left-box" v-show="!onlyMapMode">
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
          <div id="container" class="map-box" @click="closeSearchDropdown">
            <!-- ========== 新增：地图顶部居中搜索框 ========== -->
            <div class="map-search-wrap">
              <el-input
                v-model="searchKey"
                placeholder="搜索设备ID/名称 | 地址地点"
                clearable
                prefix-icon="el-icon-search"
                @input="handleSearch"
                @focus="onSearchFocus"
                @blur="hideDropdownTimer"
                @mousedown.prevent
              ></el-input>
              <!-- 下拉结果面板 -->
              <div v-if="showDropdown && totalResult.length" class="search-dropdown-panel">
                <!-- 匹配到的设备分组 -->
                <div v-if="matchDeviceList.length" class="dropdown-group-title">设备点位</div>
                <div
                  v-for="dev in matchDeviceList"
                  :key="dev.id"
                  class="dropdown-item device-item"
                  @click="selectDeviceItem(dev)"
                >
                  <div class="item-name">{{ dev.name || '未命名点位' }}</div>
                  <!-- <div class="item-desc">ID：{{ dev.id }}｜{{ dev.online ? '在线' : '离线' }}</div> -->
                  <div class="item-desc">
                    ID：{{ dev.id }}｜
                    <span :style="{color: dev.online ? '#39ff5e' : '#ff4444'}">
                      {{ dev.online ? '在线' : '离线' }}
                    </span>
                  </div>
                </div>

                <!-- 高德地址搜索分组 -->
                <div v-if="matchPoiList.length" class="dropdown-group-title">地理位置</div>
                <div
                  v-for="poi in matchPoiList"
                  :key="poi.id"
                  class="dropdown-item poi-item"
                  @click="selectPoiItem(poi)"
                >
                  <div class="item-name">{{ poi.name }}</div>
                  <div class="item-desc">{{ poi.district }}{{ poi.address }}</div>
                </div>
              </div>
            </div>
            <!-- ============================================== -->
           <!-- 1、上方：地图中心点 -->
          <div style="position:absolute;top:60px;right:14px;z-index:1002;">
            <button class="map-top-btn" @click="goDefaultCenter" title="定位到地图中心点">
              <!-- 统一宽高20*20，画布尺寸一致 -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style="margin-right:5px;vertical-align:middle;flex-shrink:0;">
                <path d="M12 2C8 2 5 6 5 12c0 4 4 9 7 11 3-2 7-7 7-11 0-6-3-10-7-10zm0 14a3 3 0 110-6 3 3 0 010 6z"/>
              </svg>
              地图中心
            </button>
          </div>

          <!-- 2、下方：总控面板灯泡 -->
          <div style="position:absolute;top:98px;right:14px;z-index:1002;">
            <button v-if="checkBtn('mainpanel')" class="map-top-btn" @click="showMainPanel = true" title="打开照明总控面板">
              <!-- 和上方完全一致：20*20、相同viewBox、样式属性 -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style="margin-right:5px;vertical-align:middle;flex-shrink:0;">
                <path d="M12 2a6 6 0 00-6 6c0 2.3 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74a6 6 0 00-6-6zm0 12a5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5 5 5 0 01-5 5zm-1 4h2v2h-2v-2zm0 3h2v1h-2v-1z"/>
              </svg>
              总控面板
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

      <div class="right-box" v-show="!onlyMapMode">
        <dv-border-box-1 class="panel">
          <div class="panel-title">设备列表</div>
          <el-input
            type="text"
            class="search-input"
            placeholder="搜索名称/ID"
            v-model="deviceSearch"
            clearable
            prefix-icon="el-icon-search"
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
                @click="handleClickRow(item.id)"
                @dblclick="openDevicePanel(item.id)"
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
    <!-- 总控面板组件，与设备面板写法统一 -->
    <MainControlPanel :visible="showMainPanel" @close="showMainPanel = false"/>
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
  <!-- 全局提示弹窗 替代this.showTip -->
  <div class="tip-mask" v-if="showTipModal" @click="showTipModal = false">
    <div class="tip-box">
      <p>{{ tipText }}</p>
      <button class="tip-btn">确定</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { borderBox1 } from '@jiaminghi/data-view'
import * as echarts from 'echarts'
import DeviceControlPanel from './devicepanel.vue'
import MainControlPanel from './mainControlPanel.vue'
import { getHeight } from '@/utils/height.js'
import { mapGetters } from 'vuex'
import {GET_USER_INFO} from '@/store/getters/type'

export default {
  name: 'Screen',
  components: {
    borderBox1,
    DeviceControlPanel,
    MainControlPanel
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
      showMainPanel: false,
      isFullScreen: false,
      manualPointList: [],
      manualMarkers: [],
      drawPointMode: false,
      userPermissions: [],
      showPointDialog: false,
      tempPoint: {
        belong: '',
        type: '',
        name: '',
        id: '',
        lng: '',
        lat: '',
        wgsLng: '',
        wgsLat: ''
      },
      dbGreenMarkers: [],
      deviceSearch: '',
      centerMarker: null,
      centerLabel: null,
      defaultLng: 116.331644,
      defaultLat: 40.043262,
      loginusertype: '',
      showTipModal: false,
      tipText: '',
      onlyMapMode: false,
      searchKey: '',
      showDropdown: false,
      placeSearch: null,
      matchDeviceList: [],
      matchPoiList: [],
      totalResult: [],
      dropdownTimer: null,
      instance: null,

      // 保存地图事件句柄，用于解绑
      mapClickMap: null,
      mapDblClickMap: null,
      // 存储所有marker事件回调，销毁时解绑
      markerEventList: [],
      // 地图工具栏实例
      toolBar: null,
      globalHoverTimer: null, // 提升为实例属性，替代局部变量
      infoWinOpenTimers: [], // 追踪 infoWindow open 中的 setTimeout
      manualClickInfoWins: [], // 追踪手动点位的 click InfoWindow
      treeDataTimer: null, // watch TreeData 中的 setTimeout
      activateTimer: null, // activated 中的 setTimeout
      switchMapTimer: null // switchOnlyMap 中的 setTimeout
    }
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO,
      TreeData: 'TreeData',
      updatePoint: 'updatePoint',
      btnList: 'getBtnList'
    }),
    hasPointEditPerm () {
      return this.userPermissions.includes('point:edit')
    },
    tableList () {
      const keyword = this.deviceSearch.trim().toLowerCase()
      return this.dbGreenMarkers.filter((row) => {
        const name = String(row.name || '').toLowerCase()
        const id = String(row.id || '').toLowerCase()
        if (!keyword) return true
        return name.includes(keyword) || id.includes(keyword)
      })
    }
  },
  watch: {
    'TreeData': {
      handler: async function (data) {
        console.log('[screen] has watched tree data id, label :=', data.catalogid, data.label)
        this.$nextTick(async function () {
          if (data.stationtype === '1') {
            // ✅ 修复
            if (this.treeDataTimer) clearTimeout(this.treeDataTimer)
            this.treeDataTimer = setTimeout(() => {
              this.handleClickRow(data.catalogid)
            }, 150)
          }
        })
      },
      deep: true
    },
    'updatePoint': {
      handler: async function (data) {
        console.log('[screen] store->updatePoint :=', data)
        if (!data || !data.cid) return
        this.updateMapPointByID(data)
      }
    }
  },
  created () {
    this.instance = this.$ajax.create({
      baseURL: this.$appHost
    })
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

    document.addEventListener('fullscreenchange', this.__fullscreenHandler = () => {
      if (!document.fullscreenElement) {
        this.isFullScreen = false
        this.$nextTick(() => {
          const fullBtn = document.querySelector('.top-right .btn:nth-child(2)')
          if (fullBtn) fullBtn.blur()
        })
      }
    })
  },

  // ========= 统一清理地图覆盖物+解绑marker事件 =========
  // destroyAllMapOverlay () {
  //   // 1、销毁数据库点位 marker / label / infoWindow
  //   this.dbGreenMarkers.forEach(item => {
  //     // 移除事件
  //     if (item.marker) {
  //       item.marker.off('mouseover')
  //       item.marker.off('mouseout')
  //       item.marker.off('dblclick')
  //       if (this.map) this.map.remove(item.marker)
  //     }
  //     if (item.label && this.map) this.map.remove(item.label)
  //     if (item.mainInfoWin) {
  //       item.mainInfoWin.close()
  //       item.mainInfoWin.off('open')
  //     }
  //     item.marker = null
  //     item.label = null
  //     item.mainInfoWin = null
  //   })
  //   this.dbGreenMarkers = []

  //   // 2、销毁手动添加橙色点位
  //   this.manualMarkers.forEach(item => {
  //     if (item.marker) {
  //       item.marker.off('mouseover')
  //       item.marker.off('mouseout')
  //       item.marker.off('click')
  //       if (this.map) this.map.remove(item.marker)
  //     }
  //     if (item.label && this.map) this.map.remove(item.label)
  //     item.marker = null
  //     item.label = null
  //   })
  //   this.manualMarkers = []
  //   this.manualPointList = []

  //   // 3、中心点标记
  //   this.destroyCenterMarker()
  //   this.markerEventList = []
  // },

  beforeRouteLeave (to, from, next) {
    next()
  },

  beforeDestroy () {
    this.clearAllTimer()
    this.destroyMapInstance()
    // 销毁 ECharts
    if (this.$refs.chartLine) {
      const chart = echarts.getInstanceByDom(this.$refs.chartLine)
      if (chart) chart.dispose()
    }
    // 清除 resize、全屏事件
    window.removeEventListener('resize', window.__screenResizeHandler)
    delete window.__screenResizeHandler
    document.removeEventListener('fullscreenchange', this.__fullscreenHandler)
    this.__fullscreenHandler = null
    // 清空axios实例
    this.instance = null
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  },

  deactivated () {
    console.log('[screen] 路由离开/缓存失活，清理地图资源')
    this.clearAllTimer()
    this.showDropdown = false
    // ✅ 先销毁地图和覆盖物，再清空数组引用
    // this.destroyMapInstance()
    // this.dbGreenMarkers = []
    // this.manualPointList = []
    // this.manualMarkers = []
    if (this.$refs.chartLine) {
      const chart = echarts.getInstanceByDom(this.$refs.chartLine)
      if (chart) chart.dispose()
    }
    // ✅ 新增：提示浏览器 GC（开发调试用）
    if (window.gc) window.gc()
  },

  activated () {
    console.log('[screen] 切回大屏页面，重新初始化地图')
    this.$nextTick(() => {
      if (!this.map) {
        this.initMap()
      } else {
        // ✅ 修复
        if (this.activateTimer) clearTimeout(this.activateTimer)
        this.activateTimer = setTimeout(() => {
          if (this.map && typeof this.map.resize === 'function') {
            this.map.resize()
          }
        }, 150)
      }
    })
  },

  beforeRouteEnter (to, from, next) {
    next(async vm => {
    })
  },

  sockets: {},

  methods: {
    destroyAllMapOverlay () {
      // ✅ 新增：先清理所有待执行的 setTimeout
      this.infoWinOpenTimers.forEach(id => clearTimeout(id))
      this.infoWinOpenTimers = []
      if (this.globalHoverTimer) {
        clearTimeout(this.globalHoverTimer)
        this.globalHoverTimer = null
      }

      // 1、销毁数据库点位
      this.dbGreenMarkers.forEach(item => {
        if (item.marker) {
          item.marker.off('mouseover')
          item.marker.off('mouseout')
          item.marker.off('dblclick')
          if (this.map) this.map.remove(item.marker)
        }
        if (item.label && this.map) this.map.remove(item.label)
        if (item.mainInfoWin) {
          // ✅ 新增：清理 DOM 事件引用，断开闭包
          const winDom = item.mainInfoWin.getContentDom()
          if (winDom) {
            winDom.onmouseenter = null
            winDom.onmouseleave = null
            const btn = winDom.querySelector('.device-panel-btn')
            if (btn) btn.onclick = null
          }
          item.mainInfoWin.close()
          item.mainInfoWin.off('open')
          item.mainInfoWin = null
        }
        item.marker = null
        item.label = null
      })
      this.dbGreenMarkers = []

      // 2、销毁手动添加橙色点位
      this.manualMarkers.forEach(item => {
        if (item.marker) {
          item.marker.off('mouseover')
          item.marker.off('mouseout')
          item.marker.off('click')
          if (this.map) this.map.remove(item.marker)
        }
        if (item.label && this.map) this.map.remove(item.label)
        item.marker = null
        item.label = null
      })
      this.manualMarkers = []
      this.manualPointList = []

      // ✅ 新增：清理手动点位的 click InfoWindow
      this.manualClickInfoWins.forEach(win => win.close())
      this.manualClickInfoWins = []

      // 3、中心点标记
      this.destroyCenterMarker()
      this.markerEventList = []
    },

    // ========= 完整销毁地图实例 =========
    destroyMapInstance () {
      if (!this.map) return
      // 移除工具栏控件
      if (this.toolBar) {
        this.map.removeControl(this.toolBar)
        this.toolBar = null
      }
      // 解绑地图 click / dblclick
      if (this.mapClickMap) {
        this.map.off('click', this.mapClickMap)
        this.mapClickMap = null
      }
      if (this.mapDblClickMap) {
        this.map.off('dblclick', this.mapDblClickMap)
        this.mapDblClickMap = null
      }
      this.destroyAllMapOverlay()
      this.map.clearMap() // ✅ 正确
      this.map.off()
      this.map.destroy()
      // ✅ 新增：清空容器 DOM，断开高德内部引用
      const container = document.getElementById('container')
      if (container) {
        container.innerHTML = ''
      }
      this.map = null
      this.placeSearch = null
    },
    // 统一清理全部定时器
    clearAllTimer () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      if (this.dropdownTimer) {
        clearTimeout(this.dropdownTimer)
        this.dropdownTimer = null
      }
      // for (let i = 0; i < 18000; i++) clearTimeout(i)
      // for (let i = 0; i < 18000; i++) clearInterval(i)
      // console.log('已清理全部定时器')
      // ✅ 新增：清理所有泄漏的定时器
      if (this.globalHoverTimer) {
        clearTimeout(this.globalHoverTimer)
        this.globalHoverTimer = null
      }
      this.infoWinOpenTimers.forEach(id => clearTimeout(id))
      this.infoWinOpenTimers = []
      if (this.treeDataTimer) {
        clearTimeout(this.treeDataTimer)
        this.treeDataTimer = null
      }
      if (this.activateTimer) {
        clearTimeout(this.activateTimer)
        this.activateTimer = null
      }
      if (this.switchMapTimer) {
        clearTimeout(this.switchMapTimer)
        this.switchMapTimer = null
      }
    },
    refreshAll () {
      window.location.reload()
    },

    checkBtn (btnKey) {
      return this.btnList.includes('*') || this.btnList.includes(btnKey)
    },

    switchOnlyMap () {
      this.onlyMapMode = !this.onlyMapMode
      this.$nextTick(() => {
        // ✅ 修复
        if (this.switchMapTimer) clearTimeout(this.switchMapTimer)
        this.switchMapTimer = setTimeout(() => {
          if (this.map && typeof this.map.resize === 'function') {
            this.map.resize()
          }
          if (this.$refs.chartLine) {
            const chart = echarts.getInstanceByDom(this.$refs.chartLine)
            if (chart) chart.resize()
          }
        }, 150)
      })
    },

    showTip (msg) {
      this.tipText = msg
      this.showTipModal = true
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

    openDevicePanel (id) {
      console.log('点击时的点位数组', this.dbGreenMarkers)

      const deviceItem = this.dbGreenMarkers.find(item => item.id === id)

      console.log('点击时发现的点位变量', deviceItem)

      if (deviceItem && deviceItem.online === true) {
        this.remoteId = id
        this.showDevicePanel = true
      } else {
        this.showTip('该设备当前离线，无法打开设备控制面板！')
      }
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
        this.showTip('已开启点位配置，点击地图任意位置弹出录入窗口')
      }
    },

    clearAllManualPoint () {
      this.manualMarkers.forEach(item => {
        if (item.marker) {
          item.marker.off('mouseover')
          item.marker.off('mouseout')
          item.marker.off('click')
        }
        if (item.marker && this.map) this.map.remove(item.marker)
        if (item.label && this.map) this.map.remove(item.label)
        item.marker = null
        item.label = null
      })

      this.manualMarkers = []
      this.manualPointList = []
    },

    closePointDialog () {
      this.showPointDialog = false
      this.tempPoint = {
        belong: '',
        type: '',
        name: '',
        id: '',
        lng: '',
        lat: '',
        wgsLng: '',
        wgsLat: ''
      }
    },

    confirmAddPoint () {
      if (!this.tempPoint.belong || !this.tempPoint.name || !this.tempPoint.id) {
        this.showTip('归属、点位名称、ID不能为空！')
        return
      }

      this.addManualMarker(this.tempPoint)
      this.closePointDialog()
    },

    async initMap () {
      try {
        // ✅ 确保完全销毁后再新建
        if (this.map) {
          this.destroyMapInstance()
          // 给高德一点清理时间
          await new Promise(resolve => setTimeout(resolve, 50))
        }
        const container = document.getElementById('container')
        if (!container) {
          console.error('地图容器 #container 不存在')
          return
        }
        // ✅ 确保容器是空的
        container.innerHTML = ''

        const initLng = 116.331644
        const initLat = 40.043262

        this.map = new window.AMap.Map('container', {
          zoom: 12,
          center: [initLng, initLat],
          resizeEnable: true
        })

        window.AMap.plugin(['AMap.ToolBar', 'AMap.PlaceSearch'], () => {
          this.toolBar = new window.AMap.ToolBar({
            position: 'LT',
            searchBar: false,
            autoShow: true
          })
          this.map.addControl(this.toolBar)

          this.placeSearch = new window.AMap.PlaceSearch({
            city: '北京',
            pageSize: 8
          })
        })

        const deviceIcon = new window.AMap.Icon({
          size: new window.AMap.Size(48, 64),
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iNDQiIGhlaWdodD0iNjAiIHJ4PSI0IiBzdHJva2U9IiMwMGZmNjYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0iIzBiMTIyOSIvPgogIDxyZWN0IHg9IjgiIHk9IjEwIiB3aWR0aD0iMzIiIGhlaWdodD0iMTIiIGZpbGw9IiMwMGZmNjYiLz4KICA8cGF0aCBkPSJNMjYgMzAgTDIyIDM4IEwyOCAzOCBMMjQgNDgiIHN0cm9rZT0iIzAwZmY2NiIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cmVjdCB4PSItNiIgeT0iMTQiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjMDBmZjY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8cmVjdCB4PSItNiIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjMDBmZjY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+',
          imageSize: new window.AMap.Size(48, 64)
        })

        await this.loadDbGreenPoints(deviceIcon)

        const defaultLng = this.defaultLng
        const defaultLat = this.defaultLat

        this.createCenterMarker(defaultLng, defaultLat, '地图中心')

        this.mapClickMap = (e) => {
          if (!this.drawPointMode) return

          const rawLng = e.lnglat.lng.toFixed(6)
          const rawLat = e.lnglat.lat.toFixed(6)

          const [wgsLng, wgsLat] = this.gcj02ToWgs84(rawLng, rawLat)

          this.tempPoint.lng = rawLng
          this.tempPoint.lat = rawLat
          this.tempPoint.wgsLng = wgsLng.toFixed(6)
          this.tempPoint.wgsLat = wgsLat.toFixed(6)

          this.showPointDialog = true
        }

        this.map.on('click', this.mapClickMap)

        this.mapDblClickMap = (e) => {
          const lng = e.lnglat.lng
          const lat = e.lnglat.lat

          const [gcjL, gcjLa] = this.wgs84ToGcj02(lng, lat)

          console.log('双击点位GCJ02:', gcjL, gcjLa)
        }

        this.map.on('dblclick', this.mapDblClickMap)
      } catch (err) {
        console.warn('地图加载失败', err)
      }
    },

    async loadDbGreenPoints (greenIcon) {
      // ✅ 清理旧的 hover timer
      if (this.globalHoverTimer) {
        clearTimeout(this.globalHoverTimer)
        this.globalHoverTimer = null
      }

      try {
        const grayIcon = new window.AMap.Icon({
          size: new window.AMap.Size(48, 64),
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iNDQiIGhlaWdodD0iNjAiIHJ4PSI0IiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0iIzFiMTIyOSIvPgogIDxyZWN0IHg9IjgiIHk9IjEwIiB3aWR0aD0iMzIiIGhlaWdodD0iMTIiIGZpbGw9IiM5OTk5OTkiLz4KICA8cGF0aCBkPSJNMjYgMzAgTDIyIDM4IEwyOCAzOCBMMjQgNDgiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cmVjdCB4PSItNiIgeT0iMTQiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8cmVjdCB4PSItNiIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+',
          imageSize: new window.AMap.Size(48, 64)
        })

        this.dbGreenMarkers.forEach(item => {
          if (item.marker) {
            item.marker.off('mouseover')
            item.marker.off('mouseout')
            item.marker.off('dblclick')
          }
          if (item.marker && this.map) this.map.remove(item.marker)
          if (item.label && this.map) this.map.remove(item.label)
          if (item.mainInfoWin) item.mainInfoWin.off('open')
          item.marker = null
          item.label = null
          item.mainInfoWin = null
        })
        this.dbGreenMarkers = []

        let items = {}
        items.usertype = this.get_user_info.user.usertype
        items.userorg = this.get_user_info.user.userorg

        const res = await this.instance({
          url: '/localrelative',
          method: 'post',
          data: items
        })

        console.log('【screen】读取的数据库/localrelative:', res.data)

        const dbPoints0 = res.data || []
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

            console.log('【screen】配置了GPS，无高德点位数据:', gcjLng, gcjLat)
          }

          const pos = [parseFloat(gcjLng), parseFloat(gcjLat)]

          const marker = new window.AMap.Marker({
            position: pos,
            icon: grayIcon
          })

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

          const infoContent = `
            <div style="width:230px;color:#fff;background:rgba(0,20,40,0.9);padding:8px 10px;border:1px solid #00ffff;border-radius:4px;font-size:13px;line-height:1.6;">
              <div>ID：${row.catalogid}</div>
              <div>名称：${row.label || ''}</div>
              <div>类型：${row.protocoltype || ''}</div>
              <div>GCJ经纬度：${gcjLng},${gcjLat}</div>
              <div>WGS经纬度：${row.gpslng || ''},${row.gpslat || ''}</div>
              <button 
                class="device-panel-btn"
                data-cid="${row.catalogid}"
                style="width:100%;height:32px;margin-top:10px;border:none;border-radius:4px;background:#0a78ff;color:#fff;font-size:13px;cursor:pointer;pointer-events:auto;"
              >
                设备控制面板
              </button>
            </div>
          `

          const mainInfoWin = new window.AMap.InfoWindow({
            content: infoContent,
            offset: new window.AMap.Pixel(0, -55),
            anchor: 'bottom-center',
            isCustom: true,
            closeWhenClickMap: false
          })

          this.map.add(marker)
          this.map.add(textLabel)

          this.dbGreenMarkers.push({
            id: row.catalogid,
            name: row.label,
            gcjLng,
            gcjLat,
            marker,
            label: textLabel,
            mainInfoWin,
            online: false,
            greenIcon,
            grayIcon
          })

          marker.on('mouseover', () => {
            if (this.globalHoverTimer) {
              clearTimeout(this.globalHoverTimer)
              this.globalHoverTimer = null
            }
            mainInfoWin.open(this.map, marker.getPosition())
          })

          marker.on('mouseout', () => {
            this.globalHoverTimer = setTimeout(() => {
              mainInfoWin.close()
              this.globalHoverTimer = null
            }, 500)
          })

          mainInfoWin.on('open', () => {
            const timerId = setTimeout(() => {
              const winDom = mainInfoWin.getContentDom()
              if (!winDom) return
              winDom.onmouseenter = () => {
                if (this.globalHoverTimer) {
                  clearTimeout(this.globalHoverTimer)
                  this.globalHoverTimer = null
                }
              }
              winDom.onmouseleave = () => {
                this.globalHoverTimer = setTimeout(() => {
                  mainInfoWin.close()
                  this.globalHoverTimer = null
                }, 500)
              }
              const btn = winDom.querySelector('.device-panel-btn')
              if (btn) {
                btn.onclick = (e) => {
                  e.stopPropagation()
                  mainInfoWin.close()
                  this.openDevicePanel(row.catalogid)
                }
              }
            }, 150)
            this.infoWinOpenTimers.push(timerId)
          })

          marker.on('dblclick', () => {
            const target = this.dbGreenMarkers.find(item => item.id === row.catalogid)
            if (!target || !target.online) {
              this.showTip('设备离线，无法打开面板')
              return
            }
            this.remoteId = row.catalogid
            this.openDevicePanel(row.catalogid)
          })
        })
      } catch (err) {
        console.error('读取数据库点位异常', err)
      }
    },

    addManualMarker (pointInfo) {
      const lng = parseFloat(pointInfo.lng)
      const lat = parseFloat(pointInfo.lat)

      const orangeDeviceIcon = new window.AMap.Icon({
        size: new window.AMap.Size(48, 64),
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iNDQiIGhlaWdodD0iNjAiIHJ4PSI0IiBzdHJva2U9IiNmNzgwMDAiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0iIzIwMDgwMCIvPgogIDxyZWN0IHg9IjgiIHk9IjEwIiB3aWR0aD0iMzIiIGhlaWdodD0iMTIiIGZpbGw9IiNmNzgwMDAiLz4KICA8cGF0aCBkPSJNMjYgMzAgTDIyIDM4IEwyOCAzOCBMMjQgNDgiIHN0cm9rZT0iI2Y3ODAwMCIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cmVjdCB4PSItNiIgeT0iMTQiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjZjc4MDAwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8cmVjdCB4PSItNiIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMiIgc3Ryb2tlPSIjZjc4MDAwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+',
        imageSize: new window.AMap.Size(48, 64)
      })

      const marker = new window.AMap.Marker({
        position: [lng, lat],
        icon: orangeDeviceIcon
      })

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

      marker.on('click', () => {
        // ✅ 先关闭之前打开的
        this.manualClickInfoWins.forEach(win => win.close())
        this.manualClickInfoWins = []
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
          isCustom: true
        })

        clickInfoWin.open(this.map, marker.getPosition())
        // ✅ 保存引用
        this.manualClickInfoWins.push(clickInfoWin)
      })

      this.map.add(marker)
      this.map.add(pointTextLabel)

      this.manualMarkers.push({ marker, label: pointTextLabel })
      this.manualPointList.push({
        ...pointInfo,
        lng: lng,
        lat: lat
      })

      this.map.setZoomAndCenter(15, [lng, lat])

      console.log('✅ 点位添加成功', this.manualPointList, this.manualMarkers)
    },

    removePoint (index) {
      const item = this.manualMarkers[index]
      if (item.marker) {
        item.marker.off('mouseover')
        item.marker.off('mouseout')
        item.marker.off('click')
      }
      if (item.marker && this.map) this.map.remove(item.marker)
      if (item.label && this.map) this.map.remove(item.label)

      this.manualMarkers.splice(index, 1)
      this.manualPointList.splice(index, 1)
    },

    saveAllPoints () {
      console.log('待保存点位集合', this.manualPointList)
      this.showTip(`共${this.manualPointList.length}个点位，数据已打印控制台`)

      if (this.manualPointList.length > 0) {
        for (const point of this.manualPointList) {
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
            gpslng: point.wgsLng,
            gpslat: point.wgsLat,
            gcjlng: point.lng,
            gcjlat: point.lat
          }

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
          console.log('数据库添加树节点成功', res.data.result)
          this.$message.success('添加树节点成功')
        } else {
          console.log('数据库添加树节点失败', res.data.result)
          this.$message.error('添加树节点失败')
        }
      })
    },

    locatePointByIndex (idx) {
      const point = this.manualPointList[idx]
      const lng = parseFloat(point.lng)
      const lat = parseFloat(point.lat)

      this.map.setZoomAndCenter(16, [lng, lat])
    },

    locatePoint () {
      if (this.manualPointList.length === 0) return

      const firstPoint = this.manualPointList[0]
      this.map.setCenter([firstPoint.lng, firstPoint.lat])
      this.map.setZoom(14)
    },

    handleClickRow (deviceId) {
      const target = this.dbGreenMarkers.find((d) => d.id === deviceId)

      if (!target) return this.showTip('未找到该点位')

      const lng = Number(target.gcjLng)
      const lat = Number(target.gcjLat)

      if (isNaN(lng) || isNaN(lat)) {
        return this.showTip('坐标无效')
      }

      this.map.setZoomAndCenter(16, [lng, lat])
    },

    locatePointByID (deviceId) {
      const target = this.dbGreenMarkers.find((d) => d.id === deviceId)

      if (!target) return this.showTip('未找到该点位')

      console.log('[screen]居中的点位信息', target)

      const lng = Number(target.gcjLng)
      const lat = Number(target.gcjLat)

      console.log('[screen]居中的点位信息lng=,lat=', lng, lat)

      if (isNaN(lng) || isNaN(lat)) {
        return this.showTip('坐标无效')
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

      console.log('[screen]默认居中的点位:gcjlng=, gcjlat=', lng, lat)

      this.map.setZoomAndCenter(12, [lng, lat])
      this.createCenterMarker(lng, lat, '地图中心')
    },

    createCenterMarker (lng, lat, name) {
      this.destroyCenterMarker()

      const pos = new window.AMap.LngLat(lng, lat)

      const dropIcon = new window.AMap.Icon({
        size: new window.AMap.Size(44, 48),
        image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ0IDQ4Ij48cGF0aCBkPSJNMjIgMiBDMzIgMTIgNDAgMjcgMjIgNDYgNCAyNyAxMiAxMiAyMiAyWiIgZmlsbD0iIzAwNzZmZiIvPjxjaXJjbGUgY3g9IjIyIiBjeT0iMjgiIHI9IjYiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
        imageSize: new window.AMap.Size(44, 48)
      })

      this.centerMarker = new window.AMap.Marker({
        position: pos,
        icon: dropIcon,
        zIndex: 999,
        title: '地图中心点'
      })

      this.centerLabel = null
      this.map.add(this.centerMarker)
    },

    destroyCenterMarker () {
      if (this.centerMarker && this.map) {
        this.map.remove(this.centerMarker)
        this.centerMarker = null
      }

      if (this.centerLabel && this.map) {
        this.map.remove(this.centerLabel)
        this.centerLabel = null
      }
    },

    updateMapPointByID (data) {
      if (!data || !data.cid) return

      const targetIndex = this.dbGreenMarkers.findIndex(item => {
        return (item.id || '').trim() === (data.cid || '').trim()
      })

      if (targetIndex === -1) {
        console.warn('未匹配到该点位ID：', data.cid)
        return
      }

      const currPoint = this.dbGreenMarkers[targetIndex]

      if (!currPoint.marker || !currPoint.marker.getMap()) {
        console.warn('Marker脱离地图，无法更新')
        return
      }
      currPoint.marker.setIcon(currPoint.greenIcon)
      currPoint.marker.setPosition([data.gcjLng, data.gcjLat])

      if (currPoint.label) {
        currPoint.label.setPosition([data.gcjLng, data.gcjLat])
      }
      currPoint.online = true
      currPoint.gcjLng = data.gcjLng
      currPoint.gcjLat = data.gcjLat

      console.log('✅ [updateMapPointByID]：地图绿点+表格在线文字已刷新✅')
    },

    locateCenterMarker () {
      if (!this.centerMarker) {
        this.showTip('暂无实时定位标记')
        return
      }

      const pos = this.centerMarker.getPosition()
      this.map.setZoomAndCenter(16, [pos.lng, pos.lat])
    },

    onSearchFocus () {
      this.showDropdown = true

      if (this.searchKey.trim()) {
        this.handleSearch()
      }
    },

    handleSearch () {
      const keyword = this.searchKey.trim().toLowerCase()

      this.matchDeviceList = []
      this.matchPoiList = []
      this.totalResult = []

      clearTimeout(this.dropdownTimer)
      this.dropdownTimer = null
      this.showDropdown = true

      if (!keyword) {
        this.showDropdown = false
        return
      }

      this.matchDeviceList = this.dbGreenMarkers.filter(item => {
        const name = String(item.name || '').toLowerCase()
        const id = String(item.id).toLowerCase()

        return name.includes(keyword) || id.includes(keyword)
      })

      if (this.matchDeviceList.length === 0 && this.placeSearch) {
        this.placeSearch.search(keyword, (status, res) => {
          if (status === 'complete' && res.poiList.pois.length) {
            this.matchPoiList = res.poiList.pois
          }

          this.totalResult = [...this.matchDeviceList, ...this.matchPoiList]
        })
      } else {
        this.totalResult = [...this.matchDeviceList, ...this.matchPoiList]
      }
    },

    closeSearchDropdown (e) {
      const searchDom = document.querySelector('.map-search-wrap')

      if (searchDom && searchDom.contains(e.target)) {
        return
      }

      this.showDropdown = false
    },

    selectDeviceItem (device) {
      this.searchKey = device.name || device.id
      this.showDropdown = false

      this.$nextTick(() => {
        this.handleSearch()
      })

      this.handleClickRow(device.id)
    },

    selectPoiItem (poi) {
      this.searchKey = poi.name
      this.showDropdown = false

      const [lng, lat] = poi.location.split(',')
      this.map.setZoomAndCenter(15, [Number(lng), Number(lat)])
    },

    hideDropdownTimer () {
      this.dropdownTimer = setTimeout(() => {
        this.showDropdown = false
      }, 220)
    },

    getHeightsWidths () {
      var contentHeight = $(window).height() - 110
      var menuHeight = $('.menubanner').outerHeight()

      $('.content').height(contentHeight)
      $('.orgTreeList').css('top', menuHeight)

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
            data: [2.5, 2.5, 2.5, 2.5, 2.4, 2.2, 2.0, 1.8, 1.5, 1.2, 1.0, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.2]
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
  background: #0b1229 !important;
  color: #fff;
  overflow: visible !important;
  overflow-x: hidden !important;
  display: flex !important;
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
  position: relative;
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
  width: auto;
  text-align: unset;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  font-size: 26px;
  font-weight: 600;
  color: #00ffff;
  letter-spacing: 1.5px;
  z-index: 2;
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
  background-color: #0b1229 !important;
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
  min-height: 200px;
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

.map-tool-bar {
  position: absolute;
  top: 10px !important;
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

.point-type-select {
  flex: 1;
  height: 36px;
  background: #0b2a5a;
  border: 1px solid #00ffff;
  color: #fff;
  padding: 0 10px;
  font-size: 16px;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='cyan' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
}

.map-top-btn {
  height: 36px;
  width: 100px;
  padding: 0 12px;
  border: none;
  border-radius: 3px;
  background-color: #0a78ff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.45);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
}

.map-top-btn:hover {
  background-color: #0767dd;
}

.tip-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tip-box {
  background: #0b1229;
  border: 1px solid #00ffff;
  padding: 20px 26px;
  border-radius: 6px;
  color: #fff;
  text-align: center;
}

.tip-box p {
  margin: 0 0 16px;
  line-height: 1.7;
}

.tip-btn {
  padding: 5px 18px;
  background: #0a78ff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.map-search-wrap {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  z-index: 1005;
}

/deep/ .map-search-wrap .el-input__inner {
  height: 36px;
  line-height: 36px;
  background-color: #0a78ff;
  border: none;
  border-radius: 3px;
  color: #ffffff;
  font-size: 14px;
  padding-left: 42px;
  padding-right: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.45);
  transition: background-color 0.2s ease;
}

/deep/ .map-search-wrap .el-input__prefix {
  color: #fff;
  left: 14px;
}

/deep/ .map-search-wrap .el-input__inner::placeholder {
  color: rgba(255, 255, 255, 0.72);
}

/deep/ .map-search-wrap .el-input__inner:hover {
  background-color: #0767dd;
}

/deep/ .map-search-wrap .el-input__inner:focus {
  background-color: #065bc9;
  box-shadow: 0 0 0 2px rgba(10, 120, 255, 0.35), 0 2px 6px rgba(0,0,0,0.45);
}

/deep/ .map-search-wrap .el-input__inner:focus-visible {
  outline: none;
}

/deep/ .map-search-wrap .el-input__clear {
  color: rgba(255,255,255,0.8);
}

/deep/ .amap-toolbar {
  top: 40px !important;
  left: 16px !important;
}

.search-dropdown-panel {
  margin-top: 6px;
  background: rgba(11, 18, 41, 0.96);
  border: 1px solid #00ffff;
  border-radius: 8px;
  max-height: 340px;
  overflow-y: auto;
}

.dropdown-group-title {
  padding: 8px 16px;
  font-size: 12px;
  color: #00ffff;
  background: rgba(0, 60, 120, 0.3);
}

.dropdown-item {
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: rgba(0, 255, 255, 0.15);
}

.item-name {
  font-size: 14px;
  color: #ffffff;
}

.item-desc {
  font-size: 12px;
  color: #99ccdd;
  margin-top: 3px;
}

.device-item .item-name {
  color: #00ff66;
}

.poi-item .item-name {
  color: #00ffff;
}
</style>
