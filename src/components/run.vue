<template>
  <div class="content">
    <div>
      <show :currentTreeData='currentTreeData'></show>
    </div>
    <div class="middleCon">
      <topo :topoType='topoType'></topo>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import topo from './topo/topo.vue'
import show from './show/show.vue'
import { getHeight } from '@/utils/height.js'
import { mapGetters } from 'vuex'
export default {
  name: 'run',
  data () {
    return {
      topoType: 1,
      msg: '供电运行参数显示',
      currentTreeData: ''
    }
  },
  components: {
    topo: topo,
    show: show
  },
  created () {
    let _this = this
    console.log('进入了run vue.......')
    console.log('TreeData', this.TreeData)
    this.currentTreeData = this.TreeData
    this.$nextTick(async () => {
      $('.orgTreeList').addClass('treeListShow').removeClass('treeListHide')
      getHeight()
      this.getHeightsWidths()
      this.sockets.subscribe('alarm', (data) => {
        _this.msg = data
      })
    })
  },
  computed: {
    ...mapGetters({
      TreeData: 'TreeData'
    })
  },
  watch: {
    'TreeData': {
      handler: async function (data) {
        console.log('run has watched  tree data id ,labal:=', data.catalogid, data.label)
        this.currentTreeData = data
        this.$nextTick(async function () {
          this.getHeightsWidths()
        })
      },
      deep: true
    }
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
        $('.content').css('left', treeWidth)
        $('.content').width(contentWidth - treeWidth - 10)
        // $('.musicMenuHalf').css('width', '85%')
        // $('.show-area').css('width', '85%')
        // console.log('show-area width85%')
      } else {
        var contentWidths = $(window).width()
        $('.content').css('left', 0)
        $('.content').width(contentWidths - 10)
        // $('.musicMenuHalf').css('width', '99.72%')
        // $('.show-area').css('width', '100%')
        // console.log('show-area width=100%')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
::-webkit-scrollbar{
  width: 5px;
  background: #4E545A

}
.content{overflow-y:auto;}
::-webkit-scrollbar-button{  }
::-webkit-scrollbar-track{ }
::-webkit-scrollbar-track-piece {}
::-webkit-scrollbar-thumb{
  background:#6F7882;
  border-radius: 5px;
}

::-webkit-scrollbar-corner {  }
::-webkit-resizer{}
</style>
