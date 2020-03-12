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
      <el-tabs v-model="active" tab-position="left">
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
        <el-tab-pane name="2" label="商品参数">商品参数</el-tab-pane>
        <el-tab-pane name="3" label="商品属性">商品属性</el-tab-pane>
        <el-tab-pane name="4" label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane name="5" label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
export default {
  data() {
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
        pics: "",
        attrs: ""
      },
      // 级联选择器
      selectedOptions: [1, 3, 6],
      options: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      }
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    handleChange(value) {},
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
</style>