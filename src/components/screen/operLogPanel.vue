<template>
  <el-dialog
    title="操作日志"
    :visible.sync="visible"
    width="78%"
    max-width="1100px"
    top="70px"
    :close-on-click-modal="false"
    @close="handleClose"
    custom-class="dark-dialog"
  >
    <!-- 查询表单 -->
    <el-form :model="query" inline ref="queryForm">
      <el-form-item label="用户名">
        <el-input v-model="query.user_name" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户组织">
        <el-input v-model="query.user_org" placeholder="请输入用户组织" clearable></el-input>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          ref="dateRef"
          v-model="query.timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          clearable
          @change="handleDateChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchList">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 日志表格 -->
    <el-table
      ref="logTable"
      :data="tableData"
      border
      stripe
      style="width:100%;margin-top:6px;"
      :max-height="tableMaxHeight"
      class="dark-table"
    >
      <!-- <el-table-column label="ID" prop="id" width="70"></el-table-column> -->
      <el-table-column label="用户名" prop="user_name" width="120"></el-table-column>
      <el-table-column label="用户组织" prop="user_org" width="140"></el-table-column>
      <el-table-column label="操作类型" prop="oper_type" width="90"></el-table-column>
      <el-table-column label="操作描述" prop="oper_desc"></el-table-column>
      <el-table-column label="请求地址" prop="request_url"></el-table-column>
      <el-table-column label="客户端IP" prop="local_inner_ips" width="140"></el-table-column>
      <el-table-column
        label="操作时间"
        prop="oper_time"
        width="180"
        :formatter="formatTime"
      ></el-table-column>
      <el-table-column label="状态" prop="status" width="100" align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status === 1"
            type="success"
            size="mini"
            effect="dark"
          >成功</el-tag>
          <el-tag
            v-else
            type="danger"
            size="mini"
            effect="dark"
          >失败</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
   <el-pagination
      :key="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.page"
      :page-sizes="[10,20,50,100]"
      :page-size="page.page_size"
      :page-count="Math.ceil(page.total / page.page_size)"
      pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      style="margin-top:12px;text-align:right;"
      class="dark-pagination"
><span slot="total">共 {{ page.total }} 条，共 {{ Math.ceil(page.total / page.page_size) }} 页</span>
</el-pagination>
  </el-dialog>
</template>

