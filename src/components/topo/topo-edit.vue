<template>
  <div id="topo-container">
    <item-list v-if="true" id="item-list-left"></item-list>
    <div id="chart-container">
      <div v-if="true" class="toolbar">
        <el-button type="primary" size="medium" @click="itemRemove()">删除</el-button>
        <el-button type="primary" size="medium" @click="save()">保存</el-button>
      </div>
      <svg
        id="topo-chart"
        width="100%"
        height="100%"
        style="stroke: rgb(0, 0, 255); stroke-width: 2"
      ></svg>
    </div>

    <dialogStation
      v-if="dialog.STATION"
      :item="editItem"
      @on-close="onCloseDialog"
      class="dialog-style"
    ></dialogStation>
    <dialogDcCenter
      v-if="dialog.DCCENTER"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialogDcCenter>
    <dialogAcCenter
      v-if="dialog.ACCENTER"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialogAcCenter>
    <dialogAcRemote
      v-if="dialog.ACREMOTE"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialogAcRemote>
    <dialogDcRemote
      v-if="dialog.DCREMOTE"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialogDcRemote>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import * as d3 from 'd3'
import Chart from './chart'
import itemList from './item-list.vue'
import dialogStation from './dialog/station.vue'
import dialogDcCenter from './dialog/dccenter.vue'
import dialogAcCenter from './dialog/accenter.vue'
import dialogAcRemote from './dialog/acremote.vue'
import dialogDcRemote from './dialog/dcremote.vue'
import './dialog/_dialog.scss'

