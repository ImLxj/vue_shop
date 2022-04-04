<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      // 所有的权限数据列表
      rightsList: [],
    }
  },
  created() {
    // 获取所有的权限数据列表
    this.getRightsList()
  },
  methods: {
    // 获取所有的权限数据列表的方法
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      // 判断获取列表是否成功
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      // 获取成功,将列表数据放到rightsList里面
      this.rightsList = res.data
    },
  },
}
</script>

<style>
</style>