<script>
export default {
  name: 'OperLogPanel',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      query: {
        user_name: '',
        user_org: '',
        timeRange: []
      },
      tableData: [],
      tableMaxHeight: null,
      page: {
        page: 1,
        page_size: 10,
        total: 0
      }
    }
  },
  created () {
    this.instance = this.$ajax.create({
      baseURL: this.$appHost
    })
  },
  computed: {
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchList()
      } else {
        this.tableData = []
        this.tableMaxHeight = null
      }
    }
  },
  methods: {
    // 选中日期后关闭
    handleDateChange () {
      // 调用组件内部关闭弹窗方法
      if (this.$refs.dateRef) {
        this.$refs.dateRef.handleClose()
      }
    },
    formatTime (row, column, cellValue) {
      if (!cellValue) return ''
      const d = new Date(cellValue)
      if (isNaN(d.getTime())) return cellValue
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
    },
    calcTableHeight () {
      // 少于10条，清空max-height，自动撑开，无滚动条
      if (this.tableData.length < 10) {
        this.tableMaxHeight = null
        return
      }
      this.$nextTick(() => {
        const tableDom = this.$refs.logTable
        if (!tableDom || !tableDom.$el) return
        const headerDom = tableDom.$el.querySelector('.el-table__header-wrapper')
        const rowDomList = tableDom.$el.querySelectorAll('.el-table__body-wrapper .el-table__row')
        if (!headerDom || rowDomList.length === 0) return

        const headerH = headerDom.offsetHeight
        // 只取第一条行高，所有行高度一致，不需要循环累加
        const rowSingleH = rowDomList[0].offsetHeight
        // 10行总高度，减1px修正边框导致滚动条提前出现
        const bodyH = rowSingleH * 10 - 1
        this.tableMaxHeight = headerH + bodyH
      })
    },
    async fetchList () {
      const params = {
        user_name: this.query.user_name,
        user_org: this.query.user_org,
        page: this.page.page,
        page_size: this.page.page_size
      }
      if (this.query.timeRange && this.query.timeRange.length === 2) {
        params.startTime = this.query.timeRange[0]
        params.endTime = this.query.timeRange[1]
      }
      const res = await this.instance.get('/log/list', { params })
      console.log('fetchList收到应答！', res)
      if (res.data.code === 200) {
        this.tableData = res.data.data.records
        // 使用 $set 保证响应式更新
        const totalVal = Number(res.data.data.total)
        this.$set(this.page, 'total', totalVal)
        this.calcTableHeight()
      }
    },
    resetQuery () {
      this.query = {
        user_name: '',
        user_org: '',
        timeRange: []
      }
      this.page.page = 1
      this.fetchList()
    },
    handleSizeChange (val) {
      this.page.page_size = val
      this.fetchList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.fetchList()
    },
    handleClose () {
      this.tableData = []
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style>
body .dark-dialog {
  background-color: #0f1b33 !important;
}
body .dark-dialog .el-dialog__header {
  border-bottom: 1px solid #223b66 !important;
  background-color: #0f1b33 !important;
}
body .dark-dialog .el-dialog__title {
  color: #40c9ff !important;
  font-size:18px;
}
body .dark-dialog .el-dialog__headerbtn .el-dialog__close {
  color:#fff !important;
}
body .dark-dialog .el-dialog__body {
  background-color: #0f1b33 !important;
  color: #fff !important;
  padding: 20px !important;
}
body .dark-dialog .el-form-item__label {
  color:#fff !important;
}
body .dark-dialog .el-input__inner {
  background:#1a2b48 !important;
  border-color:#334b75 !important;
  color:#fff !important;
}
body .dark-dialog .el-input__inner:focus {
  border-color:#40c9ff !important;
}
body .dark-dialog .el-input__inner::placeholder {
  color: #87a8d0 !important;
}
body .dark-dialog .el-input__inner::-webkit-input-placeholder {
  color: #87a8d0 !important;
}
body .dark-dialog .el-date-editor .el-input__inner {
  background:#1a2b48 !important;
  border-color:#334b75 !important;
  color:#fff !important;
}
body .dark-dialog .el-date-editor .el-icon-date {
  color: #b0c4de !important;
}
body .dark-dialog .el-date-editor--datetimerange .el-range-separator {
  color: #b0c4de !important;
}
body .dark-dialog .el-range-input {
  background:#1a2b48 !important;
  border-color:#334b75 !important;
  color:#fff !important;
}
body .dark-dialog .el-range-input::placeholder {
  color:#87a8d0 !important;
}
body .dark-dialog .el-table {
  background:#0f1b33 !important;
  color:#fff !important;
}
body .dark-dialog .el-table th {
  background:#182b4a !important;
  color:#40c9ff !important;
}
/* 普通行 td */
body .dark-dialog .el-table__body tr.el-table__row td {
  background-color: #0f1b33 !important;
  border-color:#223b66 !important;
  color:#fff !important;
}
/* 斑马纹行 td，解决白色单元格 */
body .dark-dialog .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #142440 !important;
  border-color:#223b66 !important;
  color:#fff !important;
}
body .dark-dialog .el-table__empty-text {
  color: #b0c4de !important;
}
/* hover悬浮行 */
body .dark-dialog .el-table__body tr.el-table__row:hover > td {
  background-color: #182b4a !important;
}
body .dark-dialog .el-pagination {
  color:#fff !important;
}
body .dark-dialog .el-pagination button {
  background:#1a2b48 !important;
  border-color:#334b75 !important;
  color:#fff !important;
}
body .dark-dialog .el-pagination button:hover {
  border-color:#40c9ff !important;
  color:#40c9ff !important;
}
body .dark-dialog .el-pagination .el-input__inner {
  background:#1a2b48 !important;
  border-color:#334b75 !important;
  color:#fff !important;
}
body .dark-dialog .el-pagination__total,
body .dark-dialog .el-pagination__jump {
  color: #b0c4de !important;
}
body .dark-dialog .el-button--primary {
  background-color: #145799 !important;
  border-color: #2879c9 !important;
}
body .dark-dialog .el-button--default {
  background-color: #1a2b48 !important;
  border-color:#334b75 !important;
  color:#fff !important;
}
body .dark-dialog .el-button--default:hover {
  border-color:#40c9ff !important;
  color:#40c9ff !important;
}
.text-success {
  color: #67c23a;
}
.text-danger {
  color: #f56c6c;
}
/* 日期选择器弹出面板深色（挂载body，单独处理） */
body .el-picker-panel {
  background: #0f1b33 !important;
  border:1px solid #223b66 !important;
}
body .el-picker-panel .el-date-picker__header-label {
  color:#fff !important;
}
body .el-picker-panel .el-date-table th {
  color:#87a8d0 !important;
}
body .el-picker-panel .el-date-table td {
  color:#fff !important;
}
body .el-picker-panel .el-date-table td.available:hover {
  background:#182b4a !important;
}
body .el-picker-panel .el-picker-panel__footer .el-button--text {
  color:#40c9ff !important;
}
/* 日期面板 选中日期、hover 增强 */
body .el-picker-panel .el-date-table td.current:not(.disabled) .cell {
  background: #40c9ff !important;
  color: #000 !important;
}
body .el-picker-panel .el-date-table td .cell:hover {
  background: #223b66 !important;
}
/* 弹窗右上角关闭hover */
body .dark-dialog .el-dialog__headerbtn:hover .el-dialog__close {
  color: #40c9ff !important;
}
body .dark-dialog .el-pagination .el-pager li {
  background:#1a2b48 !important;
  border-color:#334b75 !important;
  color:#fff !important;
}
body .dark-dialog .el-pagination .el-pager li.active {
  background-color:#40c9ff !important;
  color:#000 !important;
  border-color:#40c9ff !important;
}
body .dark-dialog .el-pagination .el-pager li:not(.active):hover {
  border-color:#40c9ff !important;
  color:#40c9ff !important;
}
/* 日期弹层底部容器 */
/* 日期面板footer背景 */
.el-picker-panel__footer {
  background: #0f1b33 !important;
  border-top: 1px solid #223b66 !important;
}
/* 取消按钮（第一个link-btn） */
.el-picker-panel__footer .el-picker-panel__link-btn:first-child {
  background: transparent !important;
  border: none !important;
  color: #ccc !important;
}
.el-picker-panel__footer .el-picker-panel__link-btn:first-child:hover {
  color: #fff !important;
  background: rgba(255,255,255,0.08) !important;
}
/* 确定按钮（第二个link-btn）蓝色填充 */
.el-picker-panel__footer .el-picker-panel__link-btn:last-child {
  background: #145799 !important;
  border: 1px solid #2879c9 !important;
  color: #fff !important;
  padding: 4px 14px !important;
  border-radius: 3px !important;
}
.el-picker-panel__footer .el-picker-panel__link-btn:last-child:hover {
  background: #1a6bbd !important;
  border-color: #40c9ff !important;
}
/* ===================== ✅ 修复区间中间日期文字（直接选中.cell） ===================== */
body .el-picker-panel .el-date-table td.in-range {
  background-color: #223b66 !important;
}
body .el-picker-panel .el-date-table td.in-range .cell {
  color: #ffffff !important;
}
/* 区间首尾圆形起点终点 */
body .el-picker-panel .el-date-table td.start-date .cell,
body .el-picker-panel .el-date-table td.end-date .cell {
  background-color: #40c9ff !important;
  color: #000 !important;
  font-weight: bold !important;
}
/* hover区间内单元格 */
body .el-picker-panel .el-date-table td.in-range:hover {
  background-color: #2b4880 !important;
}
body .el-picker-panel .el-date-table td.in-range:hover .cell {
  color: #fff !important;
}
/* ============================================================================ */
</style>
