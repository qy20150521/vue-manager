<template>
  <div id="app">
    <el-button type="primary">主要按钮</el-button>
    <el-switch
      v-model="value"
      active-color="#13ce66"
      inactive-color="#ff4949">
    </el-switch>
  </div>
</template>

<script>

  export default {
    name: 'app',
    data() {
      return {
        value: false
      }
    }
  }
</script>

<style>

</style>
