<template>
  <!--新增（修改）机构-->
  <div class="popUp" :visible.sync="dialogFormVisible" :before-close="update">
    <div class="popContent">
      <el-form class="form-horizontal" :model="formData" ref="formData" :rules="rules">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label" >上级机构</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" disabled="disabled" v-model="formData.ParentName" :disabled="true">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">机构名称</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model.trim="formData.OrgName" :maxlength="28">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">排列序号</label>
              <div class="col-sm-8">
                <div class="el-input-number" placeholder="请输入内容">
                  <div class="el-input">
                    <el-input-number autocomplete="off" v-model="formData.SortIndex" type="text" rows="2" validateevent="true" class="form-control"></el-input-number>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">机构编号</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model.trim="formData.OrgCode" @blur="checkCode(org.orgCode)">
              </div>
              <div>
                <span v-if="!ckIsNumber||!ckLength" style="color: red">机构编码必须为四位数字!</span>
                <span v-if="!ckCode" style="color:red">机构编号重复!</span>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btnDiv">
      <!-- :loading="on_submit_loading" :disabled="!ckCode||!ckIsNumber|| !ckLength" -->
      <button type="button" class="btn btn-sm btn-info"  @click="submitFrom(self, modalType, 'Organization/Create', 'Organization/Edit', formData)">确定</button>
      <button type="button" class="btn btn-sm btn-default" @click="update">取消</button>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    orgData: { // 表单提交所需要的数据，例如parentID
      type: Object,
      request: true
    },
    modalType: { // 弹窗类型: 0为新增, 1为编辑
      type: Number,
      request: true
    }
  },
  data () {
    return {
      formData: {
        ParentID: '',
        OrgCode: '',
        OrgName: '',
        SortIndex: 0
      },
      parent: {
        orgId: '',
        orgName: ''
      },
      pid: 0,
      self: this,
      curCode: '',
      ckCode: true,
      ckLength: true,
      ckIsNumber: true,
      isHasOrgName: true,
      isHasOrgCode: true,
      load_data: false,
      title: '',
      on_submit_loading: false,
      rules: {
        orgName: [{ required: true, message: '机构名称不能为空' }, { validator: this.defenseSQL }],
        orgCode: [{ required: true, message: '机构编码不能为空' }, { validator: this.defenseSQL }],
      }
    }
  },
  created () {
    if (this.modalType === 0) {
      this.formData.ParentID = this.orgData.OrganizationID
      this.formData.ParentName = this.orgData.OrgName
    } else {
      this.$ajax.get(`Organization/Detail/${this.orgData.orgId}`)
        .then((res) => {
          if (res.data.code === 1) {

            this.formData = res.data.result
          }
        })
    }
  },
  computed: {
    ...mapGetters({
      LoginId: 'LoginId',
      dialogFormVisible: 'dialogFormVisible'
    })
  },
  methods: {
    ...mapActions([
      'update'
    ]),
    submitForm () {
      if (this.modalType === 0) {
        this.$ajax.post('Organization/Create', this.formData)
          .then((res) => {
            if (res.data.code === 1) {
              this.$message.success('新增机构成功')
              this.$store.dispatch('update', 2)
            }
          })
      } else {

      }
    },
    subtract () {
      debugger
      if (this.formData.sortIndex > 0) {
        this.formData.sortIndex = this.formData.sortIndex--
      }
    },
    checkCode (orgCode) {
      if (!orgCode) {
        return false;
      }
      var orgTest = /^\+?[0-9][0-9]*$/;
      if (orgTest.test(orgCode)) {
        this.ckIsNumber = true;
      } else {
        this.ckIsNumber = false;
      }
      if (orgCode.length != 4) {
        this.ckLength = false;
      } else {
        this.ckLength = true;
      }
      var $this = this;

      $this.$AjaxGet('Organization/List', {

        orgCode: orgCode
      }, function (ret) {
        if ($this.data.orgId == undefined) {
          if (ret.code == 1) {
            if (ret.result.length > 0) {

              $this.ckCode = false;
            } else {
              $this.ckCode = true;

            }
          } else {
            $this.ckCode = true;
          }
        } else {
          if ($this.curCode == orgCode) {
            $this.ckCode = true;
          } else {
            if (ret.code == 1) {
              if (ret.result.length > 0) {

                $this.ckCode = false;
                //$this.$set('org.OrgCode', '');
              } else {
                $this.ckCode = true;

              }
            } else {
              $this.ckCode = true;
            }
          }
        }
      });
    }
  }
}
</script>
