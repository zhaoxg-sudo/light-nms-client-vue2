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
    text: '电源电流历史柱线'
  },
  legend: {
    // left: 'right',
    // top: 'center',
    textStyle: {
      color: '#ccc'
      // ...
    },
    data: ['输入A相电流', '输入B相电流', '输入C相电流']
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
    name: '三相电流',
    min: 0,
    // max: 280,
    axisLabel: {
      formatter: '{value} A'
    }
  },
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  series: [
    { type: 'bar', name: '输入A相电流' },
    { type: 'bar', name: '输入B相电流' },
    { type: 'bar', name: '输入C相电流' }
  ]
}
export default {
  name: '',
  components: {},
  props: ['aData'],
  data () {
    return {
      colorTheme: 'dark'
    }
  },
  watch: {},
  created () {},
  beforeMount () {},
  mounted () {
    this.getEchartData()
    console.log('abar ECharts当前版本=', echarts.version)
  },
  methods: {
    async getEchartData () {
      let chart = this.$refs.chart
      if (chart) {
        myChart = echarts.init(chart, this.colorTheme)
        console.log('\noption:', option)
        console.log('\noption后:', option)
        myChart.setOption(option)
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
    reSetOptionA () {
      console.log('enter into adata reSetOption')
      // refresh bar data
      let data = option.dataset.source
      data.splice(0, data.length)
      for (let i = 0; i < this.aData.length; i++) {
        let temp = ['Matcha Latte', 43.3, 85.8, 93.7]
        console.log('this.dataparam[i]', this.aData[i])
        temp[0] = this.aData[i][0]
        temp[1] = this.aData[i][1]
        temp[2] = this.aData[i][2]
        temp[3] = this.aData[i][3]
        data.push(temp)
      }
      myChart.setOption(option)
    }
  },
  computed: {}
}
</script>
<style lang='' scoped>
</style>
