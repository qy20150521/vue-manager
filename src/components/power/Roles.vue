<template>
  <div class="box">
    <el-card>
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      <el-table
        :data="rolesList"
        border
        stripe
        style="width: 100%">
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-row v-for="(v1,i1) in row.children" :key="v1.id"
                    :class="['border_bottom','align-center',i1===0?'border_top':'']">
              <el-col :span="4">
                <!--   一级权限  -->
                <el-tag closable @close="removeRights(row,v1.id)">{{ v1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(v2,i2) in v1.children" :key="v2.id" :class="[i2===0?'':'border_top','align-center']">
                  <el-col :span="6">
                    <!--   二级权限  -->
                    <el-tag type="success" closable @close="removeRights(row,v2.id)">{{ v2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--   三级权限  -->
                    <el-tag type="warning" closable v-for="(v3) in v2.children" :key="v3.id"
                            @close="removeRights(row,v3.id)">{{ v3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoles(row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoles(row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightsDialog(row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的dialog -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightsDialogVisible"
      @close="closeRoleDialog"
      width="30%">
      <el-tree
        :data="rightsList"
        ref="tree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="roleArr"
        :props="roleObj">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的dialog -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog" ref="editForm">
      <el-form :model="addRolesData" :rules="addRolesRules" ref="addForm" label-width="100px">
        <el-form-item label="角色名称"  prop="roleName">
          <el-input v-model="addRolesData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色信息的弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog" ref="editForm">
      <el-form :model="editRolesData" :rules="editRolesRules" ref="editForm" label-width="100px">
        <el-form-item label="角色名称"  prop="roleName">
          <el-input v-model="editRolesData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Roles',
    data() {
      return {
        rolesList: [],
        // 树形控件的数据源
        rightsList: [],
        //  控制分配权限的dialog显示
        rightsDialogVisible: false,
        // 默认选中展开的节点, 以key选中
        roleArr: [],
        // 指定节点的字段
        roleObj: {
          label: 'authName',
          children: 'children'
        },
        roleId: '',
        //  编辑角色的dialog
        editDialogVisible: false,
        editRolesData:{},
        editRolesRules:{
          roleName:[
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        },
        addDialogVisible: false,
        addRolesData:{},
        addRolesRules:{
          roleName:[
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      async getRolesList() {
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rolesList = res.data
      },
      //  移除权限
      async removeRights(role, rightId) {
        const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmRes === 'cancel') return this.$message.info('取消了删除')
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        //  失败
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        //  成功
        role.children = res.data
        this.$message.success(res.meta.msg)
      },
      //  显示分配权限的dialog
      async showRightsDialog(role) {
        this.roleId = role.id
        const { data: res } = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
        this.rightsList = res.data
        this.getThreeKeys(role)
        this.rightsDialogVisible = true
      },
      getThreeKeys(node) {
        if (!node.children) return this.roleArr.push(node.id)
        node.children.forEach(v => this.getThreeKeys(v))
      },
      //  提交权限
      async saveRights() {
        const key = [...this.$refs.tree.getHalfCheckedKeys(), ...this.$refs.tree.getCheckedKeys()].join(',')
        const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: key })
        //  提交失败
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        //  提交成功
        this.getRolesList()
        this.$message.success(res.meta.msg)
        this.rightsDialogVisible = false
      },
      //  分配权限dialog关闭后的操作
      closeRoleDialog() {
        this.roleArr = []
      },
      //  删除角色
      async removeRoles(id) {
        const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmRes === 'cancel') return this.$message.info('取消了删除')
        const { data:res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getRolesList()
      },
      //  显示编辑角色的dialog
      async showEditRoles(id) {
        const { data:res } = await this.$http.get('roles/' + id)
        if (res.meta.status !== 200) return
        this.editRolesData = res.data
        this.editDialogVisible = true
      },
      //  编辑角色
      async editRoles() {
        this.$refs.editForm.validate(async valid => {
          if (!valid) return
          const { data:res } = await this.$http.put(`roles/${this.editRolesData.roleId}`, this.editRolesData)
          if (res.meta.status !== 200) return this.$message.error('编辑失败')
          this.$message.success('编辑成功')
          this.getRolesList()
          this.editDialogVisible = false
        })
      },
      //  编辑角色dialog关闭后的操作
      closeEditDialog() {
        this.$refs.editForm.clearValidate()
      },
      //  添加角色
      addRoles() {
        this.$refs.addForm.validate(async valid => {
          if (!valid) return
          const { data:res } = await this.$http.post('roles', this.addRolesData)
          console.log(res)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加成功')
          this.getRolesList()
          this.addDialogVisible = false
        })
      },
      //  添加角色dialog关闭后的操作
      closeAddDialog() {
          this.$refs.addForm.resetFields()
      }
    },
    created() {
      this.getRolesList()
    }
  }
</script>

<style scoped lang="less">
  .box {
    min-width: 1000px;
    overflow-x: scroll;
  }

  .el-card {
    margin-top: 20px;
  }

  .el-button {
    margin-bottom: 20px;
  }

  .el-tag {
    margin: 7px;
  }

  .border_top {
    border-top: solid 1px #eee;
  }

  .border_bottom {
    border-bottom: solid 1px #eee;
  }

  .align-center {
    display: flex;
    align-items: center;
  }
</style>
