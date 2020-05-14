<template>
  <div>
    <el-card>
      <el-table
        :data="rightsList"
        border
        stripe
        style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="等级">
          <template #default="{row}">
            <el-tag v-if="row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Rights',
    data() {
      return {
        rightsList: []
      }
    },
    methods: {
      async getRightsList() {
        const { data: res } = await this.$http.get('rights/list')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rightsList = res.data
      }
    },
    created() {
      this.getRightsList()
    }
  }
</script>

<style scoped lang="less">
  .el-card {
    margin-top: 20px;
  }
</style>
