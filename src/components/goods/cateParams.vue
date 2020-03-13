<template>
  <el-card class="card-box">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 提示 -->
    <el-alert title="只允许为第三级分类设置参数" type="warning"></el-alert>
    <!-- 级联选择器 -->
    <el-form label-position="left" label-width="80px" :model="form" style="margin: 8px auto">
      <el-form-item label="商品分类">
        <el-cascader
          :show-all-levels="false"
          v-model="selectedOptions"
          :props="defaultProps"
          :options="options"
          @change="handleChange()"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tabs -->
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <!-- 按钮 -->
        <el-button type="danger" @click="showAddDyparamsDia()">设置动态参数</el-button>
        <el-table :data="arrDyparams" border style="width: 50%">
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              <!-- el-tag -->
              <el-tag
                :key="i"
                v-for="(tag, i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, i)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput()">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
                @click="showEditGoodsMsgBox(scope.row.goods_id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
                @click="deleteDyparams(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <!-- 按钮 -->
        <el-button type="danger">设置静态参数</el-button>
        <el-table :data="arrStaticparams"  style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
                @click="showEditStaticparamsMsgBox(scope.row.goods_id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
                @click="deleteStaticparams(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 对话框 -->
    <!-- 添加动态参数-对话框 -->
    <el-dialog title="添加动态参数" :visible.sync="dialogFormVisibleAddDyparams">
      <el-form :model="formDyparam" :rules="rules">
        <el-form-item label="属性名称" label-width="600" prop="attr_name">
          <el-input v-model="formDyparam.attr_name" autocomplete="off" ref="DyAttrname"></el-input>
        </el-form-item>
        <el-form-item>
          <el-tag
            :key="i"
            v-for="(tag, i) in formDyparam.attr_vals"
            closable
            :disable-transitions="false"
            @close="handleCloseDyparams(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisibleDyparams"
            v-model="inputValueDyparams"
            ref="saveTagInputDyparams"
            size="small"
            @keyup.enter.native="handleInputConfirmDyparams()"
            @blur="handleInputConfirmDyparams()"
          ></el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInputDyparams()"
          >+ New Tag</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddDyparams = false">取 消</el-button>
        <el-button type="primary" @click="setDyparams()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑动态参数-对话框 还没有写-->
    <!-- <el-dialog title="编辑动态参数" :visible.sync="dialogFormVisibleEditDyparams">
      <el-form :model="formDyparam" :rules="rules">
        <el-form-item label="属性名称" label-width="600" prop="attr_name">
          <el-input v-model="formDyparam.attr_name" autocomplete="off" ref="DyAttrname"></el-input>
        </el-form-item>
        <el-form-item>
          <el-tag
            :key="i"
            v-for="(tag, i) in formDyparam.attr_vals"
            closable
            :disable-transitions="false"
            @close="handleCloseDyparams(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisibleDyparams"
            v-model="inputValueDyparams"
            ref="saveTagInputDyparams"
            size="small"
            @keyup.enter.native="handleInputConfirmDyparams()"
            @blur="handleInputConfirmDyparams()"
          ></el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInputDyparams()"
          >+ New Tag</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddDyparams = false">取 消</el-button>
        <el-button type="primary" @click="setDyparams()">确 定</el-button>
      </div>
    </el-dialog>-->
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 级联选择器
      selectedOptions: [],
      //   selectedOptions: [],
      options: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      form: {},
      arrDyparams: [],
      active: "1",
      // el-tag
      inputVisible: false,
      inputValue: "",
      // 动态参数添加
      dialogFormVisibleAddDyparams: false,
      formDyparam: {
        attr_name: "",
        attr_vals: [],
        attr_sel: "many"
      },
      inputVisibleDyparams: false,
      inputValueDyparams: "",
      // 表单验证
      rules: {
        attr_name: [
          { required: true, message: "请输入属性名称", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      // 静态参数
      arrStaticparams: []
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    /** 显示动态参数-编辑对话框 */
    dialogFormVisibleEditDyparams() {},
    /** 设置动态参数-请求接口 */
    async setDyparams() {
      if (
        this.formDyparam.attr_name === "" ||
        this.formDyparam.attr_vals.length === 0
      ) {
        this.$message.warning("属性名称或属性值为空");
        return;
      }
      const res = await this.$http.post(
        `categories/${this.selectedOptions[2]}/attributes`,
        {
          attr_name: this.formDyparam.attr_name,
          attr_sel: this.formDyparam.attr_sel,
          attr_vals: this.formDyparam.attr_vals.join(",")
        }
      );
      this.handleChange();
      this.formDyparam.attr_name = "";
      this.formDyparam.attr_vals = [];
      this.dialogFormVisibleAddDyparams = false;
    },
    /** 添加动态参数-关闭标签 */
    handleCloseDyparams(tag) {
      this.formDyparam.attr_vals.splice(
        this.formDyparam.attr_vals.indexOf(tag),
        1
      );
    },
    /** 添加动态参数-input和button切换 */
    showInputDyparams() {
      this.inputVisibleDyparams = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInputDyparams.$refs.input.focus();
      });
    },
    /** 添加动态参数-输入完标签 */
    handleInputConfirmDyparams() {
      let inputValueDyparams = this.inputValueDyparams;
      if (inputValueDyparams) {
        this.formDyparam.attr_vals.push(inputValueDyparams);
      }
      this.inputVisibleDyparams = false;
      this.inputValueDyparams = "";
    },
    /** 显示添加设置动态参数对话框 */
    showAddDyparamsDia() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请选择商品三级分类");
        return;
      }
      this.dialogFormVisibleAddDyparams = true;
      this.$nextTick(_ => {
        this.$refs.DyAttrname.$refs.input.focus();
      });
    },
    /** 删除参数 */ async deleteDyparams(row) {
      const res = await this.$http.delete(
        `categories/${this.selectedOptions[2]}/attributes/${row.attr_id}`
      );
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.arrDyparams.splice(this.arrDyparams.indexOf(row), 1);
      }
    },
    /** 提交input中输入的内容 */
    async handleInputConfirm(attr) {
      if (this.inputValue !== "") {
        this.inputVisible = false;
        attr.attr_vals.push(this.inputValue);
        this.inputValue = "";
        // 更新动态属性参数
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
          {
            attr_name: attr.attr_name,
            attr_sel: "many",
            attr_vals: attr.attr_vals.join(",")
          }
        );
      }
    },
    /** 点击new tag -> input输入框显示 */
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    /* el-tag关闭时 */
    async handleClose(attr, index) {
      attr.attr_vals.splice(index, 1);
      // 更新动态属性参数
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
        {
          attr_name: attr.attr_name,
          attr_sel: "many",
          attr_vals: attr.attr_vals.join(",")
        }
      );
    },
    /* tabs切换时 */
    handleClick() {},
    /** 级联选择器发生改变时 */
    async handleChange() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请选择商品三级分类");
        return;
      }
      // 获取动态参数
      if (this.active === "1") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        const {
          data,
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.arrDyparams = data;
          this.arrDyparams.forEach(element => {
            element.attr_vals =
              element.attr_vals.length === 0
                ? []
                : element.attr_vals.trim().split(",");
          });
        }
      }
      // 获取静态参数
      if (this.active === "2") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        const {
          data,
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.arrStaticparams = data;
          this.arrStaticparams.forEach(element => {
            element.attr_vals =
              element.attr_vals.length === 0
                ? []
                : element.attr_vals.trim().split(",");
          });
        }
      }
    },
    /** 获取商品三级分类数据 */
    async getCategories() {
      const res = await this.$http.get(`categories?type=3`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      this.options = data;
    }
  }
};
</script>
<style>
.card-box {
  height: 99%;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>