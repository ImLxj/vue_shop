<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色管理列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['dbbottom', i1 === 0 ? 'dbtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级标题 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRolesById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'dbtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRolesById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级标题 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRolesById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column type="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column type="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRolesEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRolesDialog(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色信息 -->
    <el-dialog
      title="添加角色"
      :visible.sync="rolesFormVisible"
      width="50%"
      @close="rolesDialogClosed"
    >
      <el-form
        :model="AddRolesForm"
        :rules="rolesFormRules"
        ref="rolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="AddRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="AddRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesVisible">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色信息 -->
    <el-dialog title="提示" :visible.sync="editRolesVisible" width="50%">
      <el-form
        :rules="editFormRules"
        ref="editFormRef"
        :model="editRolesForm"
        label-width="80px"
      >
        <el-form-item label-width="100px" label="角色id">
          <el-input v-model="editRolesForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="角色介绍" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 保存获取岛的角色列表信息
      rolesList: [],
      // 添加角色对话框的显示和隐藏
      rolesFormVisible: false,
      // 添加用户信息的对象
      AddRolesForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加用户信息的校验
      rolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      // 修改用户信息的对象
      editRolesForm: {},
      // 显示隐藏角色修改信息
      editRolesVisible: false,
      // 修改角色信息的校验
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      // 分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightList: [],
      // 设置树状控件
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 树状结构默认展开的节点
      defKeys: [],
      // 当前分配角色的id
      roleId: '',
    }
  },
  created() {
    // 获取角色列表
    this.getRolesList()
  },
  methods: {
    // 获取角色列表的信息
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      // 判断是否获取成功
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      // 获取成功将获取到的信息存放到rolesList里面
      this.rolesList = res.data
    },
    // 添加角色信息
    addRoles() {
      this.rolesFormVisible = true
    },
    // 关闭对话框 对对话框里面的内容进行清空
    rolesDialogClosed() {
      this.$refs.rolesFormRef.resetFields()
    },
    // 对添加用户输入的信息进行预校验
    addRolesVisible() {
      this.$refs.rolesFormRef.validate(async (valid) => {
        // 校验失败
        if (!valid) return this.$message.error('请输入正确的信息')
        // 校验成功
        const { data: res } = await this.$http.post('roles', {
          roleName: this.AddRolesForm.roleName,
          roleDesc: this.AddRolesForm.roleDesc,
        })
        // 添加失败
        if (res.meta.status !== 201) return this.$message.error('创建角色失败')
        // 添加成功
        // 更新表格数据
        this.getRolesList()
        // 清空对话框信息
        this.$refs.rolesFormRef.resetFields()
        // 关闭对话框
        this.rolesFormVisible = false
        // 提示成功
        this.$message.success('添加成功')
      })
    },
    // 按照id查询对应角色信息
    async showRolesEditDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      // 判断数据是否获取成功
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      // 获取数据成功将获取的数据存入到 editRolesForm当中
      this.editRolesForm = res.data
      // 显示修改角色的对话框
      this.editRolesVisible = true
    },
    // 对对话框的角色信息进行预校验并修改
    editRoles() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(this.editRolesForm)
        if (!valid) return this.$message.error('请输入正确的信息')
        // 预校验成功对角色进行修改发起网络请求
        const { data: res } = await this.$http.put(
          `roles/${this.editRolesForm.roleId}`,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          }
        )
        console.log('@@', res)
        // 判断是否修改成功
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        // 更新表中数据
        this.getRolesList()
        // 修改成功关闭对话框
        this.editRolesVisible = false
        // 提示用户信息修改成功
        this.$message.success('修改成功')
      })
    },
    // 删除当前角色信息
    async deleteRolesDialog(id) {
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
      const { data: res } = await this.$http.delete(`roles/${id}`)
      // 判断用户信息是否删除
      if (res.meta.status !== 200) return this.$message.error('删除信息失败')
      // 用户信息删除成功
      this.$message.success('删除成功')
      // 刷新用户用户信息
      this.getRolesList()
    },
    // 删除角色权限
    async removeRolesById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 判断是否确定删除
      if (confirmResult !== 'confirm') return this.$message.info('你取消了删除')
      // 删除成功,发送响应的网络请求
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      // 判断是否删除成功
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      // 删除权限成功刷新表格,
      role.children = res.data
    },
    // 打开分配权限的对话框
    async showSetRightDialog(role) {
      // 添加分配角色的id
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200)
        return this.$message.error('获取权限数据失败！')
      // 获取到的权限数据保存到rolesList中
      this.rightList = res.data
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级节点的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果包含children, 这采用递归的方式对数组进行遍历
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听关闭分配权限对话框
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击角色分配权限
    async allotRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const strId = keys.join(',')
      // 发送网络请求
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: strId }
      )
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.getRolesList()
      this.setRightDialogVisible = false
      this.$message.success('分配权限成功')
    },
  },
}
</script>

<style>
.el-tag {
  margin: 7px;
}

.dbtop {
  border-top: 1px solid #eee;
}

.dbbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>