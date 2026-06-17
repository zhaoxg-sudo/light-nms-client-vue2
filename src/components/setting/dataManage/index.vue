<template>
  <div class="content">
    <div class="tableTool">
      <div class="operate">
        <form class="form-inline">
          <div class="form-group">
            <input type="text" placeholder="请输入要查询的设备id" class="form-control select-width" style="width:200px;" v-model="fuzzyquery" />
          </div>
          <!-- <button type="button" class="btn btn-info" @click="openModal(-1)">
            <i class="fa fa-bolt" aria-hidden="true"></i>修改告警联动
          </button> -->
          <button type="button" class="btn btn-info" @click="refresh()">
            <i class="fa fa-search" aria-hidden="true"></i>查询
          </button>
        </form>
      </div>
    </div>

    <!-- <div class="table">
      <table class="table">
        <thead>
          <tr>
            <td>设备id</td>
            <td>设备名称</td>
            <td>设备类型</td>
            <td>设备ip</td>
            <td>设备port</td>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="item in dataAll" :key="item.catalogid">
            <td>{{item.catalogid}}</td>
            <td>{{item.label}}</td>
            <td>{{returnType(item.protocoltype)}}</td>
            <td>{{item.ipaddress}}</td>
            <td>
              {{item.ipport}}
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
    <div v-if="modolType ==2">
     xxx
    </div>
    <div v-if="modolType != null && modolType !=2">
      xxx
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import modal from './edit.vue'
// import basechange from './base.vue'
// import {getHeights} from 'utils/page/setting'
export default {
  data () {
    return {
      dataAll: [],
      fuzzyquery: '',
      modolType: null,
      self: this,
      transferData: {
        deviceid: ''
      },
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  computed: {
    ...mapGetters({
      // updateState: 'updateState'
      // get_user_info:'GET_USER_INFO'
    })
  },
  created () {
    this.$nextTick(() => {
      this.refresh()
      // getHeights()
    })
  },
  watch: {
    'updateState': function () {
      // this.refresh()
      this.$store.state.updateState = 0
    }
  },
  components: {
    // modal,
    // basechange
  },
  methods: {
    returnType (type) {
      switch (type) {
        case 0:
          return '站点'
        case '1':
          return '直流局端'
        case '2':
          return '交流局端'
        default: return '站点'
      }
    },
    refresh () {
      this.instance({
        'url': 'localall',
        'method': 'get'
      }).then((res) => {
        console.log('\npower local device db:')
        console.log(res.data)
        if (res.data) {
          res.data.forEach((num) => {
            let exist = false
            for (let i = 0; i < this.dataAll.length; i++) {
              if (this.dataAll[i].catalogid === num.catalogid) {
                this.dataAll[i] = num
                exist = true
              }
            }
            if (!exist) this.dataAll.push(num)
          })
          console.log('\npower local device table')
          console.log(this.dataAll)
        }
      })
    },
    openModal (id) {
      if (id === 0) {
        this.modolType = 0
      } else if (id !== -1) {
        this.modolType = 1
        this.transferData.deviceid = id
      } else {
        this.modolType = 2
      }
    },
    deleteItem (deviceId) {
      this.$ajax.post('Device/RemoveList', [deviceId])
        .then(res => {
          if (res.data.code === 1) {
            console.log('删除成功')
            this.refresh()
          }
        })
    },
    close () {
      this.modolType = null
    },
    getHeight () {
      // getHeights()
    }
  }
}
</script>
<style scoped>
</style>
