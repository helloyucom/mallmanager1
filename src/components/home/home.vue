<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="23" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="loginOut">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu
        class="menue"
        :unique-opened="true"
        >
          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-user"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-lock"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-notebook-1"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-s-order"></i>
              <span slot="title">商品列表</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-s-fold"></i>
              <span slot="title">商品分类</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-setting"></i>
              <span slot="title">分类参数</span>
            </el-menu-item>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-s-claim"></i>
              <span slot="title">订单列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-bank-card"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-coin"></i>
              <span slot="title">数据报表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  beforeCreate() {
      // 从localStorge中获取token
      const token = localStorage.getItem('token')
      if (!token) {
          // 如果没有token，跳转到登录页中
          this.$router.push({name: 'login'})
          this.$message.warning("请登录")
      }
  }
};
</script>
<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
}
/** 头部样式 */
.middle {
  text-align: center;
  line-height: 100%;
}
.loginOut {
  text-decoration: none;
  line-height: 60px;
}
/** 侧边栏 */
.menue {
    height: 100%;
}
</style>