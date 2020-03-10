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
    <!-- 3. 表格数据 -->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1, i) in scope.row.children" :key="i">
            <el-col :span="4"><el-tag closable effect="dark" @close="handleClose(item1.authName)">{{item1.authName}}</el-tag><i class="el-icon-arrow-right"></i></el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag type="success" closable effect="light">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag type="danger" v-for="(item3, i) in item2.children" :key="i" closable effect="plain">
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDialog(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDelUserMsgBox(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showUserRoleDialog(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      roleList: []
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    /** 获取角色列表 */
    async getRoleList() {
      const res = await this.$http.get(`roles`);
      this.roleList = res.data.data;
    },
    /** 关闭标签 */
    handleClose(tag) {
      console.log(tag)
    }
  }
};
</script>
<style>
.card-box {
  height: 100%;
}
</style>