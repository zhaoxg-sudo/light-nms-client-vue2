<template>
  <div id="app">
    <keep-alive include="Screen">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

</style>
