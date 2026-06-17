<template>
  <div>
    <!-- <h3>报表管理显示区</h3> -->
    <div ref="chart" style="width:100%;height:376px"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
let myChart
let option = {
  title: {
    text: '电源电压历史柱线'
  },
  legend: {
    // left: 'right',
    // top: 'center',
    textStyle: {
      color: '#ccc'
      // ...
    },
    data: ['A相电压', 'B相电压', 'C相电压']
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar'] },
      // restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  tooltip: {},
  dataset: {
  // 提供一份数据。
    source: [
      // ['product', 'A相电压', 'B相电压', 'C相电压']
      // ['Matcha Latte', 43.3, 85.8, 93.7]
    ]
  },
  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  xAxis: { type: 'category' },
  // 声明一个 Y 轴，数值轴。
  yAxis: {
    name: '三相电压',
    min: 0,
    // max: 280,
    axisLabel: {
      formatter: '{value} V'
    }
  },
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  series: [
    { type: 'bar', name: '输入A相电压' },
    { type: 'bar', name: '输入B相电压' },
    { type: 'bar', name: '输入C相电压' }
  ]
}
export default {
  name: '',
  components: {},
  props: ['vData', 'vXy'],
  data () {
    return {
      colorTheme: 'dark'
    }
  },
  watch: {
  },
  created () {
    // option.series[0].name = '输入'
  },
  beforeMount () {},
  mounted () {
    option.series[0].name = this.vXy.l0
    option.legend.data[0] = this.vXy.l0
    option.series[1].name = this.vXy.l1
    option.legend.data[1] = this.vXy.l1
    option.series[2].name = this.vXy.l2
    option.legend.data[2] = this.vXy.l2
    // option.series[3].name = this.vXy.l3
    // option.legend.data[3] = this.vXy.l3
    this.getEchartData()
    console.log('vbar ECharts当前版本=', echarts.version)
    // option.series[0].name = 'V相电压'
    console.log('vbar option=', option)
  },
  methods: {
    resetOption () {
      console.log('enter vbar reset')
      option.series[0].name = this.vXy.l0
      option.legend.data[0] = this.vXy.l0
      option.series[1].name = this.vXy.l1
      option.legend.data[1] = this.vXy.l1
      option.series[2].name = this.vXy.l2
      option.legend.data[2] = this.vXy.l2
      // option.series[3].name = this.vXy.l3
      // option.legend.data[3] = this.vXy.l3
      this.getEchartData()
    },
    async getEchartData () {
      let chart = this.$refs.chart
      if (chart) {
        myChart = echarts.init(chart, this.colorTheme)
        console.log('\noption:', option)
        myChart.setOption(option)
        console.log('\noption后:', option)
        window.addEventListener('resize', function () {
          myChart.resize()
        })
        this.$on('hook:destroyed', () => {
          window.removeEventListener('resize', function () {
            myChart.resize()
          })
        })
      }
    },
    reSetOptionV () {
      console.log('enter into vData reSetOption')
      // refresh bar data
      console.log('enter into vData reSetOption,option.series=', option.series)
      // option.series[0].name = 'V相电压'
      let data = option.dataset.source
      data.splice(0, data.length)
      for (let i = 0; i < this.vData.length; i++) {
        let temp = ['Matcha Latte', 43.3, 85.8, 93.7]
        // console.log('this.dataparam[i]', this.vData[i])
        temp[0] = this.vData[i][0]
        temp[1] = this.vData[i][1]
        temp[2] = this.vData[i][2]
        temp[3] = this.vData[i][3]
        data.push(temp)
      }
      myChart.setOption(option)
    }
  },
  computed: {
  }
}
</script>
<style lang='' scoped>
</style>
