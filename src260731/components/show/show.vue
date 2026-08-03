<template>
  <div>
     <div v-if="acshow==true">
       <acshowab :currentCatalog='currentCatalog' :allChildrenList='allChildrenList' @alarmFired='alarmFired' @alarmRestored='alarmRestored'></acshowab>
     </div>
     <div v-if="acshow==false">
       <dcshowsh :currentCatalogLabel='currentCatalogLabel' :currentCatalogID='currentCatalogID'></dcshowsh>
     </div>
     <div v-if="boxshow!=null">
       <acshowbox :currentCatalogLabel='currentCatalogLabel' :currentCatalogID='currentCatalogID'></acshowbox>
     </div>
      <div v-if="clsdshow!=null">
       <acshowclsd :currentCatalogLabel='currentCatalogLabel' :currentCatalogID='currentCatalogID'></acshowclsd>
     </div>
     <div v-if="tableisshow!=null">
       <tableshow :currentCatalogLabel='currentCatalogLabel' :currentCatalogID='currentCatalogID' :allChildrenList='allChildrenList' @alarmFired='alarmFired' @alarmRestored='alarmRestored'></tableshow>
     </div>
     <audio ref = "alarm"  src = "alarm.mp3" ></audio>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import acshowab from './acshow_ab.vue'
