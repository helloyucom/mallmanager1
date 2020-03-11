<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="23" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="loginOut" @click="handleLoginOut()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 开启路由功能 -->
        <el-menu class="menue" :router="true" :unique-opened="true">
          <!-- 1 -->
          <el-submenu :index="item.order.toString()" v-for="(item, i) in menus" :key="i">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item1.path" v-for="(item1, i) in item.children" :key="i">
              <i class="el-icon-user"></i>
              <span slot="title">{{item1.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menus: []
    };
  },
  beforeCreate() {
    // 从localStorge中获取token
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   // 如果没有token，跳转到登录页中
    //   this.$router.push({ name: "login" });
    //   this.$message.warning("请登录");
    // }
    // 继续渲染组件
  },
  created() {
    this.getMenus();
  },
  methods: {
    /** 获取导航数据 */
    async getMenus() {
      const res = await this.$http.get(`menus`);
      const {data, meta: {msg, status}} = res.data
      if (status === 200) {
        this.menus = data
      }
    },
    /** 退出登录 */
    handleLoginOut() {
      // 销毁localStorage中的token
      localStorage.clear();
      // 回到登录页
      this.$router.push({ name: "login" });
      // 提示退出成功
      this.$message.success("退出成功");
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