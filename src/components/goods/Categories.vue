<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showGoodsDialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效列 -->
        <template slot="isOk" slot-scope="scope">
          <i
            style="color: lightgreen"
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i style="color: red" class="el-icon-error" v-else></i>
        </template>
        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="operation" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addGoodsDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="selectedCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 总数据条数
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        // 自定义模板列
        {
          label: '是否有效',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前这一列是用模板名称
          template: 'isOk',
        },
        {
          label: '排序',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前这一列是用模板名称
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation',
        },
      ],
      // 添加分类对话框的显示和隐藏
      addGoodsDialogVisible: false,
      // 商品分类的事件对象
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级
        cat_level: 0,
      },
      // 商品分类名称的规则校验
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 父级分类列表
      parentCateList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中的级联的id 把他们存到一个数组里面
      selectedKeys: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')

      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听当改变页数的时候调用函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听当改变当前页显示数量时调用该函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 弹出添加商品对话框
    showGoodsDialogVisible() {
      // 先获取到父级分类的列表，然后在弹出对话框
      this.parentCateDialog()
      this.addGoodsDialogVisible = true
    },
    // 获取父级分类的列表
    async parentCateDialog() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) return this.$message.error('获取信息失败')
      this.parentCateList = res.data
      console.log(res.data)
    },
    // 当级联选择器发生改变时，就会触发该函数
    selectedCateChanged() {
      console.log(this.selectedKeys)
      // 如果selectedKeys 数组中的 length 大于0 则说明已经选中父级id
      if (this.selectedKeys.length > 0) {
        // 永远选择数组的最后一项当做父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        // 父级元素的级别就是当前数组的长度
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 如果不大于零,则表名就是一级的标题,id和level都是0
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加新的分类
    addCate() {
      // 对用户输入的数据进行与校验
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$message.error('创建失败')
        this.getCateList()
        this.addGoodsDialogVisible = false
        this.$message.success('创建成功')
      })
    },
    // 清空对话框内容
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
  },
}
</script>

<style>
.el-row {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
  height: 50px;
}
.el-cascader-panel {
  height: 200px;
}
</style>