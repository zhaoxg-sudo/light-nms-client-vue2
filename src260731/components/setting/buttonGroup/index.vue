<template>
  <el-form class="query-form" v-if="btns['新增'] || btns['编辑'] || btns['删除']">
    <el-button type="primary"  size="small"  icon="plus" v-if="btns['新增'] " :disabled="!AddDis"  @click="edits(0)">新增</el-button>
    <span v-if="EditShow">
      <el-button  type="primary" size="small"  icon="edit" v-if="btns['编辑'] "  @click="edits(1)">编辑</el-button>
    </span>
    <el-button
      v-if="btns['删除']"
      type="primary"
      icon="delete"
      size="small"
      :disabled="batchSelectArr.length === 0"
      @click="batchDeletes(self, btnGroupData.batchApi, btnGroupData.keyID, batchSelectArr , btnGroupData.updateState)"
      >
      <span>删除</span>
    </el-button>
  </el-form>
</template>

<script>
  import { mapGetters,mapActions } from 'vuex'

  export default {
    props: {
      EditShow: {
        type: Boolean,
        default: true
      },
      AddDis: {
        type: Boolean,
        default: true
      },
      tolead: {
        type: Boolean,
        default: false
      },
      btnGroupData: {
        batchApi: '',
        keyID: '',
        updateState: {
          type: Number,
          default: 2
        }
      },
      btns: {
        type: Object,
        default: function () {
          return {}
        }
      },
      batchSelectArr: {
        type: Array,
        default: function () {
          return []
        }
      },
    },
    computed: {
      ...mapGetters({
        TreeData: 'TreeData'
      }),
    },

    data() {
      return {
        self: this,
      }
    },

    methods: {
      edits(val) {
          debugger
        this.$emit('edits', val)
      }
    }
  }
</script>

<style scoped>

</style>
