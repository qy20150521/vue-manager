<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <!--  搜索框  -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!--  添加按钮  -->
        <el-col :span="3">
          <el-button type="primary" @click="goAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格  -->
      <el-table
        :data="goodsList"
        stripe
        border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="630"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" min-width="150"></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template #default="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(row.goods_id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页  -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page="1"
          :page-sizes="[10, 15, 20, 30]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 修改商品信息的弹出框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="closeEditGoods" ref="editForm">
      <el-form :model="editGoodsData" :rules="editGoodsRules" ref="editForm" label-width="100px">
        <el-form-item label="商品名称"  prop="goods_name">
          <el-input v-model="editGoodsData.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="editGoodsData.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model="editGoodsData.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="editGoodsData.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Goods',
    data() {
      return {
        queryInfo: {
          pagesize: 10,
          pagenum: 1
        },
        goodsList: [],
        total: 0,
        editDialogVisible: false,
        //  商品id
        id:'',
        //  编辑商品数据
        editGoodsData:{},
        //  编辑商品验证规则
        editGoodsRules:{
          goods_name:[
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          goods_price:[
            { required: true, message: '请输入价格', trigger: 'blur' }
          ],
          goods_number:[
            { required: true, message: '请输入数量', trigger: 'blur' }
          ],
          goods_weight:[
            { required: true, message: '请输入重量', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      async getGoodsList() {
        const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
        if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
        this.goodsList = res.data.goods
        this.total = res.data.total
      },
      //  跳转到添加商品页面
      goAdd() {
        this.$router.push('/goods/add')
      },
      // 监听pagesize改变事件
      handleSizeChange(pagesize) {
        this.queryInfo.pagesize = pagesize
        this.getGoodsList()
      },
      // 监听page改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      //  删除商品
      async removeGoods(id) {
        const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmRes !== 'confirm') return this.$message.info('取消了删除')
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.getGoodsList()
        this.$message.success(res.meta.msg)
      },
      //  显示编辑商品的弹出框
      async showEditDialog(id) {
        const { data:res } = await this.$http.get('goods/' + id)
        this.editGoodsData = res.data
        this.id = id
        this.editDialogVisible = true
      },
      //  编辑商品
      editGoods() {
        this.$refs.editForm.validate(async valid => {
          if (!valid) return
          const { data:res } = await this.$http.put('goods/' + this.id, this.editGoodsData)
          if (res.meta.status !== 200) return this.$message.error('编辑失败')
          this.$message.success('编辑成功')
          this.getGoodsList()
          this.editDialogVisible = false
        })
      },
      //  重置表单校验结果
      closeEditGoods() {
        this.$refs.editForm.clearValidate()
      }
    },
    created() {
      this.getGoodsList()
    }
  }
</script>

<style scoped lang="less">
  .el-card {
    margin-top: 20px;
    min-width: 1200px;
    overflow-x: scroll;
  }

  .el-table {
    margin: 20px 0;
  }
</style>
