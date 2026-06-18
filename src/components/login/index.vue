<template>
  <div>
    <!-- 背景层 -->
    <div id="container">
      <div id="anitOut" class="anitOut">
      </div>
    </div>
    <!-- 登录框  -->
    <div class="login">
      <div class="loginLogo">
        <img src="../../assets/img/logo.fw.png" />
      </div>
      <div  class="userImg">
        <img src="../../assets/img/ouba.jpg" />
      </div>
      <div class="userInfoInput">
        <form class="form-horizontal" >
          <div class="form-group" prop="account">
            <div class="col-sm-12">
              <input type="text" class="form-control" v-model="formData.account" :autofocus="true" placeholder="请输入用户名">
            </div>
          </div>
          <div class="form-group" prop="password">
            <div class="col-sm-12">
              <input type="password" class="form-control" v-model="formData.password" placeholder="请输入密码">
            </div>
          </div>
          <div class="form-group">
            <div class=" col-sm-12">
              <div class="checkbox">
                <label>
                  <input type="checkbox" v-model="rememberPassword" @click="(() => { rememberPassword = !rememberPassword })"> 记住密码
                </label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class=" col-sm-12">
              <button type="button" class="btn btn-primary btn-block" @click="submitFrom">登 录</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {mapActions} from 'vuex'
import {SET_USER_INFO} from '@/store/actions/type.js'
export default {
  data () {
    return {
      formData: {
        account: '',
        password: ''
      },
      rememberPassword: false,
      instance: this.$ajax.create({
        baseURL: this.$appHost
      })
    }
  },
  created () {
    this.$nextTick(function () {
      if (!window.ActiveXObject && !!document.createElement('canvas').getContext) {
        $.getScript('/static/cav.js',
          function () {
            $.getScript('/static/getStart.js')
          })
      }
    })
  },
  methods: {
    ...mapActions({
      set_user_info: SET_USER_INFO
    }),
    submitFrom () {
      if (this.formData.account === '') {
        this.showTip('用户名不能为空')
        return
      }
      if (this.formData.password === '') {
        this.showTip('密码不能为空')
        return
      }
      this.instance({
        'url': '/user/login',
        data: this.formData,
        'method': 'post'
      }).then((res) => {
        if (res.data.code === 1) {
          let userData = res.data.result
          console.log('用户登陆', userData[0])
          this.set_user_info({
            user: userData[0],
            userOrg: res.data.result.userorg,
            powerData: null,
            login: true
          })
          this.showTip('登录成功')
          setTimeout(this.$router.push({path: '/'}), 2000)
        } else {
          this.showTip('账号或密码错误')
        }
      })
    },
    showTip (tipContent) {
      this.$message.success(tipContent)
    }
  }
}

</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
  .userImg { float: none;  img { margin: 0  auto } } .login { width: 350px; position: absolute; top:50%; left:50%; -webkit-transform:
  translateX(-50%) translateY(-50%); -moz-transform: translateX(-50%) translateY(-50%); -ms-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%); background: rgba(0,0,0,0.7); border-radius: 5px; .userInfoInput{ padding:0px
  20px 20px 20px; } .userImg{ width:80px; height:80px; border-radius:100%; background-color:#1184b0; padding:2px; margin:20px auto; img{width:76px;height:76px;border-radius:100%;}}
    .loginLogo{ width:80%; margin:15px auto; img{width:100%;} } }
</style>
