<template>
  <el-card class="card-box">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 提示 -->
    <el-alert title="添加商品信息" type="success" center show-icon></el-alert>
    <!-- 步骤 -->
    <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tabs便签页 -->
    <el-form
      label-position="top"
      label-width="80px"
      :model="form"
      style="height: 400px; overflow: auto;"
    >
      <el-tabs v-model="active" tab-position="left" @tab-click="changeTabs()">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-cascader
            v-model="selectedOptions"
            :props="defaultProps"
            :options="options"
            @change="handleChange()"
            filterable
            clearable
          ></el-cascader>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数" :disabled="disabled">
          <!-- 展示三级商品分类的动态参数 -->
          <el-form-item :label="item1.attr_name" v-for="(item1, i) in arrDyparams" :key="i">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2, i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性" :disabled="disabled">
          <!-- 展示三级商品分类的静态参数 -->
          <el-form-item :label="item1.attr_name" v-for="(item1, i) in arrStaticparams" :key="i">
            <el-input v-model="item1.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片" :disabled="disabled">
          <!-- 上传图片 -->
          <el-form-item>
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headers"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容" :disabled="disabled">
          <!-- 富文本 -->
          <el-form-item>
            <el-button type="primary" @click="handleAddGoods()">点我-添加商品</el-button>
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    /** 添加商品-请求接口时需要提交的数据分析 */
    // 1. 不用处理数据
    // goods_name 商品名称 不能为空
    // goods_price 价格 不能为空
    // goods_weight 重量 不能为空
    // goods_number 数量 不能为空
    // goods_introduce 介绍 可以为空

    // 2. 需要处理地数据
    // goods_cat 以为','分割的分类列表 不能为空
    // selectedOptions arr -> str ','

    // pics 上传的图片临时路径（对象）可以为空 - 在上传/移除图片中处理

    // attrs 商品的参数（数组），包含 `动态参数` 和 `静态属性` 可以为空
    return {
      active: "1",
      // 基本信息
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      // 级联选择器
      selectedOptions: [1, 3, 6],
      //   selectedOptions: [],
      options: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      disabled: false, // 废弃
      // 动态参数
      arrDyparams: [],
      checkedList: [],
      // 静态参数
      arrStaticparams: [],
      // 上传图片
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    /** 添加商品-发送请求 */
    async handleAddGoods() {
      // 处理商品分类 arr -> string(',')
      this.form.goods_cat = this.selectedOptions.join(",");
      // 处理图片上传临时路径的数组 -> 在添加图片和移除图片中处理
      // 处理动态参数和静态参数
      let arr1 = this.arrDyparams.map(item => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
      });
      let arr2 = this.arrStaticparams.map(item => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
      });
      this.form.attrs = [...arr1, ...arr2];
      const res = await this.$http.post(`goods`, this.form)
      const {meta: {msg, status}} = res.data
      this.$router.push({name: 'goods'})
      if (status === 201) {
          this.$message.success(msg)
      } else {
          this.$message.warning(msg)
      }
    },
    /** 上传图片时的相关方法 */
    handlePreview(file) {
      // file.response.data.tmp_path
    },
    handleRemove(file) {
      let index = this.form.pics.findIndex(value => {
        return value === file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
      // file.response.data.tmp_path
    },
    handleSuccess(file) {
      this.form.pics.push({ pic: file.data.tmp_path });
      // file.data.tmp_path
    },
    /** tabs改变时-动态参数 */
    async changeTabs() {
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请选择商品三级分类");
          return;
        }
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
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请选择商品三级分类");
          return;
        }
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        const {
          data,
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.arrStaticparams = data;
          //   this.arrStaticparams.forEach(element => {
          //     element.attr_vals =
          //       element.attr_vals.length === 0
          //         ? []
          //         : element.attr_vals.trim().split(",");
          //   });
        }
      }
    },
    handleChange(value) {
      // this.disabled = false
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
.ql-container {
  min-height: 500px;
}
</style>