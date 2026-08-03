<template>
  <div>
    <header>
      <div class="user">
        <span @click="returnSystem()">
          <i  class="fa fa-reply"></i> 返回主页
        </span>
      </div>
      <div class="sysName">
        <div>
          <i class="fa fa-cogs"></i>配置管理
        </div>
      </div>
      <ul class="settingMenu">
        <router-link v-for="item in routerList" :key="item.path" tag="li" active-class="selected" :to="item.path">
          <div>{{item.name}}</div>
        </router-link>
      </ul>
    </header>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>
<script>
import routes from '../../router'
export default {
  data () {
    return {
      routerList: []
    }
  },
  created () {
    this.$nextTick(function () {
      let router = routes.options.routes
      router.forEach((r, i) => {
        if (r.name === '配置管理') {
          this.routerList = r.children
          console.log('setting router:', this.routerList)
        }
      })
    })
  },
  methods: {
    returnSystem () {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
::-webkit-scrollbar{
  width: 5px;
  background: #4E545A

}
.content{overflow-y:auto;}
::-webkit-scrollbar-button{  }
::-webkit-scrollbar-track{ }
::-webkit-scrollbar-track-piece {}
::-webkit-scrollbar-thumb{
  background:#6F7882;
  border-radius: 5px;
}

::-webkit-scrollbar-corner {  }
::-webkit-resizer{}

</style>
