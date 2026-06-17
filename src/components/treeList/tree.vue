<template>
  <div class="dept">
    <el-tree
      ref="tree"
      :data="treeData"
      highlight-current
      :props="defaultProps"
      :default-expanded-keys="defaultExpanded"
      node-key="label"
      @node-click="handleNodeClick"
      :expand-on-click-node="true"
      :render-content="renderContent"
    >
    </el-tree>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import {GET_USER_INFO} from 'store/getters/type'

export default {
  data () {
    return {
      /* data: [
        {'catalogId': 58, 'parentId': -1, 'name': '一级目录1'},
        {'catalogId': 59, 'parentId': 58, 'name': '二级目录1'},
        {'catalogId': 60, 'parentId': 59, 'name': '三级目录1'},
        {'catalogId': 61, 'parentId': 59, 'name': '三级目录2'},
        {'catalogId': 62, 'parentId': 59, 'name': '三级目录3'},
        {'catalogId': 63, 'parentId': 59, 'name': '三级目录4'},
        {'catalogId': 64, 'parentId': 58, 'name': '二级目录2'},
        {'catalogId': 65, 'parentId': 64, 'name': '三级目录5'},
        {'catalogId': 66, 'parentId': 64, 'name': '三级目录6'},
        {'catalogId': 67, 'parentId': -1, 'name': '一级目录2'},
        {'catalogId': 68, 'parentId': 67, 'name': '二级目录3'}
      ], */
      data: [
        {'catalogId': 1, 'parentId': -1, 'name': '站点设备树'},
        {'catalogId': 58, 'parentId': 1, 'name': '棋盘梁隧道1'},
        {'catalogId': 59, 'parentId': 58, 'name': '南向局端直流电源1'},
        {'catalogId': 60, 'parentId': 59, 'name': '南向远端1'},
        {'catalogId': 61, 'parentId': 59, 'name': '南向远端2'},
        {'catalogId': 62, 'parentId': 59, 'name': '南向远端3'},
        {'catalogId': 63, 'parentId': 59, 'name': '南向远端4'},
        {'catalogId': 64, 'parentId': 58, 'name': '北向局端直流电源2'},
        {'catalogId': 65, 'parentId': 64, 'name': '北向远端1'},
        {'catalogId': 66, 'parentId': 64, 'name': '北向远端2'},
        {'catalogId': 67, 'parentId': 1, 'name': '太子城隧道2'},
        {'catalogId': 68, 'parentId': 67, 'name': '局端交流电源1'}
      ],
      treeData: [],
      defaultExpanded: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapGetters({
      // get_user_info: GET_USER_INFO,
    })
  },
  created () {
    this.$nextTick(function () {
      // this.actionGetCatalog()
      this.refresh()
    })
  },
  methods: {
    ...mapActions([
      'TreeChange',
      'setInitData'
    ]),
    refresh () {
      this.$ajax.get('http://power.ieyeplus.com:7001/' + 'localall')
        .then((res) => {
          console.log('从数据库读取的catalog数据=', res.data)
          // let data = res.data
          this.treeData = this.actionGetCatalog(res.data)
          // this.treeData = this.actionGetCatalog(this.data)
          let data = this.treeData
          // this.data = data
          console.log(data[0]['label'])
          // 初始化树对象
          this.TreeChange({data: data[0], node: {}})
            .then((res) => {})
          //  循环出默认展开项的ID
          for (let i in data) {
            this.defaultExpanded.push(data[i]['label'])
          }
          this.$nextTick(() => {
            this.$refs.tree.$children[0].$el.className = this.$refs.tree.$children[0].$el.className + ' ' + 'is-current'
          })
        })
    },
    handleNodeClick (data, node, event) {
      console.log('node click 事件.................................')
      console.log(node.id, data.label)
      if (event) { // 判断点击的是否为默认选中的树节点，如果不是，取消默认选中
        if (node.id !== this.$refs.tree.$children[0].node.id) {
          this.$refs.tree.$children[0].$el.className = 'el-tree-node'
        }
      }
      // 提交树对象，以及当前点击树菜单的数据至仓库
      this.$emit('click')
      this.TreeChange({data, node})
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>)
    },
    actionGetCatalog (data) {
      let tree = []
      console.log('actionGetCatalog!')
      /* 把"name"换成"label"
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].name
        delete data[i].name
      } */
      console.log('原始data', data)
      tree = this.getJsonTree(data, {
        id: 'catalogid',
        pid: 'parentid',
        children: 'children'
      })
      console.log('生成树data:')
      console.log(tree)
      return tree
    },
    getJsonTree (data, config) {
      let id = config.id || 'id'
      let pid = config.pid || 'pid'
      let children = config.children || 'children'
      let idMap = []
      let jsonTree = []
      data.forEach(function (v) {
        idMap[v[id]] = v
      })
      data.forEach(function (v) {
        let parent = idMap[v[pid]]
        if (parent) {
          !parent[children] && (parent[children] = [])
          parent[children].push(v)
        } else {
          jsonTree.push(v)
        }
      })
      // 循环遍历给tree加图标
      this.treeAddIcon(jsonTree)
      return jsonTree
    },
    treeAddIcon (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children) {
          // icon来自阿里巴巴矢量图标库http://iconfont.cn
          data[i].icon = 'iconfont icon-wenjianjia'
          this.treeAddIcon(data[i].children)
        } else {
          data[i].icon = 'iconfont icon-wenjian'
        }
      }
    }
  }

}
</script>
<style scoped>
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background:#313439;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin-left: 5px;
  }
.operation{
    float:right;
}
i {
    margin:0px 5px;
}
</style>
