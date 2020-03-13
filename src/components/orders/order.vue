<template>
  <el-card class="card-box">
    <!-- 面包屑 -->
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <!-- table -->
    <el-table :data="orderList" style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column label="是否付款">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.order_pay === '0'">未付款</el-tag>
              <el-tag type="success" v-else>已付款</el-tag>
          </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column label="下单时间">
          <template slot-scope="scope">
              {{scope.row.create_time | fmtDate}}
          </template>
      </el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
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
/** 导入城市列表 */
import cityList from '@/assets/city_list_download.js'

export default {
  data() {
    return {
      orderList: [],
      query: "",
      pagenum: 1,
      pagesize: 10,
      total: 0
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    /** 每页条数发生改变 */
    handleSizeChange(val) {
        this.pagenum = 1
        this.pagesize = val
        this.getOrdersList()
    },
    /** 当前页发生改变 */
    handleCurrentChange(val) {
        this.pagenum = val
        this.getOrdersList()
    },
    /** 获取订单数据-请求接口 */
    async getOrdersList() {
      const res = await this.$http.get(`orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      const {data: {total, pagenum, goods}, meta: {msg, status}} = res.data
      this.total = total
      this.orderList = goods
    }
  }
};
</script>
<style>
</style>