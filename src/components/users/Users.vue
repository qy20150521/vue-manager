<template>
  <div>
<!--    &lt;!&ndash;  面包屑导航  &ndash;&gt;-->
<!--    <Breadcrumb :firstuser="'用户管理'" :seconduser="'用户列表'"></Breadcrumb>-->
    <!--  卡片容器  -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!--  搜索框  -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!--  添加按钮  -->
        <el-col :span="3">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格  -->
      <el-table :data="usersList" border class="table">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{ row }">
            <el-switch v-model="row.mg_state" @change="changeStatus(row.mg_state,row.id)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(row.id)"></el-button>
            <!-- enterable 控制鼠标是否可进入到 tooltip 中         -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRoleDialog(row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--  分页器  -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[1, 2, 4, 7]"
          :page-size="2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户的弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeAddDialog">
      <el-form :model="addFormData" :rules="addFormRules" ref="addForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFormData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息用户的弹出框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog">
      <el-form :model="editFormData" :rules="editFormRules" ref="editForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editFormData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的弹出框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="50%" @close="closeRoleDialog">
      <div class="role">
        <p>当前的用户：{{ roleUserInfo.username }}</p>
        <p>当前的角色：{{ roleUserInfo.role_name }}</p>
        <span>分配新角色</span>
        <el-select v-model="roleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //  导入公共的组件
  // import Breadcrumb from '../subComponents/Breadcrumb.vue'

  export default {
    name: 'Users',
    data() {
      //  定义邮箱校验规则
      const checkEmail = (rule, value, callback) => {
        const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (regEmail.test(value)) {
          //  校验通过
          return callback()
        }
        //  失败
        callback(new Error('请输入合法的邮箱'))
      }
      //  定义手机号校验规则
      const checkMobile = (rule, value, callback) => {
        const regMobile = /^1[3456789]\d{9}$/
        if (regMobile.test(value)) {
          //  校验通过
          return callback()
        }
        //  失败
        callback(new Error('请输入合法的手机号'))
      }
      return {
        //  用户信息列表
        usersList: [],
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        //  用户的总条数
        total: 0,
        //  控制添加dialog显示的参数
        dialogVisible: false,
        // 添加用户表单数据
        addFormData: {},
        // 添加用户表单验证规则
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            //  调用自定义校验规则
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            //  调用自定义校验规则
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        //  控制修改dialog显示的参数
        editDialogVisible: false,
        // 修改用户信息表单数据
        editFormData: {},
        // 修改用户信息表单验证规则
        editFormRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            //  调用自定义校验规则
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            //  调用自定义校验规则
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        editUserId: '',
        //  控制分配角色dialog显示的参数
        roleDialogVisible: false,
        //  用户和角色信息
        roleUserInfo:{},
        //  角色信息
        rolesList:[],
        //  角色id
        roleId:''
      }
    },
    methods: {
      async getUserList() {
        const { data: res } = await this.$http.get('users', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
        this.usersList = res.data.users
        this.total = res.data.total
      },
      //  改变用户状态
      async changeStatus(status, id) {
        const { data: res } = await this.$http.put(`users/${id}/state/${status}`)
        console.log(res)
        //  失败
        if (res.meta.status !== 200) {
          //  重置状态
          status = !status
          this.$message.error(res.meta.msg)
          return
        }
        //  成功
        this.$message.success(res.meta.msg)
      },
      // 监听pagesize改变事件
      handleSizeChange(pagesize) {
        this.queryInfo.pagesize = pagesize
        this.getUserList()
      },
      // 监听page改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      //  添加用户弹出框关闭后重置表单
      closeAddDialog() {
        this.$refs.addForm.resetFields()
      },
      //  添加用户
      addUser() {
        this.$refs.addForm.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.post('users', this.addFormData)
          //  创建失败
          if (res.meta.status !== 201) return this.$message.error('创建用户失败')
          //  创建成功
          this.getUserList()
          this.$message.success('创建用户成功')
          this.dialogVisible = false
        })
      },
      //  删除用户
      del(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //  点击确定后的操作
          const { data: res } = await this.$http.delete('users/' + id)
          //  删除失败
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          //  删除成功
          this.getUserList()
          this.$message.success(res.meta.msg)
        }).catch(() => {
          //  点击取消后的操作
          this.$message.info('已取消删除')
        })
      },
      //  显示编辑用户的dialog
      showEditDialog(data) {
        this.editFormData = data
        this.editUserId = data.id
        this.editDialogVisible = true
      },
      // 编辑用户
      editUser() {
        this.$refs.editForm.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.put('users/' + this.editUserId, {
            email:this.editFormData.email,
            mobile:this.editFormData.mobile
          })
          //  修改失败
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          //  修改成功
          this.$message.success(res.meta.msg)
          this.editDialogVisible = false
        })
      },
      //  编辑用户弹出框关闭后重置表单校验结果
      closeEditDialog() {
        this.$refs.editForm.clearValidate()
      },
      //  显示分配角色的弹出框
      async showRoleDialog(data) {
        this.roleUserInfo = data
        const { data:res } = await this.$http.get('roles')
        this.rolesList = res.data
        this.roleDialogVisible = true
      },
      //  分配角色
      async roleUser() {
          const { data:res } = await this.$http.put(`users/${this.roleUserInfo.id}/role`, { rid:this.roleId })
          //  失败
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          //  成功
          this.$message.success(res.meta.msg)
          this.getUserList()
          this.roleDialogVisible = false
      },
      //  关闭分配角色的弹出框
      closeRoleDialog() {
          this.roleId = ''
          this.roleDialogVisible = false
      }
    },
    created() {
      this.getUserList()
    }
    // components: {
    //   // 注册组件
    //   Breadcrumb
    // }
  }
</script>

<style scoped lang="less">
  .box-card {
    margin-top: 20px;

    .table {
      margin: 20px 0;
    }
  }
  .role{
    p{
      margin-bottom: 20px;
    }
  }
</style>
