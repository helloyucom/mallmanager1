<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username" ref="usernameInput"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password" type="password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: ""
      }
    };
  },
  mounted() {
    this.usernameFocus();
  },
  methods: {
    /** 进入登录页，光标显示在用户名输入框 */
    usernameFocus() {
      this.$nextTick(()=>{
        this.$refs.usernameInput.$el.querySelector('input').focus()
      })
    },
    /** 执行登录操作 */
    async handleLogin() {
      const res = await this.$http.post("login", this.formData);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 登录成功
        // 0. 保存token
        localStorage.setItem("token", data.token);
        // 1. 跳转到home
        this.$router.push({ name: "home" });
        // 2. 提示成功
        this.$message.success("登录成功");
      } else {
        // 不成功
        this.$message.warning(msg);
      }
    }
  }
};
</script>
<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  /* 弹性盒布局 垂直水平居中 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  width: 30%;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
}
.login-wrap .login-btn {
  width: 100%;
}
</style>