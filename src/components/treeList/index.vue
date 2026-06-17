<template>
  <div class="orgTreeList">
    <div class="listTitle">远程供电设备列表</div>
    <tree @click = "click"></tree>
    <i class="fa fa-chevron-left" aria-hidden="true"  @click="close"></i>
  </div>
</template>

<script>
import $ from 'jquery'
import tree from './tree.vue'
// import {getHeights} from 'utils/page/ipBroad'
export default {
  components: {tree},
  props: ['selectPhone'],
  created () {
    this.$nextTick(function () {
    })
  },
  watch: {
  },
  methods: {
    close () {
      $('.orgTreeList').removeClass('treeListShow').addClass('treeListHide')
      console.log('点击了:返回树箭头，树缩回')
      this.$store.dispatch('treeListOpenedState', 0)
      var contentWidth = $(window).width()
      $('.content').css('left', 0)
      $('.content').width(contentWidth - 10)
      // $('.musicMenuHalf').css('width', '99.72%')
      // $('.show-area').css('width', '100%')
      // console.log('点击了:返回树箭头，树缩回,show-area width=100%')
    },
    removeAll () {
      $('#end').html('')
    },
    click () {
      this.$emit('refresh')
    }
  }
}
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">

</style>
