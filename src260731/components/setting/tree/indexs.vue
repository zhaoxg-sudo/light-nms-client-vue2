<template>
  <div >
    <el-tree
      ref="tree"
      :data="data"
      :props="defaultProps"
      :highlight-current="true"
      :node-key="lable.defaultId"
      :default-expanded-keys="defaultData"
      @node-click="handleNodeClick"
      :render-content="renderContent"
    >
    </el-tree>
  </div>
</template>

<script>
  import { mapGetters,mapActions } from 'vuex'
  import bus from 'assets/js/eventBus'

  export default {
    props: {
      addr: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        default: ''
      },
      lable:{
        defaultId: {
          type: String,
          default: ''
        },
        treeName: {},
      },
      isDataManage: {
        type: false,
        default: Boolean
      },
      shows: {
        type: Boolean,
        default: true
      }
    },
    created() {
      this.$nextTick(function() {
        this.refresh();
      })
    },
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'Children',
          label: this.lable.treeName
        },
        defaultData:[]
      };
    },
    computed: {
      ...mapGetters({
        TreeData: 'TreeData',
        TreeObj: 'TreeObj'
      }),
    },
    methods: {
      ...mapActions([
        'TreeChange',
      ]),
      renderContent(h, { node, data, store }){
        if(this.isDataManage) {
          if(node.level == 1) {
            return (
              <span>
              <span style="margin-left: 20px;font-size: 14px;">{data[this.lable.treeName]}</span>
            </span>
            )
          }else {
            if(data.BaseDataModuleName != null) {
              return (
                <span>
                <span style="margin-left: 20px;font-size: 14px;">{data.BaseDataModuleName}</span>
              </span>
              )
            }
          }
        }else {
          return (
            <span>
              <span style="margin-left: 20px;font-size: 14px;">{data[this.lable.treeName]}</span>
            </span>
          )
        }
      },
      refresh(initData) {
        let treeName = this.lable.treeName
        let treeID = this.lable.defaultId
        debugger
        this.$AjaxGet(this.addr, this.id, function(ret) {
            debugger

          if(ret.result != null) {
            let result = ret.result;
            if(ret.code != 0) {
              this.data = result;
              console.log(result)
              this.$nextTick(()=> {
                this.$refs.tree.$children[0].$el.className = this.$refs.tree.$children[0].$el.className + ' ' + 'is-current'
              })
              for (let i in result) {
                this.defaultData.push(result[i][treeID]);
                if (initData) {
                  if (initData[treeID]) {
                    this.defaultData.push(initData[treeID])
                    this.$emit('initData', initData[treeID]);
                  } else {
                    this.defaultData.push(initData.ParentID)
                    this.$emit('initData', initData.ParentID);
                  }
                } else {
                  if (treeName != "DicName") {
                    this.$emit('initData', result[0]);
                  } else {
                    this.$emit('initData', result);
                  }
                }
              }
            }
          }
        }.bind(this));
      },
      handleNodeClick(data, node, event){
        if(event) {                           // 判断点击的是否为默认选中的树节点，如果不是，取消默认选中
          if(node.id != this.$refs.tree.$children[0].node.id) {
            this.$refs.tree.$children[0].$el.className = 'el-tree-node'
          }
        }
        // 存入当前点击树菜单的 data
        this.TreeChange({data, node})

      }
    }
  }
</script>

<style >

</style>
