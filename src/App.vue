<template>
  <div id="app">
    <keep-alive :max="3" exclude="Screen">
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
