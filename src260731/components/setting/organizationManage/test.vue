<template>
  <div>
    <ul>
      <li v-for='item in data.b' :key='item'>
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>
