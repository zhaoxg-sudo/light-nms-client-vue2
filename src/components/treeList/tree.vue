<template>
  <div class="dept">
    <el-tree
      ref="tree"
      :data="treeData"
      highlight-current = "false"
      :props="defaultProps"
      :default-expanded-keys="defaultExpanded"
      node-key="label"
      @node-click="handleNodeClick"
      @mouseleave="clearTreeFocus"
      :tabindex="null"
      :expand-on-click-node="true"
      :render-content="renderContent"
    >
    </el-tree>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {GET_USER_INFO} from '@/store/getters/type.js'

export default {
  data () {
    return {
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
      userType: '',
      userOrg: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      instance: this.$ajax.create({
        baseURL: 'http://123.57.87.144:7001/'
      })
    }
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO
    }),
    // 实时从vuex读取用户信息
    currentUser () {
      return this.get_user_info.user
    }
  },
  watch: {
    // 监听用户对象变化；退出登录/切换账号，自动重载树
    currentUser: {
      handler (newUser) {
        if (!newUser) {
          // 用户为空(退出登录)，清空树
          this.treeData = []
          this.defaultExpanded = []
          return
        }
        this.userType = newUser.usertype
        this.userOrg = newUser.userorg
        // 先清空旧展开列表，避免残留
        this.defaultExpanded = []
        this.refresh()
      },
      deep: true,
      immediate: true // 首次进入页面立刻加载一次树
    }
  },
  methods: {
    ...mapActions([
      'TreeChange',
      'setInitData'
    ]),
    clearTreeFocus () {
      document.body.focus()
      if (document.activeElement) {
        document.activeElement.blur()
      }
      document.querySelectorAll('.el-tree-node:focus-within').forEach(el => {
        el.blur()
      })
    },
    refresh () {
      let items = {}
      items.usertype = this.userType
      items.userorg = this.userOrg
      this.instance({
        url: 'localrelative',
        method: 'post',
        data: items
      }).then((res) => {
        console.log('从数据库读取的catalog数据=', res.data)
        this.treeData = this.actionGetCatalog(res.data)
        let data = this.treeData
        console.log(data[0]['label'])
        this.TreeChange({data: data[0], node: {}})

        for (let i in data) {
          this.defaultExpanded.push(data[i]['label'])
        }
        this.TreeChange({data: data[0], node: this.$refs.tree.$children[0]})
        this.$nextTick(() => {
          this.$refs.tree.$children[0].$el.className = this.$refs.tree.$children[0].$el.className + ' ' + 'is-current'
        })
      }).catch(err => {
        console.error('localrelative请求异常', err)
      })
    },
    handleNodeClick (data, node, event) {
      setTimeout(() => {
        document.body.focus()
        document.activeElement.blur()
      }, 0)
      console.log('node click 事件.................................')
      console.log(node.id, data.label)
      if (event) {
        if (node.id !== this.$refs.tree.$children[0].node.id) {
          this.$refs.tree.$children[0].$el.className = 'el-tree-node'
        }
      }
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
      this.treeAddIcon(jsonTree)
      return jsonTree
    },
    treeAddIcon (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children) {
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
<style lang="scss" scoped>
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
::v-deep .el-tree {
  background: transparent !important;
}

::v-deep .el-tree-node__expand-icon:focus,
::v-deep .el-tree-node__expand-icon:focus-visible {
  outline: none !important;
  outline-offset: 0;
}

::v-deep .el-tree-node *:focus,
::v-deep .el-tree-node *:focus-visible {
  outline: 0 !important;
  box-shadow: none !important;
}

::v-deep .el-tree-node.is-current > .el-tree-node__content {
  background: transparent !important;
}
::v-deep .el-tree-node__content:hover {
  background: transparent !important;
}
</style>
