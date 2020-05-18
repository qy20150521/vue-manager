<template>
  <div>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="formData" :rules="formRules" ref="form">
        <!-- 标签页 -->
        <el-tabs :tab-position="'left'" v-model="activeName" :before-leave="beforeLeaveTabs" @tab-click="clickTab">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="formData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="formData.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="formData.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="formData.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="formData.goods_cat"
                :options="options"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Add',
    data() {
      return {
        //  正在进行的步骤的index
        activeIndex: 0,
        activeName:'0',
        //  表单数据
        formData: {
          goods_price: 0,
          goods_number: 0,
          goods_weight: 0,
          // 定义级联选择器选中的值, 必须是数组
          goods_cat:[]
        },
        //  表单校验规则
        formRules: {
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' }
          ],
          goods_cat: [
            { required: true, message: '请选择三级分类', trigger: 'change' }
          ]
        },
        //  级联选择器的配置项
        cateProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id'
        },
        // 级联选择器的数据源
        options: []
      }
    },
    methods: {
      // 监听tabs的click事件
      clickTab() {
        this.activeIndex = this.activeName
      },
      beforeLeaveTabs(newActiveName, oldActiveName) {
        if (oldActiveName === '0' && this.formData.goods_cat.length !== 3) {
          //  防止多次调用
          this.$message.closeAll()
          this.$message.error('请选择商品分类')
          return false
        }
      },
      // 级联选择器改变就会触发的的函数
      handleChange() {
        if (this.formData.goods_cat.length !== 3) {
          this.formData.goods_cat = []
        }
      },
      //  获取商品分类的数据
      async getOptions() {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) return this.$message.error('获取父级名称失败')
        this.options = res.data
      }
    },
    created() {
      this.getOptions()
    }
  }
</script>

<style scoped lang="less">
  .el-card {
    margin-top: 20px;
  }

  .el-steps, .el-tabs {
    margin-top: 15px;
  }

  .el-cascader {
    display: block;
    width: fit-content;
  }
</style>
