<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="AddDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table style="width: 100%" :data="userList" border stripe>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户提示框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="AddDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="AddForm"
        :rules="AddFormRules"
        ref="AddFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="AddForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="AddForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户提示框 -->
    <el-dialog
      title="修改信息"
      :visible.sync="updateDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      width="50%"
    >
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRolesDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 验证邮箱的校验规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的校验规则
    var checkMobile = (rule, value, cb) => {
      // 沿着手机号的正则表达式
      const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 隐藏显示添加用户对话框
      AddDialogVisible: false,
      // 显示隐藏修改用户对话框
      updateDialogVisible: false,
      // 添加用户的表单数据
      AddForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 修改用户信息获取的存储对象
      editForm: {},
      // 添加表单的验证规则对象
      AddFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 修改用户信息的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入正确的邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 用户分配权限的对话框
      setRolesDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 获取所有角色列表
      rolesList: [],
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页数改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('状态修改失败')
      }
      this.$message.success('修改成功')
    },
    // 监听添加用户框关闭的处理操作
    addDialogClosed() {
      this.$refs.AddFormRef.resetFields()
    },
    // 监听用户提交信息的预校验
    addUser() {
      this.$refs.AddFormRef.validate(async (valid) => {
        // 判断预校验是否通过
        if (!valid) return
        // 验证通过可以发起网络请求
        const { data: res } = await this.$http.post('users', this.AddForm)
        // 判断后台是否添加成功信息
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        // 隐藏对话框
        this.AddDialogVisible = false
        // 清空表单数据
        this.$refs.AddFormRef.resetFields()
        // 从新获取新的用户数据
        this.getUserList()
      })
    },
    // 修改用户信息的对话的显示和隐藏
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      // 判断请求信息是否请求成功
      if (res.meta.status !== 200) return this.$message.error('查询信息失败')
      this.editForm = res.data
      // 显示修改用户的对话框
      this.updateDialogVisible = true
    },
    // 重置表单的信息
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 发起修改用户信息的预校验
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        // 判断用户输入的信息是否合法
        if (!valid) return
        // 可以向后端发起修改用户信息的请求
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )
        if (res.meta.status === 500) return this.$message.error('更新失败')
        // 更新用户信息表
        this.getUserList()
        // 关闭对话框
        this.updateDialogVisible = false
        // 提示用户信息成功
        this.$message.success('更新成功')
      })
    },
    // 根据id删除用户信息
    async removeUserById(id) {
      // 提示用户是否要删除用户信息  这个返回值会返回一个promise对象
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 当用户点击确定按钮之后 会返回 confirm 字符串
      // 当用户点击取消按钮之后 会返回 cancel 字符串
      if (confirmResult !== 'confirm')
        return this.$message.info('你取消的该操作')
      // 删除用户信息
      const { data: res } = await this.$http.delete(`users/${id}`)
      // 判断用户信息是否删除
      if (res.meta.status !== 200) return this.$message.error('删除信息失败')
      // 用户信息删除成功
      this.$message.success('删除成功')
      // 刷新用户用户信息
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 在展示对话框之前，获取所有的角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')

      this.rolesList = res.data
      this.setRolesDialogVisible = true
    },
  },
}
</script>

<style>
</style>