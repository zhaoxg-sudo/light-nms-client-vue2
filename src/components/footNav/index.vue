<template>
  <div class="bottomTools">
    <div class="userInfo">
      <div class="userName">
        <span>Hi {{username}}<a @click="logout()"> [退出]</a>
          <a v-if="showSetting" @click="setting()"><i class="fa fa-cogs"></i>配置管理</a>
          <a @click="$router.go(0)"><i class="fa fa-refresh"></i>刷新页面</a>
          &nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp; v0.3.0 2026.1026 unknown
        </span>
      </div>
    </div>
    <audio id="music">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {GET_USER_INFO} from '@/store/getters/type'
import {SET_USER_INFO} from '@/store/actions/type.js'
export default {
  // ========= 删除原来的 username props =========
  props: {
  },
  data () {
    return {
      showSetting: false
    }
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO
    }),
    // 实时从vuex获取用户名
    username () {
      if (!this.get_user_info.user) return ''
      return this.get_user_info.user.username || ''
    }
  },
  watch: {
    // 监听用户对象变化，登录/切换账号自动更新按钮权限
    'get_user_info.user': {
      handler (newUser) {
        if (!newUser) {
          this.showSetting = false
          return
        }
        let userType = newUser.usertype
        if (userType >= 1) {
          this.showSetting = false
        } else {
          this.showSetting = true
        }
      },
      deep: true,
      immediate: true // 首次加载自动执行一次
    }
  },
  methods: {
    ...mapActions({
      set_user_info: SET_USER_INFO
    }),
    async logout () {
      try {
        await this.$confirm('此操作将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--primary',
          type: 'warning'
        })
        this.$message.success('退出成功')
        this.set_user_info({
          user: null,
          powerData: null,
          poweredID: [], // 清空权限id列表！
          login: false
        })
        setTimeout(() => {
          this.$router.replace({name: 'login'})
        }, 500)
      } catch (error) {
        this.$message.info('退出取消')
      }
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
