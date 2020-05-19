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
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.attr_id">
              <!-- 多选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="item1 in item.attr_vals" :label="item1" border :key="item1"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片功能 -->
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本组件面板-->
            <quill-editor v-model="formData.goods_introduce" />
            <el-button type="primary"  @click="addGoods" class="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%">
      <img :src="imgUrl" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Add',
    data() {
      return {
        //  正在进行的步骤的index
        activeIndex: 0,
        activeName: '0',
        //  表单数据
        formData: {
          goods_price: 1,
          goods_number: 1,
          goods_weight: 1,
          // 定义级联选择器选中的值, 必须是数组
          goods_cat: [],
          //  上传的图片列表
          pics: [],
          attrs: []
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
        options: [],
        //  商品参数数据
        manyList: [],
        //  商品属性数据
        onlyList: [],
        // 上传图片的请求头
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        //  控制dialog的显示
        dialogVisible: false,
        //  图片的路径
        imgUrl: ''
      }
    },
    methods: {
      // 监听tabs的click事件
      async clickTab() {
        this.activeIndex = this.activeName
        if (this.activeName === '1') {
          //  获取商品参数数据
          const { data: res } = await this.$http.get(`categories/${this.cartId}/attributes`, { params: { sel: 'many' } })
          if (res.meta.status !== 200) return
          res.data.forEach(v => {
            v.attr_vals = v.attr_vals.split(',')
          })
          this.manyList = res.data
        } else if (this.activeName === '2') {
          //  获取商品属性数据
          const { data: res } = await this.$http.get(`categories/${this.cartId}/attributes`, { params: { sel: 'only' } })
          if (res.meta.status !== 200) return
          this.onlyList = res.data
        }
      },
      //  切换标签之前的钩子
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
      },
      //  点击图片的事件
      handlePreview(file) {
        this.imgUrl = file.response.data.url
        this.dialogVisible = true
      },
      //  删除图片的事件
      handleRemove(file) {
        const filePath = file.response.data.url
        const i = this.formData.pics.findIndex(v => v.pic === filePath)
        this.formData.pics.splice(i, 1)
      },
      // 图片上传之后成功的钩子函数
      handleSuccess(res) {
        const picObj = { pic:res.data.url }
        this.formData.pics.push(picObj)
      },
      //  添加商品
      addGoods() {
        this.$refs.form.validate(async valid => {
          if (!valid) return
          //  添加动态参数
          this.manyList.forEach(v => {
            const obj = {
              attr_id: v.attr_id,
              attr_value: v.attr_vals.join(',')
            }
            this.formData.attrs.push(obj)
          })
          // 添加静态参数
          this.onlyList.forEach(v => {
            const obj = {
              attr_id: v.attr_id,
              attr_value: v.attr_vals.join(',')
            }
            this.formData.attrs.push(obj)
          })
          this.formData.goods_cat = this.formData.goods_cat.join(',')
          const { data:res } = await this.$http.post('goods', this.formData)
          if (res.meta.status !== 201) return this.$message.error('添加商品失败')
          this.$router.push('/goods')
          this.$message.success('添加商品成功')
        })
      }
    },
    created() {
      this.getOptions()
    },
    computed: {
      cartId() {
        return this.formData.goods_cat[this.formData.goods_cat.length - 1] || null
      }
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

  .add{
    margin-top: 20px;
  }
</style>
