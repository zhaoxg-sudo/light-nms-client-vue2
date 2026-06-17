<template>
  <!--提示框-->
  <div class="popUp" id="hasNum" v-if="dialogShow">
    <slot name="content"></slot>
    <div  class="btn">
      <button type="button" class="btn btn-info" @click="close">确定</button>
      <button type="button" class="btn btn-default" @click="close">取消</button>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      dialogShow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      close() {
        this.$emit('close')
      }
    }
  }
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">

</style>
