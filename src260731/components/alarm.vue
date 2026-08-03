<template>
  <div>
      <h1>{{msg}}</h1>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'
export default {
  name: 'alarm',
  data () {
    return {
      msg: '还没收到websockt数据'
    }
  },
  created () {
    this.$nextTick(async () => {
      this.getHeightsWidths()
    })
  },
  computed: {
    ...mapGetters({
      alarmReport: 'alarmReport'
    })
  },
  watch: {
    'alarmReport': {
      handler: async function (data) {
        console.log('alarm report:=', data)
        this.msg = data
        this.$nextTick(function () {
        })
      }
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
      } else {
        var contentWidths = $(window).width()
        $('.content').css('left', 0)
        $('.content').width(contentWidths - 10)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  border: 5px solid #4e545a;
  padding: 0;
  margin: 0;
}
h1, h2 {
  font-weight: normal;
  background: darkred;
  }
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
