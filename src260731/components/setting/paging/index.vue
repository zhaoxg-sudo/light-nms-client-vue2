<template>
  <div class="bottom-toolbar ofh">
    <el-row>
      <el-col :span="24">
        <div class="fr">
          <el-pagination
            @size-change="handleSize"
            @current-change="handleCurrent"
            :current-page.sync="pageData.pageIndex"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageData.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="pageData.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
  // 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters([
      'pageData'
    ])
  },
  created () {
    // 监听路由变化, 重置分页参数
    this.$store.state.pageData = {
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  methods: {
    ...mapActions([
      'handleCurrent',
      'handleSize'
    ])
  }
}
</script>

<style scoped>

</style>
