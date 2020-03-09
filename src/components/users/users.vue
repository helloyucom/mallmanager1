<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="邮箱"></el-table-column>
      <el-table-column prop="address" label="电话"></el-table-column>
      <el-table-column prop="address" label="创建时间"></el-table-column>
      <el-table-column prop="address" label="用户状态"></el-table-column>
      <el-table-column prop="address" label="操作"></el-table-column>
    </el-table>
    <!-- 分页 -->
  </el-card>
</template>
<script>
export default {
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    };
    return {
      query: "",
      // 表格数据
      tableData: Array(20).fill(item)
    };
  }
};
</script>
<style>
.box-card {
  height: 100%;
}
.searchRow {
  margin-top: 20px;
}
.inputSearch {
  width: 300px;
}
</style>