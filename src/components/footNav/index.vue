<template>
  <div class="bottomTools">
    <div class="userInfo">
      <div class="userName">
        <span>Hi {{username}}<a @click="logout()"> [退出]</a>
          <a v-if="showSetting" @click="setting()"><i class="fa fa-cogs"></i>配置管理</a>
          <a @click="$router.go(0)"><i class="fa fa-refresh"></i>刷新页面</a>
          &nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp; v0.1.6 2026.0618
        </span>
      </div>
    </div>
    <audio id="music"></audio>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {GET_USER_INFO} from '@/store/getters/type'
import {SET_USER_INFO} from '@/store/actions/type.js'
export default {
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showSetting: false
    }
  },
  created () {
    let userType = this.get_user_info.user.usertype
    if (userType >= 1) {
      this.showSetting = false
    } else this.showSetting = true
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO
    })
  },
  watch: {
  },
  methods: {
    ...mapActions({
      set_user_info: SET_USER_INFO
    }),
    logout () {
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--primary',
        type: 'warning'
      }).then(() => {
        this.$message.success('退出成功')
        this.set_user_info({
          user: null,
          powerData: null,
          login: false
        })
        setTimeout(this.$router.replace({name: 'login'}), 500)
      }).catch(() => {
        this.$message.success('退出取消')
      })
    },
    setting () {
      this.$router.push('/setting')
    }
  }
}
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
  .audio-inline {
    li {
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
  }
</style>
