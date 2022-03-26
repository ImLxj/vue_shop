<template>
  <div class="login_container">
    <!-- 头像区域 -->
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 表单区域 -->
      <el-form
        :model="LoginForm"
        :rules="LoginFormRules"
        label-width="0px"
        class="login_form"
        ref="LoginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="LoginForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="LoginForm.password"
            type="password"
            prefix-icon="el-icon-s-cooperation"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 这是登录表单的数据绑定对象
      LoginForm: {
        username: '',
        password: '',
      },
      // 登录表单的验证规则对象
      LoginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
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
      },
    }
  },
  methods: {
    // 重置form表单
    resetLoginForm() {
      // 重置表单属性是resetFields()函数
      this.$refs.LoginFormRef.resetFields()
    },
    // 表单注册的预校验
    login() {
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.LoginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功')
        // 将服务器返回的token值保存到sessionStorage里面
        window.sessionStorage.setItem('token', res.data.token)
        // 实现页面的跳转
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: relative;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login_box .avatar_box {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0 0 10px #eee;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.login_form {
  position: absolute;
  bottom: 0;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>