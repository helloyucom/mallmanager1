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
          <el-row v-if="scope.row.children.length === 0">
            <span>未分配权限</span>
          </el-row>
          <el-row
            v-for="(item1, i) in scope.row.children"
            :key="i"
            style="margin-bottom: 4px;"
            v-else
          >
            <el-col :span="4">
              <el-tag
                closable
                effect="dark"
                @close="deleteRight(scope.row, item1.id)"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i" style="margin-bottom: 4px;">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable
                    effect="light"
                    @close="deleteRight(scope.row, item2.id)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    type="danger"
                    v-for="(item3, i) in item2.children"
                    :key="i"
                    closable
                    effect="plain"
                    style="margin: 0 4px 4px 0;"
                    @close="deleteRight(scope.row, item3.id)"
                  >{{item3.authName}}</el-tag>
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
            @click="showSetRightDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4. 对话框 -->
    <!-- 对话框-分配角色 -->
    <el-dialog title="分配角色权限" :visible.sync="dialogVisibleSetRole" @close="currentRoleRights = []">
      <el-tree
        :data="treelist"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="currentRoleRights"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSetRole = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      roleList: [], // 角色列表
      dialogVisibleSetRole: false, // 分配角色权限对话框的显示标记
      // 权限树形结构的数据
      treelist: [], // 当前所选角色所有权限 包括系统中所有权限和当前角色已有的权限
      currentRoleRights: [], // 当前角色有的权限列表
      currentRoleId: '',  // 当前需要修改权限的角色的id
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    /** handle点击确定-发起请求-设置角色权限 */
    async handleSetRoleRight() {
      // 0. 关闭对话框
      this.dialogVisibleSetRole = false
      // 1. 获取当前角色的id -> roleId  从data选项中获取 -> 打开对话框时设置
      // 2. 获取选择权限的权限id数组 rids
      let rids = this.currentRoleRights.join(',')
      console.log(rids)
      const res = this.$http.post(`roles/${this.currentRoleId}/rights`, "105,104,101")
    },
    /** 分配/修改权限 */
    async showSetRightDia(role) {
      // 获取系统所有权限的树形列表
      this.currentRoleId = role.id
      const res = await this.$http.get(`rights/tree`);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.treelist = data;
        // 获取当前角色所拥有权限的所有id
        role.children.forEach(item1 => {
          // this.currentRoleRights.push(item1.id);
          item1.children.forEach(item2 => {
            // this.currentRoleRights.push(item2.id);
            item2.children.forEach(item3 => {
              this.currentRoleRights.push(item3.id);
            });
          });
        });
      }
      this.dialogVisibleSetRole = true; // 显示对话框
    },
    /** 关闭标签-删除权限 */
    async deleteRight(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        role.children = data;
      }
    },
    /** 获取角色列表 */
    async getRoleList() {
      const res = await this.$http.get(`roles`);
      this.roleList = res.data.data;
    }
  }
};
</script>
<style>
.card-box {
  height: 100%;
}
</style>