import acshowbox from './acshow_box.vue'
import acshowclsd from './acshow_clsd.vue'
import dcshowsh from './dcshow_sh.vue'
import tableshow from './show_table.vue'
export default {
  name: '',
  components: {
    acshowab: acshowab,
    acshowbox: acshowbox,
    acshowclsd: acshowclsd,
    dcshowsh: dcshowsh,
    tableshow: tableshow
  },
  props: ['currentTreeData'],
  data () {
    return {
      allChildrenList: [],
      updatetime: 5000,
      timer: [],
      currentCatalog: {},
      currentCatalogID: '',
      currentCatalogLabel: '',
      protocalType: '',
      acshow: null,
      boxshow: null,
      clsdshow: null,
      tableisshow: null,
      instance: this.$ajax.create({
        baseURL: 'http://123.57.87.144:7001/'
      })
    }
  },
  watch: {
    'TreeData': {
      handler: async function (data) {
        console.log('show vue has watched  tree data id ,labal:=, protocaltype:=', data.catalogid, data.label, data.protocoltype)
        this.currentCatalogID = data.catalogid
        this.protocalType = data.protocoltype
        this.currentCatalogLabel = data.label
        this.currentCatalog.label = data.label
        this.currentCatalog.id = data.catalogid
        this.currentCatalog.ipaddress = data.ipaddress
        let nodelist = []
        let catalogList = []
        nodelist.push(data)
        this.allChildrenList = this.getAllChildrenNode(catalogList, nodelist)
        console.log('all children===', catalogList)
        this.$nextTick(async function () {
          if (this.protocalType === '1') {
            this.acshow = false
            this.tableisshow = null
            this.boxshow = null
            this.clsdshow = null
          } else if (this.protocalType === '2') {
            this.acshow = true
            this.tableisshow = null
            this.boxshow = null
            this.clsdshow = null
          } else if (this.protocalType === '7') {
            console.log('this.protocalType', this.protocalType)
            this.boxshow = true
            this.acshow = null
            this.clsdshow = null
            this.tableisshow = null
          } else if (this.protocalType === '8') {
            console.log('this.protocalType', this.protocalType)
            this.clsdshow = true
            this.boxshow = null
            this.acshow = null
            this.tableisshow = null
          } else {
            this.tableisshow = true
            this.acshow = null
            this.boxshow = null
            this.clsdshow = null
          }
        })
      },
      deep: true
    }
  },
  created () {
    let _this = this
    console.log('进入了show vue.......')
    console.log('show vue this.currentTreeData==', this.currentTreeData)
    console.log('show vue this.protocalType==', this.currentTreeData.protocoltype)
    this.currentCatalogID = this.currentTreeData.catalogid
    this.currentCatalogLabel = this.currentTreeData.label
    this.protocalType = this.currentTreeData.protocoltype
    this.currentCatalog.label = this.currentTreeData.label
    this.currentCatalog.id = this.currentTreeData.catalogid
    this.currentCatalog.ipaddress = this.currentTreeData.ipaddress
    let nodelist = []
    let catalogList = []
    nodelist.push(this.currentTreeData)
    this.allChildrenList = this.getAllChildrenNode(catalogList, nodelist)
    console.log('show created all children===', catalogList)
    // 刷新工作参数
    console.log('refresh刷新default工作参数.......')
    this.instance({
      url: '/default/get/' + '1',
      method: 'get'
    })
      .then((res) => {
        if (res.data.length > 0) {
          console.log('default/get=:', res.data)
          // this.defaultshowenabled = res.data[0].defaultshowenabled
          // this.defaultshow = res.data[0].defaultshow
          _this.updatetime = res.data[0].refreshtime * 1000
          _this.$store.dispatch('updateTime', _this.updatetime)
        }
      })
    this.$nextTick(async function () {
      if (this.protocalType === '1') {
        this.acshow = false
        this.tableisshow = null
        this.clsdshow = null
      } else if (this.protocalType === '2') {
        this.acshow = true
        this.tableisshow = null
        this.clsdshow = null
      } else if (this.protocalType === '7') {
        this.boxshow = true
        this.tableisshow = null
        this.clsdshow = null
      } else if (this.protocalType === '8') {
        this.clsdshow = true
        this.boxshow = null
        this.tableisshow = null
      } else {
        this.tableisshow = true
        this.acshow = null
        this.boxshow = null
        this.clsdshow = null
      }
    })
  },
  beforeMount () {},
  mounted () {},
  methods: {
    // alarm restored
    alarmRestored (r) {
      console.log('show组件，收到了告警恢复', r)
      // alarm restore process
      if (r.length > 0) {
        for (let i = 0; i < r.length; i++) {
          // 查询当前告警
          this.instance({
            'url': '/alarm/current/' + r[i].alarmid,
            'method': 'get'
          }).then((res) => {
            console.log('\nalarmRestored当前告警查询结果:')
            console.log(res.data)
            // 1,当前的告警，转移到历史告警数据库
            let writeData = res.data[0]
            writeData.alarmrestoreflag = true
            writeData.alarmrestoreinfo = r[i].alarmrestoreinfo
            this.instance({
              'url': '/alarm/history/add',
              data: writeData,
              'method': 'post'
            }).then((res) => {
              console.log('\nalarmRestored当前告警转移到历史告警结果:')
              console.log(res.data)
              // 2,在当前告警数据库中删除这条告警
              let alarmid = {
                alarmid: writeData.alarmid
              }
              this.instance({
                'url': '/alarm/current/del',
                data: alarmid,
                'method': 'post'
              }).then((res) => {
                console.log('\nalarmRestored删除当前告警结果:')
                console.log(res.data)
              })
            })
          })
        }
      }
      // 3,更新当前告警列表
    },
    // alarm fired
    alarmFired (e) {
      let _this = this
      let alarmFired = false
      console.log('show组件，收到了告警', e)
      // 判断是否是新产生的告警
      if (e.length > 0) {
        for (let i = 0; i < e.length; i++) {
          this.instance({
            'url': '/alarm/firedcheck',
            data: e[i],
            'method': 'post'
          }).then((res) => {
            console.log('\n是否是新告警查询结果`:')
            console.log(res.data)
            if (res.data.length > 0) {
              console.log('\n告警已在当前告警中，不予处理:', res.data)
            } else {
              alarmFired = true
              // 产生告警消息
              // 1,发送告警消息
              _this.$refs.alarm.play().catch(err => { console.log('\nalarm play：', err) })
              // _this.timer[i] = setInterval(() => {
              //   console.log('show_table发起报警声音播放')
              //   _this.$refs.alarm.play().catch(err => { console.log('\nalarm play：', err) })
              // }, 2000)
              // _this.$router.push('/alarm/currentAlarm/index')
              //   .then(() => { console.log('发生告警，切换到当前告警路由') })
              //   .catch(err => { console.log('\nroot user alarm router-out-err:', err) })
              // 2,写入数据库
              console.log('\n新告警，进入告警处理程序:', res.data.length)
              this.instance({
                'url': '/alarm/firedinsert',
                data: e[i],
                'method': 'post'
              }).then((res0) => {
                if (res0.data.rowCount === 1) {
                  console.log('\n告警成功写入当前告警数据库:', res0.data)
                } else { console.log('\n告警写入当前告警数据库失败？？？？？？', res0.data) }
              })
            }
          })
        }
      }
      if (alarmFired) {
        // console.log('发送切换路由到当前告警命令')
        // this.$router.push('/alarm/currentAlarm/index')
        //   .then(() => { console.log('发生告警，切换到当前告警路由') })
        //   .catch(err => { console.log('\nroot user alarm router-out-err:', err) })
      }
    },
    // get all children node
    getAllChildrenNode (catalogList, nodeList) {
      for (let i = 0; i < nodeList.length; i++) {
        // console.log('i in getAllChildrenNode: ', i)
        // console.log('nodeList[i].id  in getAllChildrenNode: ', nodeList[i].catalogid)
        catalogList.push(nodeList[i])
        if (nodeList[i].children) {
          catalogList = this.getAllChildrenNode(catalogList, nodeList[i].children)
        }
      }
      return catalogList
    }
  },
  computed: {
    ...mapGetters({
      TreeData: 'TreeData'
    })
  }
}
</script>
<style lang='' scoped>
</style>
