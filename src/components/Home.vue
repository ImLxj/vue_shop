<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      // 清空浏览器本地保存的数据
      window.sessionStorage.clear()
      // 跳转到登录页面
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped>
</style>