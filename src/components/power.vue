<template>
  <div>
      <topMenu></topMenu>
      <container></container>
      <footNav  :username = "username"></footNav>
      <switchLeft></switchLeft>
      <treeList></treeList>
      <audio ref = "alarm"  src = "alarm.mp3" >
      <audio ref = "voice"  src = "voice.mp3" >
  </div>
</template>

<script>
import $ from 'jquery'
import topMenu from './topMenu/index.vue'
import container from './container/index.vue'
import footNav from './footNav/index.vue'
import switchLeft from './switchLeft/index.vue'
import treeList from './treeList/index.vue'
import { mapGetters } from 'vuex'
import {GET_USER_INFO} from '@/store/getters/type.js'
export default {
  name: 'power',
  data () {
    return {
      alarmMsg: '还没收到websockt数据',
      devicelist: [],
      username: '',
      gpsSubHandler: null,
      /* ✅修改：补全缺失声明，防止隐式属性造成内存残留 */
      remoteId: '',
      deviceOnline: false,
      lastGps: null,

      instance: this.$ajax.create({
        baseURL: this.$appHost
      })
    }
  },
  components: {
    'topMenu': topMenu,
    'container': container,
    'footNav': footNav,
    'switchLeft': switchLeft,
    'treeList': treeList
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO
    })
  },
  created () {
    this.username = this.get_user_info.user.username

    if (!window.globalGpsSubscribed) {
      window.globalGpsSubscribed = true
      this.gpsSubHandler = this.sockets.subscribe('gps', (rawGpsData) => {
        console.log('收到了后台推送websocket->gps信息！！！！！！！！！！\n', rawGpsData)
        this.remoteId = rawGpsData.clientKey
        this.deviceOnline = true
        // 【修改1】切断原始响应式对象引用，不直接赋值rawGpsData
        this.lastGps = Object.assign({}, rawGpsData)

        const rawLng = Number(rawGpsData.lng)
        const rawLat = Number(rawGpsData.lat)
        if (isNaN(rawLng) || isNaN(rawLat) || rawLng < 70 || rawLng > 140 || rawLat < 15 || rawLat > 60) {
          console.warn('收到无效GPS经纬度，跳过本次点位更新', rawLng, rawLat, rawGpsData)
          return
        }

        const [gcjLng, gcjLat] = this.wgs84ToGcj02(rawLng, rawLat)
        console.log('✅ 转换后高德GCJ02坐标：', gcjLng, gcjLat)

        if (isNaN(gcjLng) || isNaN(gcjLat)) {
          console.warn('坐标转换后数值异常，跳过更新', gcjLng, gcjLat)
          return
        }
        // 【修改2】新建纯净普通对象，全部转为基础类型，不带__ob__
        let updatepoints = {
          cid: String(rawGpsData.cid),
          gcjLng: Number(gcjLng),
          gcjLat: Number(gcjLat)
        }
        this.$store.dispatch('updatePoint', updatepoints)
        console.log('✅[power]发送的updatePoint state=：', updatepoints)
      })
    }

    this.$nextTick(async () => {
      this.getHeightsWidths()
      $('.orgTreeList').removeClass('treeListHide').addClass('treeListShow')
      this.$store.dispatch('treeListOpenedState', 1)
    })
  },
  beforeDestroy () {
    // 【修改3】unsubscribe必须传handler回调，原代码缺少第二个参数，订阅无法真正解绑
    if (this.gpsSubHandler) {
      this.sockets.unsubscribe('gps', this.gpsSubHandler)
      this.gpsSubHandler = null
    }
    window.globalGpsSubscribed = false
    // 【修改4】清空GPS相关引用，释放内存
    this.lastGps = null
    this.remoteId = ''
    this.deviceOnline = false
  },
  methods: {
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
      const sqrtMagic = Math.sqrt(magic2 * magic2 * magic2)
      dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic2 * sqrtMagic) * PI)
      dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
      const gcjLat = wgsLat + dLat
      const gcjLon = wgsLon + dLon
      return [gcjLon, gcjLat]
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
        $('.content').css('left', treeWidth)
        $('.content').width(contentWidth - treeWidth - 10)
      } else {
        var contentWidths = $(window).width()
        $('.content').css('left', 0)
        $('.content').width(contentWidths - 10)
      }
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
