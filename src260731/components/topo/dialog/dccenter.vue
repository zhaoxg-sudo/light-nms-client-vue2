<template>
  <el-dialog
    custom-class="topo-dialog"
    :close-on-click-modal="false"
    :title="`编辑 ${name[item.name]}`"
    :visible="dialogVisible"
    @close="onClose"
    width="580px"
    append-to-body
  >
    <el-form
      :model="form"
      :rules="rules"
      label-width="120px"
      ref="data"
      size="medium"
    >
      <el-form-item label="站点显示名称" prop="title">
        <el-input
          v-model="form.title"
          auto-complete="off"
          placeholder="必填"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import { name } from '../enum'

export default {
  props: ['item'],
  data () {
    return {
      form: _.cloneDeep(this.item.data) || {},
      name: name,
      dialogVisible: true,
      rules: {
        title: [
          { required: true, message: '站点名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onConfirm () {
      this.item.data = this.form
      this.onClose()
    },
    onClose () {
      this.dialogVisible = false
      this.$emit('on-close', this.item)
      this.item.updateItem({
        text: this.form.title
      })
    }
  }
}
</script>
