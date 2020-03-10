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
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
          clearable
          @clear="clearUser()"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDialog()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建时间">
        <!-- 如果单元格内显示的内容不是字符串（文本）
         需要给被显示的内容包裹一个template
        -->

        <!-- template内部要用数据 设置slot-scope属性
        该属性的值是要用数据create_time的数据源userlist-->

        <!-- slot-scope的值userlist其实就是el-table绑定的数据userlist
        userlist.row -> 数组中的每个对象-->
        <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeMgState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 -->
    <!-- 对话框-添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框-编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <!-- 对话框关闭时情况form数据 -->
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEditUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框-分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">{{currentUsername}}</el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-select v-model="currentRoleId">
            <el-option label="请选择" :value="-1" disabled></el-option>
            <el-option label="超级管理员" :value="0" disabled></el-option>
            <el-option
              v-for="(item, key) in roles"
              :key="key"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "", // 搜索内容
      pagenum: 1, // 第几页
      pagesize: 5, // 一页几条数据
      userlist: [], // 表格数据
      total: 0, // 总数
      // 对话框-添加
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false, // 编辑用户对话框显示/隐藏
      dialogFormVisibleRole: false, // 分配橘色对话框显示/隐藏
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      /** 分配角色 */
      currentUserId: -1, // 当前用户的id
      currentRoleId: -1, // 当前用户的角色id
      currentUsername: "", // 分配角色对话框中显示的当前用户名
      roles: [] // 角色列表
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    /** 设置用户角色-请求数据 */
    async setRole() {
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      });
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleRole = false;
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
      // 这个接口有问题，后台服务会报错
    },
    /** 显示当前用户的角色-对话框 */
    async showUserRoleDialog(user) {
      // 当前用户的id
      this.currentUserId = user.id;
      // 当前用户角色名显示
      this.currentUsername = user.username;
      // 获取角色列表
      const res = await this.$http.get(`roles`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }
      // 当前用户的角色id赋值给currentRoleId
      const res2 = await this.$http.get(`users/${user.id}`);
      this.currentRoleId = res2.data.data.rid; // 接口文档xiede是role_id，写错了
      // 打开对话框
      this.dialogFormVisibleRole = true;
    },
    /** 修改用户状态 */
    async changeMgState(user) {
      // users/:uId/state/:type
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg);
      } else {
        this.$message.warning(res.data.meta.msg);
      }
    },
    /** 编辑用户-提交数据 */
    async handleEditUser(userId) {
      // 关闭对话框
      this.dialogFormVisibleEdit = false;
      // 提交数据
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        // 提示
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      // 刷新列表
      this.getUserList();
    },
    /** 编辑用户-显示对话框 */
    showEditUserDialog(user) {
      // 获取用户数据
      this.form = user;
      // 显示编辑对话框
      this.dialogFormVisibleEdit = true;
    },
    /** 删除用户-显示确认框 */
    showDelUserMsgBox(userId) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userId}`);
          if (res.data.meta.status === 200) {
            // 提示
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            // 回到首页
            this.pagenum = 1;
            // 更新视图
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /** 添加用户-提交数据 */
    async handleAddUser() {
      // 关闭对话框
      this.dialogFormVisibleAdd = false;
      // 提交数据
      const res = await this.$http.post(`users`, this.form);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 201) {
        // 提示
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      // 刷新列表
      this.getUserList();
      // 清空表单
      this.form = {};
    },
    /** 添加用户-显示对话框 */
    showAddUserDialog() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    /** 清除搜索框 */
    clearUser() {
      this.getUserList();
    },
    /** 搜索用户 */
    searchUser() {
      this.getUserList();
    },
    /** 分页 页码变化 每页条数变化 */
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUserList();
    },
    /** 分页请求用户数据 */
    async getUserList() {
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        data: { total, pagenum, users },
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.userlist = users;
        this.total = total;
        //   this.$message.success(msg);
      } else {
        //   this.$message.success(msg);
      }
    }
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
