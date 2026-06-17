<template>
  <!--设备信息新增-->
  <div class="popUp" style="display:block;">
    <div class="popContent">
      <h4 >刷新时间设置</h4>
      <el-form ref="form" >
        <el-form-item >
          <input  id ="inputkey"  v-model="refreshtime"  type="text" class="form-control" />
        </el-form-item>
      <el-form-item size="large">
       <button type="button" class="btn btn-sm btn-info" @click="onSubmit">确定</button>
       <button type="button" class="btn btn-sm btn-default" @click="onCancel">取消</button>
      </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
import $ from 'jquery'
import { mapActions } from 'vuex'
export default {
  props: {
    targetMenu: {
      type: Object,
      required: true
    }
  },
  watch: {
  },
  data () {
    return {
      refreshtime: 5,
      defaultshowenabled: true,
      defaultshow: '1',
      devices: [],
      rules: {},
      self: this,
      range: '',
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      }),
      deviceList: []
    }
  },
  created () {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight
      $('.popUp').css('top', documentHeight * 0.3 + 'px')
      this.instance({
        url: '/default/get/' + '1',
        method: 'get'
      })
        .then((res) => {
          if (res.data.length > 0) {
            console.log('default/get=:', res.data)
            this.defaultshowenabled = res.data[0].defaultshowenabled
            this.defaultshow = res.data[0].defaultshow
            this.refreshtime = res.data[0].refreshtime
          }
        })
    })
  },
  methods: {
    ...mapActions([
      'update'
    ]),
    onSubmit () {
      let defaultP = {}
      let _this = this
      defaultP.catalogid = 1
      defaultP.defaultshowenabled = this.defaultshowenabled
      defaultP.defaultshow = this.defaultshow
      defaultP.refreshtime = this.refreshtime
      if (!isNaN(Number(this.refreshtime))) {
        this.refreshtime = this.refreshtime.trim()
        console.log('新的刷新时间t=:', this.refreshtime)
        this.$message.success('新的刷新时间格式正确')
        this.instance({
          url: '/default/update',
          method: 'post',
          data: defaultP
        })
          .then((res) => {
            if (res.data.code === 1) {
              this.$message.success('更新成功')
              let times = _this.refreshtime * 1000
              this.$store.dispatch('updateTime', times)
              this.$emit('close')
            } else {
              this.$message.success('更新失败，请检查数据库')
            }
          })
      } else {
        this.$message.success('请输入数字作为刷新时间')
        this.refreshtime = ''
      }
      // this.$emit('close')
    },
    onCancel () {
      this.$emit('close')
    }
  }
}
</script>

<style scpoed>

#input_key{
  margin: 20px auto;
  width : 450px;
}

#height04{
  margin : 20px auto;
}
</style>
