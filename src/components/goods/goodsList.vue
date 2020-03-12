<template>
  <el-card class="card-box">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 搜索框 -->
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
          clearable
          @clear="clearGoods()"
        >
          <el-button @click="searchGoods()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        <el-button type="success" @click="showAddGoodsDialog()">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="goodlist" border style="width: 100%" height="450">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">
          {{scope.row.add_time | fmtDate}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 搜索
      query: "",
      // 商品列表
      goodlist: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    /** 清空搜索框 */
    clearGoods() {
        this.query = ''
        this.pagenum = 1
        this.getGoodsList()
    },
    /** 搜索商品 */
    async searchGoods() {
      this.pagenum = 1;
      this.getGoodsList();
    },
    /** 每页条数发生变化 */
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getGoodsList();
    },
    /**页码发生变化 */
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsList();
    },
    /** 分页获取商品列表 */
    async getGoodsList() {
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        data: { total, goods },
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.total = total;
        this.goodlist = goods;
      }
    }
  }
};
</script>
<style>
.card-box {
  height: 100%;
}
.searchRow {
  margin-bottom: 16px;
}
</style>