<template>
  <!--确定弹窗-->
  <div class="popUp" id="hasNum" v-if="dialogShow">
    <slot name="content"></slot>
    <div  class="btn">
      <button type="button" class="btn btn-info" @click="submit">确定</button>
      <button type="button" class="btn btn-default" @click="close">取消</button>
    </div>

  </div>
</template>

<script>
  import { mapGetters,mapActions } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        phoneNum: 'phoneNum',
        dialogShow: 'dialogShow'
      }),
    },
    methods: {
      close() {
        this.$store.dispatch('setDialogShow', false)
        this.$store.dispatch('setDialogStatu', null)
      },
      submit() {
        this.$emit('submit')
      }
    }
  }

</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">

</style>
