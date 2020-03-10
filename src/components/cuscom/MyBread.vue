<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="my-bread">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  name: "my-bread",
  props: ["level1", "level2"]
};
</script>
<style>
.my-bread {
  margin-bottom: 24px;
}
</style>