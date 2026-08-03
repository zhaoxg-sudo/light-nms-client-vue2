<template>
  <div class="allDevice ">
    <div class="menuType">
      <i class="fa fa-list-ul" aria-hidden="true"></i>设备列表
      <p @click="confirmAdd">确定添加</p>
      <p @click="confirmAddAll">全部添加</p>
    </div>
    <form style="padding:5px 10px">
      <input type="text" class="form-control form-lighter" placeholder="快速查找设备" />
    </form>
    <div class="musicList" id="height02">
      <div id="SelectedMembers" class="aa">
        <div class="singleFlies" :class="{selected: device.selected}" v-for="device in deviceList" :key="device.deviceId" @click="selectDeviceEvent(device)">
          {{device.deviceCode}}
          <span>{{ device.deviceName }}</span>
        </div>
      </div>
    </div>
    <div class="sidder" @click="close()">
      <i class="fa fa-2x fa-angle-double-right"></i>
      <span>收起</span>
    </div>
  </div>
</template>
<script>
import { getHeight } from 'utils/height'
import { getHeights } from 'utils/page/deviceGroup'

export default {
  data () {
    return {
      deviceList: [],
      selectDevice: []
    }
  },
  created () {
    this.$nextTick(function () {
      getHeight()
      getHeights()
      this.refresh()
    })
  },
  methods: {
    refresh () {
      this.$ajax.post('Device/List')
        .then(res => {
          if (res.data.code === 1) {
            let result = res.data.result
            result.forEach((r, i) => {
              r.selected = false
            })
            this.deviceList = result
          }
        })
    },
    selectDeviceEvent (device) {
      if (!device.selected) {
        if(this.selectDevice.length == 0) {
          this.selectDevice.push(device)
        }else {
          let isRepeat = this.selectDevice.find(item => item.deviceId == device.deviceId)
          if(!isRepeat) {
            this.selectDevice.push(device)
          }
        }
        
      }
      device.selected = !device.selected
    },
    confirmAdd () {
      
      if (this.deviceList.length !== 0 && this.selectDevice.length !== 0) {
        this.$emit('transferData', this.selectDevice)
      }
    },
    confirmAddAll () {
      if (this.deviceList.length !== 0) {
        this.$emit('transferData', this.deviceList)
      }
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
