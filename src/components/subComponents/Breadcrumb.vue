<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ firstuser }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ seconduser }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: 'Breadcrumb',
    props:['firstuser', 'seconduser']
  }
</script>

<style scoped>

</style>
