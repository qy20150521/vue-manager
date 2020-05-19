<template>
  <div>
    <el-card>
      <el-alert title="注意:只允许为第三级分类设置参数!" show-icon :closable="false" type="warning"></el-alert>
      <div class="block">
        <span>选择商品分类:</span>
        <el-cascader
          v-model="cateKeysArr"
          :options="options"
          :props="cateProps"
          @change="handleChange"
        ></el-cascader>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isDisabled">添加参数</el-button>
            <el-table border stripe :data="tableData">
              <el-table-column type="expand">
                <template #default="{ row }">
                  <el-tag closable @close="closeTag(row,index)" v-for="(item,index) in row.attr_vals" :key="item">{{ item }}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="row.inputVisible"
                    v-model="row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isDisabled">添加属性</el-button>
            <el-table border stripe :data="tableData">
              <el-table-column type="expand">
                <template #default="{ row }">
                  <el-tag closable @close="closeTag(row,index)" v-for="(item,index) in row.attr_vals" :key="item">{{ item }}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="row.inputVisible"
                    v-model="row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Params',
    data() {
      return {
        cateKeysArr: [],
        options: [],
        cateProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id'
        },
        activeName: 'many',
        tableData: []
      }
    },
    methods: {
      //  获取商品分类列表
      async getCateList() {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) return
        this.options = res.data
      },
      // 级联选择器改变触发的的函数
      async handleChange() {
        if (this.cateKeysArr.length !== 3) {
          this.cateKeysArr = []
          this.tableData = []
        } else {
          const {
            data: res
          } = await this.$http.get(
            `categories/${this.cateKeysArr[2]}/attributes`,
            { params: { sel: this.activeName } }
          )
          if (res.meta.status !== 200) return
          res.data.forEach(v => {
            v.attr_vals = v.attr_vals ? v.attr_vals.split(',') : []
            v.inputVisible = false
            v.inputValue = ''
          })
          this.tableData = res.data
          console.log(this.tableData)
        }
      },
      // 标签页的click事件
      handleClick() {
        this.handleChange()
      },
      // 点击显示input组件
      showInput(row) {
        row.inputVisible = true
        this.$nextTick(_ => {
          //  自动聚焦
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      // 展开列中的tag标签失焦的事件
      async handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        row.attr_vals.push(row.inputValue)
        const { data: res } = await this.$http.put(`categories/${this.cateKeysArr[2]}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        })
        //  失败
        if (res.meta.status !== 200) return this.$message.error('添加失败')
        //  成功
        row.inputValue = ''
        row.inputVisible = false
        this.$message.success('添加成功')
      },
      // 关闭tag标签触发的事件
      async closeTag(row, i) {
        const { data: res } = await this.$http.put(`categories/${this.cateKeysArr[2]}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.splice(i, 1).join(',')
        })
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
      },
      //  删除商品参数
      async remove(row) {
        const { data:res } = await this.$http.delete(`categories/${this.cateKeysArr[2]}/attributes/${row.attr_id}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.handleChange()
        this.$message.success('删除成功')
      }
    },
    created() {
      this.getCateList()
    },
    computed: {
      isDisabled() {
        return this.cateKeysArr.length !== 3
      }
    }
  }
</script>

<style scoped lang="less">
  .el-card {
    margin-top: 20px;
  }

  .block {
    margin-top: 20px;
  }

  .el-table {
    margin-top: 12px;
  }

  .el-tabs {
    margin-top: 10px;
  }

  .el-input {
    width: 200px;
  }

  .el-tag, .el-input, .el-button {
    margin-right: 20px;
    margin-top: 10px;
  }
</style>
