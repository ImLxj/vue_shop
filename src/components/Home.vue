<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/1.jpg" alt="" />
        <span>电商后台管理</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <div class="toggle-button" @click="toggle">|||</div>
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menuList"
            :key="item.id"
            :index="item.id + ''"
          >
            <!-- 以及菜单的模板区域 -->
            <template slot="title">
              <!-- 一级菜单的图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 一级菜单的文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- router占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  // 页面加载完成后调用生命周期钩子
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      menuList: [],
      iconObj: {
        125: 'fa fa-user-circle',
        103: 'fa fa-database',
        101: 'fa fa-shopping-bag',
        102: 'fa fa-wpforms',
        145: 'fa fa-area-chart',
      },
      // 是否折叠
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      // 清空浏览器本地保存的数据
      window.sessionStorage.clear()
      // 跳转到登录页面
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>

<style scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.el-header div {
  display: flex;
  align-items: center;
}

.el-header div span {
  margin-left: 15px;
}

.el-header div img {
  width: 50px;
  height: 50px;
  margin: 5px;
}

.el-aside {
  background-color: #333744;
}

.el-aside .el-menu {
  border: none;
}

.el-main {
  background-color: #eaedf1;
}

.fa {
  margin-right: 8px;
}

.toggle-button {
  background-color: #475161;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>