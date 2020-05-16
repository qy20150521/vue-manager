<template>
  <div>
    <el-card>
      <el-button type="primary">添加分类</el-button>
      <zk-table
        ref="table"
        index-text="#"
        show-index
        :data="cateList"
        :columns="columns">
        <template #isOK>

        </template>
      </zk-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Cate',
    data() {
      return {
        cateList: [],
        queryInfo: {
          type: 3,
          pagesize: 5,
          pagenum: 1
        },
        total: 0,
        columns: [
          { label: '分类名称', prop: 'cat_name' },
          { label: '是否有效', type: 'template', template: 'isOK' }
        ]
      }
    },
    methods: {
      async getCateList() {
        const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
        if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
        this.cateList = res.data.result
        // console.log(this.cateList)
        this.total = res.data.total
      }
    },
    created() {
      this.getCateList()
    }
  }
</script>

<style scoped lang="less">
  .el-card {
    margin-top: 20px;
  }
</style>
