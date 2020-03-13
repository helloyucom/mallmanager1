<template>
  <el-card class="card-box">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!-- 添加分类按钮 -->
    <el-row>
      <el-col>
        <el-button type="success" @click="showAddCategoriesDia()">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="categoriesList" style="width: 100%" height="400">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        levelKey="cat_level"
        parentKey="cat_pid"
        treeKey="cat_id"
        folderIcon
        :indentSize="14"
        child-key="children"
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-if="scope.row.cat_level === 1">二级</span>
          <span v-if="scope.row.cat_level === 3">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted">无效</span>
          <span v-else>有效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
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
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd" width="40%">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="80px">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="80px">
          <el-cascader
            v-model="selectedOptions"
            :props="defaultProps"
            :options="options"
            @change="handleChange()"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCategories()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
// 引入element table的插件 element-tree-grid
var ElTreeGrid = require("element-tree-grid");
export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      total: 0,
      pagenum: 1,
      pagesize: 5,
      categoriesList: [],
      // 添加分类
      dialogFormVisibleAdd: false,
      form: {
          cat_pid: 0,
          cat_name: '',
          cat_level: 0
      },
      // 级联选择器
      selectedOptions: [],
      options: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      }
    };
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
    /** 添加分类-提交数据 */
    async handleAddCategories() {
      // 关闭添加分类对话框
      this.dialogFormVisibleAdd = false;
      // 提交数据
      if (this.selectedOptions.length === 2) {
        this.form.cat_level = 2;
        this.form.cat_pid = this.selectedOptions[1];
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_level = 1;
        this.form.cat_pid = this.selectedOptions[0];
      }
    //   console.log({...this.form})
      const res = await this.$http.post(`categories`, this.form)
      this.getCategoriesList()
    },
    /** 三级分类发生改变时 */
    handleChange() {},
    /** 添加分类 */
    showAddCategoriesDia() {
      this.getCategories();
      this.dialogFormVisibleAdd = true;
    },
    /** 获取商品三级分类数据 */
    async getCategories() {
      const res = await this.$http.get(`categories?type=2`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      this.options = data;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getCategoriesList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getCategoriesList();
    },
    async getCategoriesList() {
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        data: { total, pagenum, pagesize, result },
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.total = total;
        this.categoriesList = result;
      }
    }
  }
};
</script>
<style>
</style>