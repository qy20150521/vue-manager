<template>
  <div>
    <el-card>
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      <zk-table
        ref="table"
        index-text="#"
        show-index
        :data="cateList"
        :expand-type="false"
        :selection-type="false"
        border
        :columns="columns">
        <template #isOK="{ row }">
          <el-icon v-if="row.cat_deleted" class="el-icon-error" style="color: red"></el-icon>
          <el-icon v-else class="el-icon-success" style="color: lightgreen"></el-icon>
        </template>
        <template #sort="{ row }">
          <el-tag type="primary" v-if="row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template #operation>
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </zk-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[3, 5, 7, 10]"
          :page-size="7"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加分类的dialog -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog" ref="addForm">
      <el-form :model="addCateData" :rules="addCateRules" ref="addForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            v-model="selectedArr"
            :options="options"
            clearable
            :props="cascaderProps"
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
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
          pagesize: 7,
          pagenum: 1
        },
        total: 0,
        columns: [
          //  第一列
          { label: '分类名称', prop: 'cat_name' },
          //  第二列
          { label: '是否有效', type: 'template', template: 'isOK' },
          //  第三列
          { label: '排序', type: 'template', template: 'sort' },
          //  第四列
          { label: '操作', type: 'template', template: 'operation' }
        ],
        addDialogVisible: false,
        addCateData: {},
        addCateRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        //  级联选择器的配置项
        cascaderProps: {
          expandTrigger: 'hover',
          //  指定显示的值的属性
          label: 'cat_name',
          //  指定显示值的对应id
          value: 'cat_id',
          //  禁止父子级联互相关联
          checkStrictly: true
        },
        // 定义级联选择器选中的值, 必须是数组
        selectedArr: [],
        // 级联选择器的数据源
        options: []
      }
    },
    methods: {
      async getCateList() {
        const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
        if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
        this.cateList = res.data.result
        this.total = res.data.total
      },
      //  监听pagesize改变
      handleSizeChange(pagesize) {
        this.queryInfo.pagesize = pagesize
        this.getCateList()
      },
      //  监听pagenum改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      handleChange() {
        // if (this.selectedArr.length > 0) {
        //   this.addCateData.cat_pid = this.selectedArr[this.selectedArr.length - 1]
        //   this.addCateData.cat_level = this.selectedArr.length
        // } else {
        //   this.addCateData.cat_pid = 0
        //   this.addCateData.cat_level = 0
        // }
      },
      //  显示添加分类的dialog
      async showAddDialog() {
        const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
        if (res.meta.status !== 200) return this.$message.error('获取父级名称失败')
        this.options = res.data
        this.addDialogVisible = true
      },
      //  添加分类
      addCate() {
        this.$refs.addForm.validate(async valid => {
          if (!valid) return
          if (this.selectedArr.length > 0) {
            this.addCateData.cat_pid = this.selectedArr[this.selectedArr.length - 1]
            this.addCateData.cat_level = this.selectedArr.length
          } else {
            this.addCateData.cat_pid = 0
            this.addCateData.cat_level = 0
          }
          const { data: res } = await this.$http.post('categories', this.addCateData)
          console.log(res)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加成功')
          this.getCateList()
          this.addDialogVisible = false
        })
      },
      //  关闭添加分类后的操作
      closeAddDialog() {
        this.$refs.addForm.resetFields()
        this.addCateForm = {}
        this.selectedArr = []
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

  .zk-table {
    margin: 20px 0;
  }

</style>
