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
        <el-tab-pane name="2" label="商品参数">
          <!-- 展示三级商品分类的动态参数 -->
          <el-form-item :label="item1.attr_name" v-for="(item1, i) in arrDyparams" :key="i">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2, i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <!-- 展示三级商品分类的静态参数 -->
          <!-- <el-form-item :label="item1.attr_name" v-for="(item1, i) in arrStaticparams" :key="i">
            <el-input v-model="item1.attr_vals"></el-input>
          </el-form-item>-->
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <!-- 上传图片 -->
          <!-- <el-form-item>
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
          <el-tab-pane name="5" label="商品内容" :disabled="disabled">-->
          <!-- 富文本 -->
          <!-- <el-form-item>
            <el-button type="primary" @click="handleAddGoods()">点我-添加商品</el-button>
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>-->
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
export default {
  created() {
    this.getGoodsById(this.$route.params.goodsId);
    this.getCategories();
  },
  data() {
    return {
      active: "1",
      form: {},
      // 级联选择器
      selectedOptions: [],
      options: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      }
    };
  },
  methods: {
    handleChange() {},
    /** 获取商品三级分类数据 */
    async getCategories() {
      const res = await this.$http.get(`categories?type=3`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      this.options = data;
    },
    /** 根据商品id获取商品信息 */
    async getGoodsById(goodsId) {
      const res = await this.$http.get(`goods/${goodsId}`);
      this.form = res.data.data;
      let arrTemp = this.form.goods_cat.split(",");
      this.selectedOptions = arrTemp.map(element => {
        return 1*element;
      });
    },
    /** switch tabs */
    changeTabs() {}
  }
};
</script>
<style>
</style>