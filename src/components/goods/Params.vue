<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        :closable="false"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 级联区域 -->
      <el-row class="row_col">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="CateProps"
            @change="parentHandleChanged"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs 标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="disableBtn"
            size="mini"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 渲染数据表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="disableBtn"
            size="mini"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 渲染数据表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改属性对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 子级可选项数据源
      childrenCateList: [],
      // 级联配置项
      CateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 默认显示的标签页
      activeName: 'many',
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 添加属性对话框的显示与隐藏
      addDialogVisible: false,
      // 双向绑定的表单数据对象
      addForm: {
        attr_name: '',
      },
      // 表单数据的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      // 修改属性对话框的显示和隐藏
      editDialogVisible: false,
      // 修改对话框的数据
      editForm: {
        attr_name: '',
        attr_id: '',
      },
      // 修改对话框的校验对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')

      // 将获取到的商品信息赋值给data当中的数据
      this.cateList = res.data
    },
    // 当列表发生改变时调用该函数
    parentHandleChanged() {
      this.getParamsCate()
    },
    // 点击改变标签页
    handleTabsClick() {
      this.getParamsCate()
    },
    // 获取参数列表的函数
    async getParamsCate() {
      // 判断是否选中的三级列表
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      // 如果选中的三级标签则发起请求
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      )
      if (res.meta.status !== 200)
        return this.$message.error('获取参数列表失败')

      res.data.forEach((item) => {
        // 将获取到的所有的数据，当中的属性介绍拆分为数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 自定义按钮和文本框之间的切换
        item.inputVisible = false
        // 自定义新添加的内容绑定
        item.inputValue = ''
      })
      // 将获取到的数据分开保存到不同的表格里面
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        console.log(res.data)
        if (res.meta.status !== 201) return this.$message.error('添加属性失败')
        this.$message.success('添加成功')
        this.getParamsCate()
        this.addDialogVisible = false
      })
    },
    // 修改对话框的显示和隐藏
    showEditDialog(data) {
      // 属性名字
      this.editForm.attr_name = data.attr_name
      // 属性id
      this.editForm.attr_id = data.attr_id
      this.editDialogVisible = true
    },
    // 监听当对话框状态改变时，打开和关闭的状态,清除form表单内容
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 验证修改的信息，并发送网络请求
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) return this.$message.error('修改信息失败')
        this.$message.success('修改信息成功')
        // 更新表格内容
        this.getParamsCate()
        // 关闭对话框
        this.editDialogVisible = false
      })
    },
    // 删除属性的操作
    async deleteParams(data) {
      const resultConfirm = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (resultConfirm !== 'confirm') return
      // 发起请求
      const { data: res } = await this.$http.delete(
        `categories/${data.cat_id}/attributes/${data.attr_id}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamsCate()
    },
    // 文本框失去焦点或者键盘按下enter键都会触发
    handleInputConfirm() {},
    // 显示文本框
    showInput(row) {
      row.inputVisible = true
    },
  },
  computed: {
    disableBtn() {
      return this.selectedCateKeys.length === 3 ? false : true
    },
    // 这个参数是分类id 也就是三级级联的id 这个选中之后是唯一的
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>

<style scoped>
.row_col {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.el-cascader {
  width: 25%;
}
.input-new-tag {
  width: 120px;
}
</style>