let chart = null
export default {
  components: {
    itemList,
    dialogStation,
    dialogDcCenter,
    dialogAcCenter,
    dialogAcRemote,
    dialogDcRemote
  },
  name: 'topo',
  data () {
    return {
      currentTreeNodeID: '',
      runMsg: 'runstatus',
      currentCatalogID: '',
      draged: false,
      editItem: null,
      dialog: {
        STATION: false,
        // CUSTOM_DATA: false,
        DCCENTER: false,
        ACCENTER: false,
        ACREMOTE: false,
        DCREMOTE: false
        // EMAIL: false
      },
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  mounted () {
    let container = d3
      .select('#topo-chart')
      .style('background-color', '#4e545a')
    chart = new Chart({
      container: container,
      onItemDblclick: this.onItemDblclick
    })
    console.log('mounted', chart)
    // this.TreeData = this.$store.state.TreeData
    this.currentCatalogID = this.TreeData.catalogid
    // console.log('TreeData:=', this.TreeData)
    // this.clearChart()
    // this.loadData(this.currentCatalogID)
    // // this.loadDataDemo()
    // this.bindDragEvent()
    // this.refreshChart()
  },
  computed: {
    ...mapGetters({
      updateState: 'updateState',
      TreeData: 'TreeData'
    })
  },
  watch: {
    'TreeData': {
      handler: async function (data) {
        console.log('topo-edit model has watched  tree data id ,labal:=', data.catalogid, data.label)
        this.currentTreeNodeID = data.label
        this.currentCatalogID = data.catalogid
        // refresh chart to blank
        let list = chart.getItems()
        let line = chart.getLines()
        console.log('清除画布前的所有item：', list)
        console.log('清除画布前的所有line：', line)
        // await this.clearChart()
        // this.refreshChart()
        this.$nextTick(async function () {
          // // new topo load from DB
          this.refreshChart()
          // await this.loadData(this.currentCatalogID)
          // // this.loadDataDemo()
          // await this.bindDragEvent()
        })
      },
      deep: true
    }
  },
  methods: {
    bindDragEvent () {
      let dragDeltaX, dragDeltaY, dragItem, $dragItem
      let items = d3.selectAll('.item-list .item')
      let drag = d3
        .drag()
        .on('start', function () {
          let mousePosition = d3.mouse(this)
          dragDeltaX = mousePosition[0]
          dragDeltaY = mousePosition[1]
          dragItem = this.cloneNode(true)
          document.getElementsByTagName('body')[0].append(dragItem)
          $dragItem = d3.select(dragItem)
          getItemPosition(
            $dragItem,
            d3.event.sourceEvent.x - dragDeltaX,
            d3.event.sourceEvent.y - dragDeltaY
          )
        })
        .on('drag', function () {
          getItemPosition(
            $dragItem,
            d3.event.sourceEvent.x - dragDeltaX,
            d3.event.sourceEvent.y - dragDeltaY
          )
        })
        .on('end', function () {
          let $container = document.getElementById('chart-container')
          let containerY = $container.getBoundingClientRect()
          // container的y坐标
          let offsetY = containerY.y
          let position = {
            x: d3.event.sourceEvent.x - dragDeltaX - $container.offsetLeft,
            y: d3.event.sourceEvent.y - dragDeltaY - $container.offsetTop - offsetY
          }
          console.log('调用了addItem,position=', position)
          // console.log('调用了addItem,d3.event.sourceEvent.y', d3.event.sourceEvent.y)
          // console.log('调用了addItem,dragDeltaY=', dragDeltaY)
          console.log('调用了addItem,$container.getBoundingClientRect=', $container.getBoundingClientRect())
          if (position.x > 0) {
            chart.addItem({
              x: position.x,
              y: position.y,
              name: $dragItem.attr('data-name'),
              type: $dragItem.attr('data-type')
            })
          }
          $dragItem.remove()
        })
      items.call(drag)

      let getItemPosition = function ($item, x, y) {
        $item.attr(
          'style',
          `position:absolute;transform:translate(${x}px, ${y}px)`
        )
      }
    },
    // 刷新画布为空白
    clearChart () {
      // console.log('refreshChart list=', list)
      for (var element in chart.list) {
        console.log('chart item list=', element, chart.list[element])
        this.itemDelete(chart.list[element])
      }
      return chart.list
    },
    async refreshChart () {
      console.log('清除画布前的chart.list', chart.list)
      await this.clearChart()
      await this.loadData(this.currentCatalogID)
      await this.bindDragEvent()
    },
    // 保存画布元素到数据库
    save () {
      let itemList = chart.getItems()
      // 存入数据库
      let items = {}
      let catalogid = this.currentCatalogID
      // for (let id in itemList) {
      //   catalogid = itemList[id].catalogid
      // }
      console.log('这次存储的catalogid：=', catalogid)
      console.log('这次存储的item列表：=', itemList)
      items.catalogid = catalogid
      items.itemdata = JSON.stringify(itemList)
      this.instance({
        url: 'topo/additem',
        method: 'post',
        data: items
      }).then(res => {
        console.log('数据库存储成功！', res)
      })
      // localStorage
      // localStorage.setItem('items', JSON.stringify(chart.getItems()))
    },
    // 从数据库中，导入站点的元素到当前画布
    async loadData (id) {
      let catalogid = id
      if (catalogid) {
        await this.clearChart()
        this.instance({
          url: 'topo/getitem/' + catalogid,
          method: 'get'
        }).then(res => {
          if (res.data.code === 1) {
            // 把数据库中的拓扑图保存到当前画布内存中
            chart.setItems((res.data.result.itemdata))
            console.log('从数据库catalog item ，获取返回成功！', res)
          } else {
            console.log('从数据库catalog item ,无数据！！！！！', res)
          }
        })
      } else {
        console.log('catalog id ,为空！！！！！')
      }
      // chart.setItems(JSON.parse(localStorage.getItem('items')))
    },
    loadDataDemo () {
      let l1 = chart.addItem({
        x: 85,
        y: 175,
        name: 'CUSTOM_DATA',
        type: 'INPUT'
      })
      let r1 = chart.addItem({
        x: 455,
        y: 100,
        name: 'EMAIL',
        type: 'ACTION'
      })
      let r2 = chart.addItem({
        x: 455,
        y: 250,
        name: 'EMAIL',
        type: 'ACTION'
      })
      l1.updateItem({
        text: '局端直流电源1',
        catalogid: '123456'
      })
      r1.updateItem({
        text: '远端直流电源1',
        catalogid: '123456'
      })
      r2.updateItem({
        text: '远端直流电源2',
        catalogid: '123456'
      })
      let line1 = chart._addLine(l1, 'output', r1, 'input')
      let line2 = chart._addLine(l1, 'output', r2, 'input')

      console.log('新建的_output', l1._output)
      console.log('新建的_input1', r1._input)
      console.log('新建的_input2', r2._input)
      console.log('新建的item1', l1)
      console.log('新建的item2', r1)
      console.log('新建的item3', r2)

      line1.updatePath()
      line1.path.classed('active', false)
      line1.targetPortType = 'input'
      line1.targetItem = r1
      line1.fromItem['inputIds'].add(line1.targetItem.id)
      line1.fromItem['inputPathIds'].add(line1.id)
      line1.targetItem['inputIds'].add(line1.fromItem.id)
      line1.targetItem['inputPathIds'].add(line1.id)
      chart.lineList[line1.id] = line1
      chart.drawingLine = false

      line2.updatePath()
      line2.path.classed('active', false)
      line2.targetPortType = 'input'
      line2.targetItem = r2
      line2.fromItem['inputIds'].add(line2.targetItem.id)
      line2.fromItem['inputPathIds'].add(line2.id)
      line2.targetItem['inputIds'].add(line2.fromItem.id)
      line2.targetItem['inputPathIds'].add(line2.id)
      chart.lineList[line2.id] = line2
      chart.drawingLine = false

      console.log('新建的line1', line1)
      console.log('新建的line2', line2)
    },
    itemDelete (item) {
      if (item) {
        console.log('当前要删除的item=', item)
        // console.log('删除后的item list：', list)
        // 删除D3中的item
        let allList = chart.delItem(item)
        console.log('删除D3后的的chart item list：', allList)
        // 删除chart中的item
        // del 关联的线
        // chart._onItemRemove(item)
      }
    },
    itemRemove () {
      if (chart.selectedItem) {
        let item = chart.selectedItem
        console.log('当前要删除的selected item=', item)
        // console.log('删除后的item list：', list)
        // 删除D3中的item
        chart.selectedItem.remove()
        console.log('删除D3中item后的chart item list：', chart.list)
        // 删除chart中的item
        console.log('当前要删除的item id=', item.id)
        delete chart.list[item.id]
        // let list = chart.delItem(selectedItem)
        console.log('删除chart中的item后的item list：', chart.list)
        // del 关联的线
        // chart._onItemRemove(selectedItem)
      }
    },
    onItemDblclick (item) {
      this.editItem = item
      this.dialog[item.name] = true
      console.log('双击了item：', item)
    },
    onCloseDialog (item) {
      this.dialog[item.name] = false
      console.log('编辑了item.data=', item.data)
      item.title = item.data.title
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.dialog-style .el_dialog__body{
  padding: 20px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-left: 20px;
  color: #606266;
  font-size: 14px;
}

.topo-container {
  width:  100%;
}

.toolbar {
  position: absolute;
  right: 10px;
  top: 10px;
}

#item-list-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 160px;
  border-right: 1px solid #ccc;
  background: #f3f3f3;
}

#chart-container {
  position: absolute;
  top: 0;
  left: 160px;
  bottom: 0;
  right: 0;
  overflow: hidden;
}

#topo-chart {
  cursor: crosshair;

  /deep/ .item {
    cursor: move;

    &.active .item-rect {
      stroke: #999;
      stroke-width: 1px;
      stroke-dasharray: 5px;
    }
  }

  /deep/ .item_label {
    font-size: 13px;
    fill: #fff;
    stroke-width: 0;
    user-select: none;
  }

  /deep/ .port {
    fill: #ddd;
    stroke: #999;
    stroke-width: 1;
    cursor: crosshair;
  }

  /deep/ .port-hovered {
    fill: #ff7f0e;
    stroke: #ff7f0e;
  }

  /deep/ .line {
    fill: none;
    stroke: #999;
    stroke-width: 3px;

    &.active {
      stroke: #ff7f0e;
    }
  }
}
</style>
