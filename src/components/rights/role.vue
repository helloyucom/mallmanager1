<template>
  <el-card class="card-box">
    <!-- 1. 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 2. 添加角色按钮 -->
    <el-row>
      <el-col>
        <el-button type="info" @click="showAddRoleDia()">添加角色</el-button>
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
            @click="showEditRoleDia(scope.row)"
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
        ref="tree"
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
    <!-- 对话框-添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAddRole" @close="form={}">
      <el-form :model="form" label-width="auto">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" autocomplete="off" ref="addRoleInput"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddRole = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRole()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框-编辑角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleEditRole" @close="form={}">
      <el-form :model="form" label-width="auto">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" autocomplete="off" ref="editRoleInput"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditRole = false">取 消</el-button>
        <el-button type="primary" @click="handleEditRole()">确 定</el-button>
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
      currentRoleId: "", // 当前需要修改权限的角色的id
      defaultProps: {
        children: "children",
        label: "authName"
      },
      // 添加角色
      dialogFormVisibleAddRole: false,
      dialogFormVisibleEditRole: false,
      form: {
        roleName: "",
        roleDesc: ""
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    /** 编辑角色-发送请求 */
    async handleEditRole() {
      const res = await this.$http.put(`roles/${this.form.id}`, this.form)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.dialogFormVisibleEditRole = false
        this.$message.success('成功修改角色')
      } else {
        this.$message.warning('失败修改角色')
      }
    },
    /** 编辑角色-显示对话框 */
    showEditRoleDia(role) {
      // roles/:id
      this.form = role
      this.dialogFormVisibleEditRole = true
      this.$nextTick(function() {
        this.$refs.editRoleInput.$el.querySelector("input").focus();
      });
    },
    /** 添加角色-发送请求 */
    async handleAddRole() {
      const res = await this.$http.post(`roles`, this.form);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.getRoleList();
      } else {
        this.$message.warning(msg);
      }
      this.dialogFormVisibleAddRole = false;
    },
    /** 添加角色-显示对话框 */
    showAddRoleDia() {
      this.dialogFormVisibleAddRole = true;
      this.$nextTick(function() {
        this.$refs.addRoleInput.$el.querySelector("input").focus();
      });
    },
    /** 显示删除角色-确认对话框 */
    showDelUserMsgBox(roleId) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // roles/:id
          const res = await this.$http.delete(`roles/${roleId}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getRoleList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /** 获取所有全选后半选的节点的id */
    getAllNodes(leafOnly, includeHalfChecked) {
      console.log(leafOnly, includeHalfChecked);
    },
    /** handle点击确定-发起请求-设置角色权限 */
    async handleSetRoleRight() {
      // 1. 获取当前角色的id -> roleId  从data选项中获取 -> 打开对话框时设置
      // 2. 获取选择权限的权限id数组 rids
      let arr1 = this.$refs.tree.getCheckedKeys(),
        arr2 = this.$refs.tree.getHalfCheckedKeys();
      let rids = [...arr1, ...arr2];
      // 3. 发送请求
      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: rids.join(",")
      });
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      // 4. 更新视图
      this.getRoleList();
      // 5. 关闭对话框
      this.dialogVisibleSetRole = false;
    },
    /** 分配/修改权限 */
    async showSetRightDia(role) {
      // 获取系统所有权限的树形列表
      this.currentRoleId = role.id;
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