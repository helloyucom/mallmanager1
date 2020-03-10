<template>
  <el-card class="card-box">
    <!-- 1. 面包屑 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 2. 列表 -->
    <el-table :data="rightsList" border style="width: 100%;" height="500px">
      <el-table-column type="index"  label="#" width="100"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级" >
         <template slot-scope="scope">
            <span v-if="scope.row.level === '0'">一级</span>
            <span v-if="scope.row.level === '1'">二级</span>
            <span v-if="scope.row.level === '2'">三级</span>
         </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const res = await this.$http.get(`rights/list`);
      this.rightsList = res.data.data;
    }
  }
};
</script>
<style>
.card-box {
  height: 100%;
}
</style>