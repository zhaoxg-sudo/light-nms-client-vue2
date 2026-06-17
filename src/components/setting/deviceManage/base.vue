<template>
  <!--设备信息新增-->
  <div class="popUp" style="display: block;">
    <div class="popContent">
	<el-form class="form-horizontal"   :model="formData" ref="formData" :rules="rules">
        <div class="row">
            <div class="form-group">
              <label>视频联动存储密匙</label>
                <input id = "input_key" type="text" class="form-control" v-model="formData.uniqueid">
            </div>
        </div>
	</el-form >
    </div>
    <div class="btnDiv">
      <button type="button" class="btn btn-sm btn-info" @click="submitFrom(self,  1  , 'Basic/Create', 'Basic/Edit', formData)">确定</button>
      <button type="button" class="btn btn-sm btn-default" @click="close">取消</button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapActions } from 'vuex'
import {getHeights} from 'utils/page/device'
export default {
  props: ['modolType'],
  data () {
      return {
      formData: {
	uniqueid:"",
      },
      rules: {},
      self: this
      }
  },
  created () {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight
      $('.popUp').css('top', documentHeight * 0.3 + 'px')
      //getHeights()
      if (this.modolType === 2) {
        this.$ajax.post('Basic/List')
          .then(res => {
	  console.log(res)
	    console.log(res.data.code,res.data.result.length)
            if (res.data.code === 1 && res.data.result.length>0) {
              this.formData.uniqueid = res.data.result[0].uniqueid
	      this.formData.basicid  = res.data.result[0].basicid
            }
	    else if(res.data.code === 1){
	    this.$ajax.post('Basic/Create',{uniqueId:"请输入视频联动存储密匙"})
          	.then(res => {
          	this.formData.basicId = res.data.result.basicid})
		}
          })
      }
    })
  },
  methods: {
    ...mapActions([
      'update'
    ]),
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
	#input_key{
	margin: 10px auto;
	width : 450px;
	}
</style>
