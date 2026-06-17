<template>
  <div class="openTreeList" @click="open"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>

</template>

<script>
import $ from 'jquery'
export default {
  methods: {
    open () {
      $('.orgTreeList').removeClass('treeListHide').addClass('treeListShow')
      console.log('点击了树展开按钮')
      this.$store.dispatch('treeListOpenedState', 1)
      var contentWidth = $(window).width()
      var treeWidth = $('.orgTreeList').width()
      $('.content').css('left', treeWidth)
      $('.content').width(contentWidth - treeWidth - 10)
      // $('.content').width(contentWidth - treeWidth - 10 - 3)
      // $('.musicMenuHalf').css('width', '85%')
      // $('.show-area').css('width', '100%')
      // console.log('点击了树展开按钮,show-area width=85%')
    }
  }
}
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">

</style>
