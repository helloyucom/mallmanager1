<template>
  <el-card class="card-box">
    <!-- 1. 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 2. 添加角色按钮 -->
    <el-row>
      <el-col>
        <el-button type="info">添加角色</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      
    };
  },
  created() {
    
  },
  methods: {
    
  }
};
</script>
<style>
.card-box {
  height: 100%;
}
</style>