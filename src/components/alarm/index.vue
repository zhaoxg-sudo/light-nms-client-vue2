<template>
  <div>
    <div>
      <ul class="nav nav-justified choose">
        <router-link v-for="item in routerList" :key="item.path" tag="li" active-class="on" :to="item.path">
          {{item.name}}
        </router-link>
      </ul>
      <div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import routes from '@/router/index'
import { getHeight } from '@/utils/height.js'
export default {
  data () {
    return {
      routerList: []
    }
  },
  created () {
    this.$nextTick(function () {
      let routerList = routes.options.routes[2].children
      console.log('告警管理路由表', routerList)
      routerList.forEach((r, i) => {
        if (r.name === '告警管理') {
          this.routerList = r.children
        }
      })
      $('.orgTreeList').removeClass('treeListShow').addClass('treeListHide')
      getHeight()
      this.getHeightsWidths()
    })
  },
  watch: {
  },
  methods: {
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
        $('.content').css('left', 0)
        $('.content').width(contentWidth - treeWidth - 10)
      } else {
        var contentWidths = $(window).width()
        $('.content').css('left', 0)
        $('.content').width(contentWidths - 10)
      }
    },
    toggle (i, v) {
      this.active = i
      this.currentView = v
    },
    tabClick (e) {
      this.tabName = e.target.innerText
    }
  }
}
</script>

<style scoped>
</style>
