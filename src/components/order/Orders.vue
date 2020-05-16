<template>
  <div>
    <el-card>
      <el-row>
        <!--  搜索框  -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="" label="是否付款">
          <template #default="{ row }">
              <el-tag v-if="row.order_pay==0" type="danger">未付款</el-tag>
              <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
<!--        <el-table-column prop="" label="操作"></el-table-column>-->
      </el-table>
      <div class="block">
        <span class="demonstration">完整功能</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[5, 10, 15]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Orders',
    data() {
      return {
        queryInfo: {
          pagenum:1,
          pagesize:10
        },
        total:0,
        ordersList: []
      }
    },
    methods: {
      async getOrdersList() {
        const { data: res } = await this.$http.get('orders', { params:this.queryInfo })
        if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
        this.ordersList = res.data.goods
        this.total = res.data.total
      },
      handleSizeChange(pagesize) {
        this.queryInfo.pagesize = pagesize
        this.getOrdersList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrdersList()
      }
    },
    created() {
      this.getOrdersList()
    }
  }
</script>

<style scoped lang="less">
  .el-card {
    margin-top: 20px;
  }

  .el-table {
    margin: 20px 0;
  }
</style>
